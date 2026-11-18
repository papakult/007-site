import Image from 'next/image';
import {
  bureauPath, categories, categoryFor, collectionPath, pieces, platePath,
  type Category, type CollectionPiece,
} from '@/lib/collection';
import './collection.css';

function Plate({ piece, priority = false, sizes }: { piece: CollectionPiece; priority?: boolean; sizes: string }) {
  return <Image fill src={platePath(piece.image)} alt={piece.alt} sizes={sizes} preload={priority} />;
}

function ObjectCard({ piece, priority = false }: { piece: CollectionPiece; priority?: boolean }) {
  return <a className="gallery-object" href={collectionPath + piece.slug + '/'}>
    <div className="gallery-object-image"><Plate piece={piece} priority={priority} sizes="(max-width: 580px) 95vw, (max-width: 900px) 46vw, 32vw" /></div>
    <div className="gallery-object-caption">
      <span className="gallery-kicker">{piece.kind}</span>
      <h3>{piece.title}</h3>
      <span className="gallery-medium">{piece.material}</span>
    </div>
  </a>;
}

function CategoryLinks({ active }: { active?: Category }) {
  return <nav aria-label="Категории коллекции" className="gallery-filter">
    <a aria-current={!active ? 'page' : undefined} href={collectionPath + '#gallery'}>Все предметы</a>
    {categories.map(item =>
      <a key={item.slug} href={collectionPath + item.slug + '/'} aria-current={active?.slug === item.slug ? 'page' : undefined}>{item.title}</a>,
    )}
  </nav>;
}

function Crumbs({ current }: { current: string }) {
  return <nav className="gallery-crumbs" aria-label="Навигационная цепочка">
    <a href={bureauPath + '/'}>Бюро</a><span aria-hidden="true">/</span>
    <a href={collectionPath}>Коллекция</a><span aria-hidden="true">/</span>
    <span aria-current="page">{current}</span>
  </nav>;
}

export function Catalog({ category }: { category?: Category }) {
  const selection = category ? pieces.filter(piece => piece.category === category.slug) : pieces;
  const cover = pieces.find(piece => piece.slug === 'medalyon')!;

  return <main className="gallery-site" id="main-content">
    {category ? <div className="gallery-section gallery-category-title">
      <Crumbs current={category.title} />
      <h1>{category.title}</h1>
      <p>{category.description}</p>
    </div> : <section className="gallery-cover">
      <div className="gallery-cover-copy">
        <p className="gallery-kicker">Коллекция бюро</p>
        <h1>Предметы<br /><em>памяти</em></h1>
        <p className="gallery-cover-text">От медальона, который носят каждый день, до камня, на котором остаётся имя.</p>
        <a className="gallery-cover-link" href="#gallery">Смотреть коллекцию</a>
      </div>
      <a className="gallery-cover-photo" href={collectionPath + cover.slug + '/'}>
        <Plate piece={cover} priority sizes="(max-width: 720px) 100vw, 56vw" />
        <span>Медальон <b aria-hidden="true">·</b> Платина</span>
      </a>
    </section>}
    <section className="gallery-section gallery-shelf" id="gallery" aria-label="Каталог предметов">
      {!category && <h2>Коллекция</h2>}
      <CategoryLinks active={category} />
      <div className="gallery-grid">
        {selection.map((piece, index) => <ObjectCard piece={piece} key={piece.slug} priority={!!category && index === 0} />)}
      </div>
    </section>
  </main>;
}

export function PieceDetail({ piece }: { piece: CollectionPiece }) {
  const category = categoryFor(piece.category);
  const activeSiblings = pieces.filter(item => item.category === piece.category && item.slug !== piece.slug);
  const others = [...activeSiblings, ...pieces.filter(item => item.category !== piece.category)].slice(0, 3);

  return <main className="gallery-site" id="main-content">
    <div className="gallery-section gallery-detail-shell">
      <Crumbs current={piece.title} />
      <div className="gallery-detail">
        <figure className="gallery-detail-art">
          <div className="gallery-detail-image">
            <Plate piece={piece} priority sizes="(max-width: 800px) 95vw, 54vw" />
          </div>
          <figcaption><span>{piece.material}</span><a href={platePath(piece.image)}>Открыть изображение</a></figcaption>
        </figure>
        <article className="gallery-detail-copy">
          <a className="gallery-kicker" href={collectionPath + category.slug + '/'}>{category.title}</a>
          <h1>{piece.title}</h1>
          <p className="gallery-kind">{piece.kind}</p>
          <p className="gallery-description">{piece.description}</p>
          <dl className="gallery-spec">{piece.details.map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl>
          <div className="gallery-notes"><h2>Что согласовать</h2><p>{piece.discussion}</p></div>
          <a className="gallery-detail-link" href={bureauPath + '/guide/'}>Открыть памятку для семьи</a>
        </article>
      </div>
    </div>
    <section className="gallery-section gallery-related" aria-labelledby="related-heading">
      <div className="gallery-related-heading"><h2 id="related-heading">Ещё в коллекции</h2><a href={collectionPath + '#gallery'}>Все предметы</a></div>
      <div className="gallery-grid">{others.map(other => <ObjectCard piece={other} key={other.slug} />)}</div>
    </section>
  </main>;
}
