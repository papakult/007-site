"""Build, check, preview and stage the static OPORA publication."""
import argparse
from functools import partial
from html.parser import HTMLParser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from shutil import copyfile
import subprocess
import sys
from tempfile import TemporaryDirectory, NamedTemporaryFile
from urllib.parse import unquote, urljoin, urlsplit

EDITORIAL = Path(__file__).resolve().parent
APP = EDITORIAL.parent
REPO = APP.parent.parent
PREFIX = 'directions/sites/construction'
PUBLISHED = REPO / PREFIX
OUTPUT = APP / 'out'
ORIGIN = 'https://007-a.ru/'


class Document(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.counts = {'title': 0, 'h1': 0}
        self.ids = set()
        self.urls = []

    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if tag in self.counts:
            self.counts[tag] += 1
        if data.get('id'):
            if data['id'] in self.ids:
                raise ValueError(f"duplicate ID {data['id']}")
            self.ids.add(data['id'])
        if tag == 'form':
            raise ValueError('unexpected form')
        for attr in ('href', 'src', 'poster'):
            if data.get(attr):
                self.urls.append(data[attr])
        for attr in ('srcset', 'imagesrcset'):
            for field in (data.get(attr) or '').split(','):
                if field.strip():
                    self.urls.append(field.split()[0])


def verify(folder):
    if not (folder / 'index.html').is_file():
        raise ValueError('Missing home page. Run npm run build.')
    documents = {}
    for file in sorted(folder.rglob('*.html')):
        relative = file.relative_to(folder)
        html = Document()
        try:
            html.feed(file.read_text(encoding='utf-8'))
            html.close()
        except ValueError as error:
            raise ValueError(f'{relative}: {error}') from error
        if html.counts != {'title': 1, 'h1': 1}:
            raise ValueError(f'{relative}: expected one title and one main heading')
        documents[(Path(PREFIX) / relative).as_posix()] = html
    if len(documents) < 2:
        raise ValueError('The editorial export must include the linked project and service pages.')
    for route, doc in documents.items():
        for ref in doc.urls:
            url = urlsplit(urljoin(ORIGIN + route, ref))
            if url.scheme not in ('http', 'https') or url.hostname not in ('007-a.ru', 'www.007-a.ru'):
                continue
            name = unquote(url.path).lstrip('/')
            if not name or name.endswith('/'):
                name += 'index.html'
            if name in documents:
                if url.fragment and unquote(url.fragment) not in documents[name].ids:
                    raise ValueError(f'{route}: missing anchor {ref}')
            else:
                canonical = (REPO / name).resolve()
                if not canonical.is_relative_to(REPO) or not canonical.is_file():
                    raise ValueError(f'{route}: missing target {ref}')
    return sorted(Path(name).relative_to(PREFIX) for name in documents)


def build():
    # Validate the entire new export before replacing the previous local preview.
    with TemporaryDirectory(dir=APP) as temp:
        fresh = Path(temp) / 'pages'
        fresh.mkdir()
        subprocess.run([sys.executable, '-B', str(EDITORIAL / 'build.py'), str(fresh)], check=True)
        pages = verify(fresh)
        previous = Path(temp) / 'previous'
        if OUTPUT.exists():
            OUTPUT.rename(previous)
        try:
            fresh.rename(OUTPUT)
        except OSError:
            if previous.exists():
                previous.rename(OUTPUT)
            raise
    print(f'Generated {len(pages)} pages in {OUTPUT}')


def stage():
    # Generated HTML shares its public directory with hand-edited styles, scripts and media.
    pages = verify(OUTPUT)
    for page in pages:
        destination = PUBLISHED / page
        destination.parent.mkdir(parents=True, exist_ok=True)
        with NamedTemporaryFile(dir=destination.parent, delete=False) as handle:
            temporary = Path(handle.name)
        try:
            copyfile(OUTPUT / page, temporary)
            temporary.chmod(0o644)
            temporary.replace(destination)
        finally:
            temporary.unlink(missing_ok=True)
    print(f'Staged {len(pages)} HTML pages in {PUBLISHED}')


class Preview(SimpleHTTPRequestHandler):
    def send_head(self):
        public = Path(unquote(urlsplit(self.path).path))
        resolved = Path(self.translate_path(self.path)).resolve()
        if any(part.startswith('.') for part in public.parts) or not resolved.is_relative_to(REPO):
            self.send_error(404)
            return None
        return super().send_head()

    def translate_path(self, path):
        base = Path(super().translate_path(path))
        if base.is_relative_to(PUBLISHED):
            relative = base.relative_to(PUBLISHED)
            candidate = OUTPUT / relative
            if candidate.suffix == '.html' and candidate.is_file():
                return str(candidate)
            if path.split('?', 1)[0].endswith('/') and (candidate / 'index.html').is_file():
                return str(candidate / 'index.html')
            if not base.exists() and candidate.is_dir():
                return str(candidate)
        return str(base)

    def list_directory(self, path):
        self.send_error(404)
        return None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=('build', 'verify', 'stage', 'dev', 'lint'))
    parser.add_argument('--port', '-p', default=3000, type=int)
    parser.add_argument('--hostname', default='127.0.0.1')
    args = parser.parse_args()
    if args.command == 'lint':
        for source in EDITORIAL.glob('*.py'):
            compile(source.read_bytes(), str(source), 'exec')
        return
    if args.command in ('build', 'dev'):
        build()
    if args.command == 'verify':
        print(f'Verified {len(verify(OUTPUT))} pages.')
    elif args.command == 'stage':
        stage()
    elif args.command == 'dev':
        handler = partial(Preview, directory=str(REPO))
        with ThreadingHTTPServer((args.hostname, args.port), handler) as server:
            print(f'OPORA preview: http://{args.hostname}:{server.server_port}/{PREFIX}/', flush=True)
            try:
                server.serve_forever()
            except KeyboardInterrupt:
                pass


if __name__ == '__main__':
    try:
        main()
    except (OSError, ValueError, subprocess.CalledProcessError) as error:
        sys.exit(str(error))
