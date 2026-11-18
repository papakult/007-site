export default function FamilyGuide() {
  return (
    <aside className="request-form" aria-labelledby="guide-title">
      <span className="eyebrow">Памятка для семьи</span>
      <h3 id="guide-title" style={{ margin: "1rem 0 1.5rem", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", lineHeight: 1.2 }}>Что можно обсудить заранее</h3>
      <dl style={{ display: "grid", gap: "1rem", lineHeight: 1.55 }}>
        <div>
          <dt style={{ fontWeight: 600 }}>Круг близких</dt>
          <dd style={{ margin: 0 }}>Кого вы хотите пригласить и кому может понадобиться помощь с дорогой.</dd>
        </div>
        <div>
          <dt style={{ fontWeight: 600 }}>Порядок прощания</dt>
          <dd style={{ margin: 0 }}>Какие семейные традиции, музыку или слова особенно важно сохранить.</dd>
        </div>
        <div>
          <dt style={{ fontWeight: 600 }}>Организация</dt>
          <dd style={{ margin: 0 }}>Какие решения семья хочет принять сама и что удобнее поручить специалисту.</dd>
        </div>
      </dl>
      <a className="button" href="#first-hours" style={{ marginTop: "1.75rem" }}>Посмотреть порядок действий</a>
    </aside>
  );
}
