import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ScrollCover from '../components/ScrollCover';
import { base, plate } from '../lib/site';

export const metadata: Metadata={alternates:{canonical:base+'/'}};
const formats=[
  {title:'Захоронение',image:'old-burial',alt:'Тенистая кладбищенская аллея в цветущем саду',text:'Прощание в зале и сопровождение семьи к месту захоронения.',url:'/ceremonies/burial/'},
  {title:'Кремация',image:'old-hall',alt:'Деревянный свод церемониального зала выходит окнами в сад',text:'Выбор зала, сценария встречи и мемориальной урны.',url:'/ceremonies/cremation/'}
];
const objects=[
  {title:'Ритуальные гробы',image:'casket',detail:'Орех и столярная работа',url:'caskets'},
  {title:'Мемориальные урны',image:'bronze',detail:'Бронза и керамика',url:'urns'},
  {title:'Памятные украшения',image:'pendant',detail:'Медальон под гравировку',url:'jewelry'},
  {title:'Траурная флористика',image:'wreath',detail:'Каллы, ирисы и зелень',url:'flowers'},
];
export default function Home(){
  return <main id="main-content" className="bureau-home">
    <ScrollCover/>
    <section className="formats paper-section" id="services" aria-labelledby="formats-heading">
      <div className="home-intro"><div><p className="rubric">Церемонии</p><h2 id="formats-heading">Форматы прощания</h2></div><p>Выберите формат, чтобы посмотреть, как проходит встреча и какие детали можно продумать заранее.</p></div>
      <div className="formats-grid">{formats.map(f=><Link prefetch={false} href={f.url} className="format-tile" key={f.url}>
        <figure><Image src={plate(f.image)} alt={f.alt} width={768} height={512} sizes="(max-width:680px) 100vw, 48vw"/></figure>
        <div className="format-info"><div><h3>{f.title}</h3><p>{f.text}</p></div><span className="line-link">Подробнее</span></div></Link>)}</div>
    </section>
    <section id="approach" aria-labelledby="memorial-heading" className="memory-feature">
      <div className="memorial-portrait"><Image src={plate('monument')} fill sizes="(max-width:760px) 100vw, 57vw" alt="Светлая каменная арка в мемориальном саду"/></div>
      <div className="memory-copy"><p className="rubric">Мемориальная мастерская</p><h2 id="memorial-heading">Память<br/><em>в камне</em></h2>
      <p>От одной плиты с именем до семейного сада. Посмотрите, как камень, надпись и посадки меняют облик места.</p><Link prefetch={false} className="line-link" href="/ceremonies/memorials/">Открыть мастерскую</Link></div>
    </section>
    <section className="objects paper-section" id="collection" aria-labelledby="collection-heading">
      <div className="home-intro"><div><p className="rubric">Каталог бюро</p><h2 id="collection-heading">Коллекция изделий</h2></div><Link className="line-link" href="/collection/" prefetch={false}>Вся коллекция</Link></div>
      <div className="home-objects">{objects.map(o=><Link key={o.url} href={'/collection/'+o.url+'/'} prefetch={false} className="object-tile"><figure><Image src={plate(o.image)} width={508} height={508} sizes="(max-width:680px) 48vw, 23vw" alt={o.title}/></figure><h3>{o.title}</h3><p>{o.detail}</p></Link>)}</div>
    </section>
    <aside id="first-hours" className="home-guide">
      <div id="contact"><p className="rubric">Первые часы</p><h2 id="guide-title">Памятка для семьи</h2><p>Что обсудить с близкими, какие вопросы задать бюро и как сверить смету перед церемонией.</p></div><Link className="outline-link" href="/guide/" prefetch={false}>Открыть памятку</Link>
    </aside>
  </main>;
}
