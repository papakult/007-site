import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { bureauPath, ceremonies, ceremonyHref, plateSrc } from '../../../lib/ceremonies';
import './ceremony.css';

type Route = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return ceremonies.map(({ slug }) => ({ slug }));
}

async function getCeremony(params: Route['params']) {
  const { slug } = await params;
  const ceremony = ceremonies.find(item => item.slug === slug);
  if (!ceremony) notFound();
  return ceremony;
}

export async function generateMetadata({ params }: Route): Promise<Metadata> {
  const ceremony = await getCeremony(params);
  return {
    title: ceremony.title,
    description: ceremony.introduction,
    alternates: { canonical: ceremonyHref(ceremony.slug) },
  };
}

export default async function CeremonyPage({ params }: Route) {
  const ceremony = await getCeremony(params);
  return (
    <main id="main-content" className="cer-page" data-ceremony={ceremony.slug}>
      <section className="cer-hero" aria-labelledby="cer-title">
        <div className="cer-hero-copy">
          <nav className="cer-crumb" aria-label="Хлебные крошки"><a href={`${bureauPath}/`}>Бюро</a><span aria-hidden="true">/</span><span>Направления</span></nav>
          <h1 id="cer-title">{ceremony.title}</h1>
          <p>{ceremony.introduction}</p>
          <a className="cer-link" href="#details">Подробнее о выборе</a>
        </div>
        <div className="cer-hero-image">
          <Image src={plateSrc(ceremony.hero.image)} alt={ceremony.hero.alt} fill preload sizes="(max-width: 740px) 100vw, 55vw" />
        </div>
      </section>
      <section className="cer-story" id="details" aria-labelledby="cer-choices">
        <div className="cer-story-intro"><h2 id="cer-choices">{ceremony.section}</h2><p>{ceremony.paragraph}</p></div>
        <div className="cer-spread">
          <figure className="cer-detail"><div><Image src={plateSrc(ceremony.detail.image)} alt={ceremony.detail.alt} fill sizes="(max-width: 740px) 100vw, 40vw" /></div><figcaption>{ceremony.detail.caption}</figcaption></figure>
          <dl className="cer-choices">{ceremony.choices.map(choice => <div key={choice.title}><dt>{choice.title}</dt><dd>{choice.description}</dd></div>)}</dl>
        </div>
      </section>
      <aside className="cer-collection" aria-labelledby="cer-objects">
        <div className="cer-collection-inner">
          <div className="cer-collection-picture"><Image src={plateSrc(ceremony.collection.image)} alt={ceremony.collection.alt} fill sizes="(max-width: 740px) 100vw, 40vw" /></div>
          <div className="cer-collection-copy"><h2 id="cer-objects">{ceremony.collection.title}</h2><p>{ceremony.collection.description}</p><a className="cer-link" href={`${bureauPath}/${ceremony.collection.href}`}>{ceremony.collection.link}</a></div>
        </div>
      </aside>
      <nav className="cer-related" aria-label="Ещё в бюро">
        {ceremonies.filter(item => item.slug !== ceremony.slug).map(item => <a key={item.slug} href={ceremonyHref(item.slug)}>{item.title}</a>)}
        <a href={`${bureauPath}/guide/`}>Памятка для семьи</a>
      </nav>
    </main>
  );
}
