import Link from 'next/link';
import MobileMenu from './MobileMenu';

function Signature() {
  return <span className="bureau-wordmark"><svg className="bureau-seal" width="44" height="46" viewBox="0 0 44 46" fill="none" aria-hidden="true">
    <path d="M4 40.5h36M7.5 37.5V22a14.5 14.5 0 0 1 29 0v15.5M11.5 37.5V22a10.5 10.5 0 0 1 21 0v15.5M15.5 37.5v-15a6.5 6.5 0 0 1 13 0v15" stroke="currentColor" strokeWidth="1.15"/>
    <path d="M22 0v3.5M4 10l3 2M40 10l-3 2M20 40.5l2-9 2 9" stroke="currentColor" strokeWidth="1.1"/>
  </svg><span className="wordmark-text">Тихий свет<small>Похоронное бюро</small></span></span>;
}

const pages = [['/#services','Церемонии'],['/collection/','Коллекция'],['/ceremonies/memorials/','Мемориалы']];

function Links() {
  return <>{pages.map(([url,title])=><Link href={url} prefetch={false} key={url}>{title}</Link>)}</>;
}

export function BureauHeader() {
  return <header className="bureau-header">
    <a className="bureau-skip" href="#main-content">Перейти к содержанию</a>
    <Link href="/" className="brand-home" prefetch={false} aria-label="Тихий свет — главная"><Signature/></Link>
    <nav className="bureau-nav" aria-label="Разделы бюро"><Links/></nav>
    <Link href="/guide/" prefetch={false} className="bureau-guide-link">Памятка для семьи</Link>
    <MobileMenu><Links/><Link href="/guide/" prefetch={false}>Памятка для семьи</Link></MobileMenu>
  </header>;
}

export function BureauFooter() {
  return <footer className="bureau-footer">
    <div className="foot-main"><Link href="/" prefetch={false} aria-label="Тихий свет — главная"><Signature/></Link>
      <nav aria-label="Навигация в подвале"><Links/><Link href="/guide/" prefetch={false}>Памятка для семьи</Link></nav></div>
    <div className="foot-note"><p>Демонстрационный проект. Изделия и пространства представлены в визуализациях.</p>
    <a href="/directions/sites/">Студия 007-А</a></div>
  </footer>;
}
