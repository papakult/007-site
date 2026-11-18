import type { Metadata } from 'next';
import Image from 'next/image';
import { bureauPath, ceremonyHref, plateSrc } from '../../lib/ceremonies';
import PrintGuide from './PrintGuide';
import './guide.css';

export const metadata: Metadata = {
  title: 'Памятка для семьи',
  description: 'Короткий порядок первых договорённостей, вопросы для разговора с бюро и список сведений, которыми стоит поделиться с близкими.',
  alternates: { canonical: `${bureauPath}/guide/` },
};

const firstHours = [
  ['Позовите близкого человека', 'Попросите кого-то побыть с вами. Один человек сможет записывать договорённости, другой — ответить на звонки родственников.'],
  ['Запишите, что уже известно', 'Соберите в одном месте имена специалистов, с которыми вы уже говорили, время следующего звонка и вопросы, оставшиеся без ответа.'],
  ['Назовите важное для семьи', 'Вспомните пожелания человека, музыку, слова или обряд, которые для него много значили. Отметьте, кому из близких будет нужна помощь с дорогой.'],
  ['Сверьте договорённости', 'Передайте семье один согласованный план: адрес и вход, время сбора, маршрут после прощания и имя того, кто встретит гостей.'],
];

const questions = [
  ['О времени и месте', 'Сколько времени зал будет доступен семье? Могут ли самые близкие прийти немного раньше? Как найти вход и где высадить пассажира?'],
  ['О составе сметы', 'Какие услуги входят в указанную сумму? Какие расходы согласуются отдельно с залом, кладбищем или крематорием? Попросите письменный перечень с отдельной стоимостью каждой позиции.'],
  ['О ходе церемонии', 'Кто встретит гостей, включит музыку и даст слово близким? Когда следует передать портрет, музыкальный файл и список выступающих?'],
  ['О личных вещах', 'Кто соберёт после прощания книгу памяти, портрет и фотографии? Кому передать цветы и кому поручить отвезти их к месту захоронения?'],
];

export default function FamilyGuide() {
  return (
    <main id="main-content" className="fg-page">
      <div className="fg-intro">
        <div className="fg-lead">
          <nav aria-label="Хлебные крошки"><a href={`${bureauPath}/`}>Бюро</a><span aria-hidden="true">/</span><span>Памятка</span></nav>
          <h1>Памятка <br/>для семьи</h1>
          <p>Несколько вопросов, которые можно взять на встречу с бюро. Выберите те, что важны сейчас, и передайте остальное тому, кому доверяете.</p>
          <PrintGuide />
        </div>
        <figure className="fg-cover"><Image src={plateSrc('old-desk')} alt="Открытая книга, белые цветы и ручка на столе" fill preload sizes="(max-width: 700px) 100vw, 45vw" /></figure>
      </div>
      <section id="first-hours" className="fg-section" aria-labelledby="fg-first">
        <div className="fg-label"><h2 id="fg-first">Первые часы</h2><p>Эти небольшие задачи можно разделить между несколькими людьми.</p></div>
        <ol className="fg-steps">{firstHours.map(([title,text]) => <li key={title}><h3>{title}</h3><p>{text}</p></li>)}</ol>
      </section>
      <section className="fg-questions" aria-labelledby="fg-ask">
        <div className="fg-section">
          <div className="fg-label"><h2 id="fg-ask">О чём спросить бюро</h2><p>Договорённости проще сверить, когда они собраны в одном перечне.</p></div>
          <dl>{questions.map(([title,text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}</dl>
        </div>
      </section>
      <section className="fg-section fg-final" aria-labelledby="fg-family">
        <div className="fg-label"><h2 id="fg-family">Что сообщить гостям</h2></div>
        <div><p>Укажите в одном сообщении день, время, адрес с ориентиром у входа и имя встречающего. Если пожелание семьи касается цветов, фотографий или слов на церемонии, добавьте его одной фразой.</p><p>Близким, которые будут ехать вместе, отдельно перешлите точку сбора и маршрут после прощания.</p></div>
      </section>
      <nav className="fg-sections" aria-label="Материалы для выбора церемонии"><a href={ceremonyHref('burial')}>Традиционное захоронение</a><a href={ceremonyHref('cremation')}>Кремация</a><a href={ceremonyHref('memorials')}>Памятники и мемориалы</a></nav>
    </main>
  );
}
