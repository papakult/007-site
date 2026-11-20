#!/usr/bin/env python3
"""Build the supporting pages for the fictional MUSE beauty atelier demo."""

from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = "/directions/sites/beauty-salon/"
OUT = ROOT / BASE.strip("/")

SERVICES = {
    "hair": {
        "name": "Волосы",
        "eyebrow": "MUSE / Волосы и цвет",
        "title": "Форма, цвет.<br><em>Ваш характер.</em>",
        "intro": "Точная линия стрижки, живой оттенок и текстура, которую хочется трогать. Образ начинается с того, как вы хотите себя чувствовать.",
        "image": "hair.webp",
        "alt": "Портрет женщины с короткой медной стрижкой в мягком боковом свете",
        "heading": "Волосы, с которыми<br>вам <em>легко.</em>",
        "copy": "Сначала — разговор о привычках, длине и времени на укладку. Затем — форма и цвет, которые подходят вашему ритму. В этой концепции каждый визит можно собрать отдельно: от короткого обновления до смены образа.",
        "prices": [
            ("Стрижка и укладка", "75 минут", "6 500 ₽"),
            ("Окрашивание в один тон", "120 минут", "9 500 ₽"),
            ("Мягкое осветление", "180 минут", "16 000 ₽"),
            ("Уход и укладка", "60 минут", "5 500 ₽"),
        ],
        "notes": [
            ("Как выбрать направление?", "Для обновления формы подойдёт стрижка. Если хочется изменить настроение образа, начните с выбора оттенка. Сложное осветление требует больше времени, поэтому в реальном салоне его планируют после обсуждения исходного цвета и состояния волос."),
            ("Что входит в стоимость?", "В демонстрационном прайсе стрижка включает мытьё и укладку. Цена окрашивания показана как пример структуры услуги. В реальном салоне итоговую стоимость согласуют до начала работы с учётом длины и выбранной техники."),
            ("Что взять с собой?", "Сохраните несколько образов, которые вам нравятся. Полезно также рассказать, как вы обычно укладываете волосы и какой результат хотите видеть через несколько недель."),
        ],
    },
    "nails": {
        "name": "Ногти",
        "eyebrow": "MUSE / Маникюр и педикюр",
        "title": "Маленькая деталь.<br><em>Большое чувство.</em>",
        "intro": "Чистая форма, выразительный цвет, аккуратный блик. Маникюр как личный акцент — сдержанный или заметный, под ваше настроение.",
        "image": "nails.webp",
        "alt": "Рука с тёмно-вишнёвым маникюром в выразительном студийном освещении",
        "heading": "Ваш любимый<br><em>жест.</em>",
        "copy": "Короткий квадрат, мягкий овал или естественная длина. В основе — выбранная вами форма и палитра. Можно остановиться на прозрачном покрытии или добавить глубокий цвет, который соберёт весь образ.",
        "prices": [
            ("Маникюр без покрытия", "45 минут", "2 500 ₽"),
            ("Маникюр с покрытием", "90 минут", "4 200 ₽"),
            ("Педикюр с покрытием", "90 минут", "5 500 ₽"),
            ("Лаконичный дизайн", "30 минут", "1 000 ₽"),
        ],
        "notes": [
            ("Как выбрать форму?", "Ориентируйтесь на привычную длину и повседневные дела. Если хочется попробовать новую форму, сохраните референс: он поможет точнее объяснить пожелание."),
            ("Можно ли выбрать без покрытия?", "Да. В концепции предусмотрен отдельный маникюр без цветного покрытия — для тех, кому близки естественный вид и аккуратная форма."),
            ("Как запланировать дизайн?", "Для тонкой линии, акцента или небольшого рисунка предусмотрено дополнительное время. Сложный дизайн в реальном салоне согласуют заранее по референсу."),
        ],
    },
    "makeup": {
        "name": "Макияж",
        "eyebrow": "MUSE / Макияж и укладки",
        "title": "Момент — ваш.<br><em>Акценты — тоже.</em>",
        "intro": "Невесомый тон, выразительный взгляд или один смелый цвет. Образ для вечера, съёмки и просто особенного дня.",
        "image": "hero.webp",
        "alt": "Портрет женщины с естественным макияжем и длинными тёмными волосами",
        "heading": "Узнавать себя.<br><em>Любить детали.</em>",
        "copy": "Макияж строится вокруг вашего лица и настроения события. Свет, одежда, причёска и желаемая интенсивность помогают найти верные акценты. Визит можно дополнить укладкой и собрать образ в одном пространстве.",
        "prices": [
            ("Лёгкий дневной макияж", "45 минут", "5 000 ₽"),
            ("Вечерний макияж", "75 минут", "7 500 ₽"),
            ("Макияж и укладка", "120 минут", "11 000 ₽"),
            ("Репетиция образа", "90 минут", "8 000 ₽"),
        ],
        "notes": [
            ("Как подготовиться к визиту?", "Подберите несколько референсов и фотографию одежды, если образ связан с событием. В реальном салоне заранее сообщают о чувствительности кожи и известных реакциях на косметические средства."),
            ("Что выбрать для съёмки?", "Расскажите о свете, времени суток и характере съёмки. Эти детали помогают выбрать плотность тона, фактуру и интенсивность акцентов."),
            ("Зачем нужна репетиция?", "Репетиция позволяет заранее попробовать сочетание макияжа и укладки, спокойно обсудить детали и выбрать тот вариант, в котором вам комфортно."),
        ],
    },
    "brows": {
        "name": "Брови",
        "eyebrow": "MUSE / Брови и ресницы",
        "title": "Выразительность.<br><em>В тон вам.</em>",
        "intro": "Направление, оттенок и мягкая линия. Небольшое изменение, которое помогает собрать образ и подчеркнуть взгляд.",
        "image": "hero.webp",
        "alt": "Выразительный взгляд и естественная форма бровей в крупном портрете",
        "heading": "Точность<br><em>в деталях.</em>",
        "copy": "Форма бровей начинается с ваших пожеланий: сохранить естественную линию, сделать оттенок заметнее или добавить укладку. Перед работой важно обсудить желаемую интенсивность и особенности ухода.",
        "prices": [
            ("Архитектура бровей", "30 минут", "2 500 ₽"),
            ("Форма и окрашивание", "45 минут", "3 500 ₽"),
            ("Долговременная укладка", "60 минут", "4 500 ₽"),
            ("Окрашивание ресниц", "30 минут", "2 000 ₽"),
        ],
        "notes": [
            ("Можно сохранить естественный вид?", "Да. Для спокойного результата можно выбрать коррекцию формы без окрашивания. Желаемую интенсивность лучше обсудить до начала работы."),
            ("Как выбрать оттенок?", "Оттенок подбирают с учётом цвета волос, привычного макияжа и вашего пожелания. Полезно показать фотографию бровей, которые нравятся именно по насыщенности."),
            ("Что обсудить заранее?", "В реальном салоне сообщают о чувствительности кожи, известных реакциях на красители и недавних процедурах в этой зоне. Мастер уточняет, подходит ли выбранная услуга."),
        ],
    },
}


def header():
    return f'''<a class="skip-link" href="#main">К содержанию</a>
<header class="site-header">
  <a class="wordmark" href="{BASE}" aria-label="MUSE — на главную">muse<span>✷</span></a>
  <nav class="desktop-nav" aria-label="Основная навигация"><a href="{BASE}#services">Услуги</a><a href="{BASE}atelier/">Ателье</a><a href="{BASE}#mood">Вдохновение</a></nav>
  <a class="pill small" href="{BASE}visit/">Выбрать визит</a>
  <button class="menu-toggle" type="button" aria-controls="mobile-nav" aria-expanded="false">Меню</button>
</header>
<nav class="mobile-nav" id="mobile-nav" aria-label="Мобильная навигация" hidden><a href="{BASE}#services">Услуги</a><a href="{BASE}atelier/">Ателье</a><a href="{BASE}#mood">Вдохновение</a><a href="{BASE}visit/">Выбрать визит</a></nav>'''


def footer():
    return f'''<footer class="site-footer"><a class="wordmark" href="{BASE}">muse<span>✷</span></a><p>Вымышленное ателье красоты. Демонстрационный проект студии 007-A.<br>Образы, услуги и цены иллюстрируют концепцию.</p><a href="/directions/sites/">Другие проекты 007-A</a></footer>'''


def document(slug, title, description, content):
    canonical = f"https://007-a.ru{BASE}{slug}/"
    return f'''<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#341018"><meta name="robots" content="noindex,follow"><title>{escape(title)} — MUSE</title><meta name="description" content="{escape(description, quote=True)}"><link rel="canonical" href="{canonical}"><link rel="icon" type="image/svg+xml" href="{BASE}assets/mark.svg"><link rel="stylesheet" href="{BASE}style.css"><script defer src="{BASE}site.js"></script></head><body class="inner-page">{header()}<main id="main">{content}</main>{footer()}</body></html>'''


def related(current=None):
    links = ''.join(f'<a href="{BASE}{slug}/"><span>{s["name"]}</span><span class="related-note">О направлении</span></a>' for slug, s in SERVICES.items() if slug != current)
    return f'<section class="page-section related-section"><p class="eyebrow">Продолжить знакомство</p><h2>Ещё немного<br><em>вдохновения.</em></h2><nav class="related-links" aria-label="Другие направления">{links}</nav></section>'


def service_page(slug, s):
    prices = ''.join(f'<div class="price-row"><h3>{escape(name)}</h3><span>{duration}</span><strong>{price}</strong></div>' for name, duration, price in s["prices"])
    details = ''.join(f'<details><summary>{escape(question)}</summary><p>{escape(answer)}</p></details>' for question, answer in s["notes"])
    content = f'''<section class="inner-hero"><div class="inner-copy"><a class="breadcrumb" href="{BASE}#services">Все направления</a><p class="eyebrow">{s["eyebrow"]}</p><h1>{s["title"]}</h1><p>{s["intro"]}</p><a class="pill burgundy" href="{BASE}visit/?service={slug}">Подобрать визит</a></div><figure class="inner-image"><img src="{BASE}assets/{s["image"]}" alt="{s["alt"]}" width="1200" height="1600" fetchpriority="high"></figure></section>
<section class="page-section inner-grid"><h2>{s["heading"]}</h2><div><p class="body-large">{s["copy"]}</p><p class="eyebrow price-disclaimer">Демонстрационный прайс</p><div class="price-list">{prices}</div><p class="fine-print">Пример услуг и стоимости для вымышленного салона. Время указано ориентировочно.</p></div></section>
<section class="page-section inner-grid"><h2>Перед<br><em>визитом.</em></h2><div class="faq-list">{details}</div></section>{related(slug)}'''
    return document(slug, s["name"], f'{s["name"]} в концепции MUSE: направление, демонстрационные услуги и цены.', content)


def atelier_page():
    content = f'''<section class="inner-hero"><div class="inner-copy"><a class="breadcrumb" href="{BASE}">На главную</a><p class="eyebrow">MUSE / Пространство</p><h1>Время<br><em>для себя.</em></h1><p>Свет на зеркале, тёплое дерево, глубокий вишнёвый акцент. Пространство, где можно замедлиться и уделить внимание себе.</p><a class="pill burgundy" href="{BASE}visit/">Подобрать визит</a></div><figure class="inner-image"><img src="{BASE}assets/space.webp" alt="Концептуальный интерьер салона красоты с большими зеркалами, тёмным деревом и каменной стойкой" width="1600" height="1000" fetchpriority="high"></figure></section>
<section class="page-section inner-grid"><h2>Красота<br><em>в своём ритме.</em></h2><div><p class="body-large">MUSE — вымышленное ателье красоты, созданное как дизайн-концепция. В нём соединены работа с волосами, маникюр, макияж и брови. Основа идеи — спокойный разговор о пожеланиях и внимание к деталям образа.</p><p>На сайте можно исследовать направления, рассмотреть визуальную историю и составить пример визита. Все изображения представляют художественную концепцию пространства и образов.</p></div></section>
<section class="page-section atelier-values"><p class="eyebrow">Характер ателье</p><div class="value-grid"><article><h2>Личный<br><em>взгляд.</em></h2><p>Ваши привычки и представление о красоте становятся отправной точкой для образа.</p></article><article><h2>Точное<br><em>прикосновение.</em></h2><p>Цвет, форма и фактура работают вместе — от оттенка волос до маленького акцента на ногтях.</p></article><article><h2>Ваше<br><em>время.</em></h2><p>Понятные направления и ориентиры по длительности помогают представить будущий визит.</p></article></div></section>{related()}'''
    return document("atelier", "Ателье", "Пространство и характер вымышленного ателье красоты MUSE.", content)


def visit_page():
    options = ''.join(f'<button type="button" class="visit-option" data-visit-service="{slug}" data-duration="{duration}" aria-pressed="false"><span>{label}</span><small>{duration} минут · {price}</small></button>' for slug, label, duration, price in [
        ("hair", "Стрижка и укладка", "75", "6 500 ₽"),
        ("nails", "Маникюр с покрытием", "90", "4 200 ₽"),
        ("makeup", "Вечерний макияж", "75", "7 500 ₽"),
        ("brows", "Форма и окрашивание бровей", "45", "3 500 ₽"),
    ])
    content = f'''<section class="visit-intro page-section"><a class="breadcrumb" href="{BASE}">На главную</a><p class="eyebrow">Демонстрация выбора визита</p><h1>Ваше время.<br><em>Ваше настроение.</em></h1><p class="body-large">Выберите направление и удобную часть дня. Сохраните пример плана, чтобы посмотреть, как может быть устроен визит в MUSE.</p></section>
<section class="page-section visit-layout"><div class="visit-choices"><fieldset class="visit-fieldset"><legend>С чего начнём?</legend><div class="visit-options">{options}</div></fieldset><fieldset class="visit-fieldset"><legend>Когда вам комфортнее?</legend><div class="time-options"><button type="button" data-visit-time="Утром" aria-pressed="false">Утром</button><button type="button" data-visit-time="Днём" aria-pressed="false">Днём</button><button type="button" data-visit-time="Вечером" aria-pressed="false">Вечером</button></div></fieldset><p class="fine-print">Указанные варианты иллюстрируют интерфейс. Дата и доступность времени здесь не выбираются.</p></div><aside class="visit-card"><p class="eyebrow">Пример вашего визита</p><div id="visit-summary" aria-live="polite"><h2>Начнём<br><em>с желания.</em></h2><p>Выберите направление и часть дня — здесь появится ваш план.</p></div><button class="pill burgundy" id="save-visit" type="button" disabled>Сохранить план</button><p class="fine-print">Это демонстрация: план не создаёт запись и не отправляется в салон.</p></aside></section>
<section class="page-section inner-grid"><h2>Всё начинается<br><em>с вас.</em></h2><div class="faq-list"><details><summary>Что будет в сохранённом плане?</summary><p>Выбранное направление, ориентировочная длительность и часть дня. Файл нужен только для знакомства с интерфейсом.</p></details><details><summary>Можно ли записаться в MUSE?</summary><p>MUSE — вымышленный салон в портфолио студии 007-A. Реальная запись и отправка заявок в этой концепции не подключены.</p></details></div></section>'''
    return document("visit", "Выбрать визит", "Демонстрация выбора направления и времени визита в вымышленное ателье красоты MUSE.", content)


def main():
    pages = {slug: service_page(slug, service) for slug, service in SERVICES.items()}
    pages["atelier"] = atelier_page()
    pages["visit"] = visit_page()
    for slug, html in pages.items():
        path = OUT / slug / "index.html"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(html, encoding="utf-8")
        print(path.relative_to(ROOT))


if __name__ == "__main__":
    main()
