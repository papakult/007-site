export default function ProjectGuide() {
  return (
    <aside className="request-form" aria-labelledby="guide-title">
      <span className="eyebrow">До встречи с архитектором</span>
      <h3 id="guide-title" style={{ margin: "1rem 0 1.5rem", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", lineHeight: 1.2 }}>Три отправные точки</h3>
      <dl style={{ display: "grid", gap: "1rem", lineHeight: 1.55 }}>
        <div>
          <dt style={{ fontWeight: 600 }}>Участок</dt>
          <dd style={{ margin: 0 }}>Размер, рельеф и подъезд определяют, где разместить дом.</dd>
        </div>
        <div>
          <dt style={{ fontWeight: 600 }}>Образ жизни</dt>
          <dd style={{ margin: 0 }}>Подумайте, сколько нужно спален, где собираться всей семьёй и какой вид хочется сохранить.</dd>
        </div>
        <div>
          <dt style={{ fontWeight: 600 }}>Приоритеты</dt>
          <dd style={{ margin: 0 }}>Выберите, что особенно важно для вас в материалах, сроках и бюджете.</dd>
        </div>
      </dl>
      <a className="button bronze" href="#projects" style={{ marginTop: "1.75rem" }}>Посмотреть объекты</a>
    </aside>
  );
}
