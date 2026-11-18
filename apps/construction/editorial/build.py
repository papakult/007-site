"""Render the public editorial pages of ОПОРА with the standard Python library."""
from html import escape
from pathlib import Path
import sys

import operations
import projects

BASE = "/directions/sites/construction/"
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("output")
NAV = [("directions/", "Направления"), ("projects/", "Объекты"), ("fleet/", "Техника"), ("process/", "Ход работ"), ("company/", "Компания")]
SECTORS = [
    ("zhilishchnoe", "Жилое строительство", "Кварталы, многоквартирные дома и частные резиденции.", "apartments.webp"),
    ("promyshlennoe", "Промышленные объекты", "Производственные корпуса, складские и логистические комплексы.", "industrial.webp"),
    ("kommercheskoe", "Коммерческие здания", "Деловые центры и пространства для городской жизни.", "commercial.webp"),
    ("infrastruktura", "Инфраструктура", "Дорожное полотно, инженерные сети и организация территории.", "media/fleet-road.webp"),
    ("genpodryad", "Генеральный подряд", "Проектирование, координация работ и подготовка объекта к вводу.", "media/hero-yard-small.webp"),
]
SCENES = [
    ("media/hero-yard.webp", "media/hero-yard-small.webp", "Башенный кран над железобетонным каркасом в вечернем свете", "Генеральный подряд", "От проекта", "до ввода.", "Проектируем и строим жилые кварталы, производственные корпуса и городскую инфраструктуру.", "Направления работ", "directions/"),
    ("industrial.webp", "industrial.webp", "Промышленный комплекс с протяжённым производственным корпусом", "Промышленное строительство", "Пространство", "производства.", "Пролёты, грузовые потоки и инженерные сети определяют устройство промышленного корпуса.", "Смотреть объект", "projects/park-metalla/"),
    ("apartments.webp", "apartments.webp", "Современный жилой квартал крупным планом", "Жилое строительство", "Город", "для жизни.", "От конструктивной схемы жилого корпуса до света в окнах и маршрута через двор.", "Смотреть квартал", "projects/terrasy/"),
]

def url(path=""):
    return BASE + path

def icon(path, size=18):
    return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" aria-hidden="true"><path d="{path}"/></svg>'

def mark():
    return '<svg viewBox="0 0 46 34" width="46" height="34" fill="currentColor" aria-hidden="true"><path d="M1 31 15 3h8L9 31zM17 31 31 3h8L25 31zM35 18l7 13H29z"/></svg>'

def brand():
    return f'<a class="brand" href="{BASE}" aria-label="ОПОРА — главная">{mark()}<b>ОПОРА</b></a>'

def navlinks(slug):
    return "".join(f'<a href="{url(p)}"'+(' aria-current="page"' if slug==p else (' class="in-section"' if slug.startswith(p) else ''))+f'>{label}</a>' for p,label in NAV)

def masthead(slug):
    links = navlinks(slug)
    return f'''<a href="#main" class="skiplink">К содержанию</a>
    <header class="masthead"><div class="shell mast-row">{brand()}
    <nav class="desktop-nav" aria-label="Основная навигация">{links}</nav>
    <a class="mast-projects" href="{url("brief/")}">Подготовить проект {icon("M7 17 17 7m-8 0h8v8",16)}</a>
    <details class="mobile-menu"><summary><span>Меню</span><i aria-hidden="true"></i></summary><nav aria-label="Мобильная навигация">{links}<a href="{url("brief/")}">Подготовить проект</a></nav></details>
    </div></header>'''

def footer():
    return f'''<footer class="footer"><div class="shell foot-grid"><div>{brand()}<p>Проектирование и строительство</p></div>
    <nav aria-label="Разделы в подвале">{navlinks("!")}</nav><a class="foot-studio" href="/directions/sites/">Портфолио 007-А</a></div><div class="shell foot-note">Демонстрационный проект студии 007-А. Объекты и техника представлены в архитектурных визуализациях.</div></footer>'''

def write(slug, title, description, body):
    slug = slug.strip("/")
    route = slug + "/" if slug else ""
    dest = OUT / slug / "index.html"
    dest.parent.mkdir(parents=True, exist_ok=True)
    css = ['opora.css']
    js = ['opora.js']
    if slug.startswith(("projects", "directions")):
        css.append('work.css')
        js.append('work.js')
    if slug.startswith(("fleet", "process", "company")):
        css.append('ops.css')
        js.append('ops.js')
    assets = "".join(f'<link rel="stylesheet" href="{url(name)}">' for name in css)
    scripts = "".join(f'<script src="{url(name)}" defer></script>' for name in js)
    dest.write_text(f'''<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="theme-color" content="#182322"><meta name="robots" content="noindex,follow"><title>{escape(title)} | ОПОРА</title>
    <meta name="description" content="{escape(description,quote=True)}"><link rel="canonical" href="https://007-a.ru{url(route)}"><link rel="icon" href="{url("mark.svg")}" type="image/svg+xml">
    {assets}{scripts}</head><body>{masthead(route)}<main id="main">{body}</main>{footer()}</body></html>''', encoding="utf-8")

def hero():
    slides = []
    for i,(img,small,alt,tag,line1,line2,copy,cta,target) in enumerate(SCENES):
        head = "h1" if i==0 else "h2"
        slides.append(f'''<div class="hero-scene" data-scene="{i}" {'' if i==0 else 'hidden'}>
        <picture><source media="(max-width: 670px)" srcset="{url(small)}"><img src="{url(img)}" alt="{alt}" {'fetchpriority="high"' if i==0 else 'loading="lazy"'}></picture>
        <div class="shell hero-inner"><div class="hero-meta"><i></i>{tag}</div>
        <{head} class="hero-title" {'id="hero-heading"' if i==0 else ''}>{line1}<br>{line2}</{head}>
        <p>{copy}</p><a class="primary-link" href="{url(target)}">{cta}{icon("M7 17 17 7m-8 0h8v8")}</a></div></div>''')
    names=["Стройка","Производство","Жильё"]
    choices="".join(f'<button type="button" aria-pressed="{str(i==0).lower()}" data-pick="{i}"><i></i>{t}</button>' for i,t in enumerate(names))
    return f'''<section class="hero" aria-label="Объекты ОПОРЫ">{"".join(slides)}<div class="shell hero-foot"><a href="#projects" class="hero-down">{icon("M12 4v15m-6-6 6 6 6-6",18)} К объектам</a><div class="scene-choices" role="group" aria-label="Выбор обложки" hidden>{choices}</div></div></section>'''

def image(path, alt, cls=""):
    return f'<img class="{cls}" src="{url(path)}" loading="lazy" decoding="async" alt="{alt}">'

def home():
    card_data=[
        ("terrasy","Жилой квартал","Террасы","apartments.webp"),
        ("park-metalla","Промышленный корпус","Парк металла","industrial.webp"),
        ("atrium","Деловой центр","Атриум","commercial.webp"),
    ]
    cards="".join(f'''<a class="project-teaser" href="{url("projects/"+slug+"/")}"><figure>{image(photo,kind+" «"+name+"»")}</figure><div><span>{kind}</span><h3>{name}</h3></div>{icon("M7 17 17 7m-8 0h8v8")}</a>''' for slug,kind,name,photo in card_data)
    rows="".join(f'''<a class="sector-row" href="{url("directions/"+slug+"/")}"><span>{label}</span><small>{desc}</small>{icon("M6 12h12m-5-5 5 5-5 5")}</a>''' for slug,label,desc,photo in SECTORS)
    return hero()+f'''<section class="section home-projects shell" id="projects"><div class="section-top"><div><p class="eyebrow">Портфель объектов</p><h2>Избранные объекты</h2></div><a class="text-link" href="{url("projects/")}">Все проекты</a></div><div class="teasers">{cards}</div></section>
    <section class="sectors section" id="services"><div class="shell"><div class="section-top"><div><p class="eyebrow">Профиль компании</p><h2>Что строим</h2></div><a class="text-link" href="{url("directions/")}">Все направления</a></div><div class="sector-list">{rows}</div></div></section>
    <section class="field-pair" id="process"><a class="field-image" href="{url("process/")}" id="assembly" aria-label="Посмотреть четыре этапа строительства">{image("media/stage-frame.webp","Открытый бетонный каркас трёхэтажного корпуса")}</a><div class="field-copy"><p class="eyebrow">Дневник стройки</p><h2>Один корпус.<br>Четыре этапа.</h2><p>Как меняется здание от разработки котлована до готового фасада. Один ракурс помогает увидеть, какие работы скрывает каждый следующий этап.</p><a class="text-link" href="{url("process/")}">Открыть фотодневник</a></div></section>
    <section class="section shell home-fleet"><div class="section-top"><div><p class="eyebrow">Механизация</p><h2>На площадке</h2></div><a class="text-link" href="{url("fleet/")}">Весь парк техники</a></div><div class="equipment-strip">''' + "".join(f'<a href="{url("fleet/"+slug+"/")}">{image("media/fleet-"+slug+".webp",alt)}<span>{label}</span></a>' for slug,label,alt in [("earth","Земляные работы","Гусеничный экскаватор"),("lift","Подъём и монтаж","Башенный кран"),("concrete","Бетонирование","Автобетоносмеситель"),("road","Дорожные работы","Дорожный каток")]) + f'''</div></section>
    <section class="start-band" id="about"><div class="shell" id="request"><div><p class="eyebrow">Заказчику</p><h2 id="guide-title">С чего начать проект</h2><p>Участок, назначение здания и документация, которые понадобятся для первого разговора.</p></div><a class="primary-link" href="{url("brief/")}">Открыть памятку{icon("M7 17 17 7m-8 0h8v8")}</a></div></section>'''

def brief():
    items=[
        ("Площадка","Подготовьте схему границ, подъездов, соседних зданий и известных сетей. Добавьте фотографии участка с разных сторон."),
        ("Назначение объекта","Опишите, кто и как будет пользоваться зданием. Для производства укажите оборудование и маршруты грузов, для жилья — состав помещений и двора."),
        ("Исходные материалы","Соберите имеющиеся планы, результаты изысканий и технические условия. Отдельно отметьте, какие материалы ещё предстоит получить."),
        ("Очередность работ","Обозначьте, какие части объекта нужно запускать первыми и где участок должен оставаться доступным во время строительства."),
    ]
    blocks="".join(f'<details class="brief-item" {"open" if i==0 else ""}><summary>{label}</summary><p>{copy}</p></details>' for i,(label,copy) in enumerate(items))
    return f'''<div class="shell page-intro"><nav class="breadcrumbs" aria-label="Путь"><a href="{BASE}">ОПОРА</a> / Заказчику</nav><p class="eyebrow">Заказчику</p><h1 class="display">До начала работ</h1><p class="lead">Четыре темы для первого разговора с генеральным подрядчиком. Памятку можно сохранить через печать браузера.</p></div><div class="shell brief-layout section"><div class="brief-items">{blocks}</div>{image("media/stage-ground.webp","Подготовка площадки и котлована")}</div><div class="shell brief-end"><a class="text-link" href="{url("directions/genpodryad/")}">Как устроен генеральный подряд</a></div>'''

if __name__ == "__main__":
    write("", "Генеральный подряд и строительство", "Направления строительства, архитектурные проекты, парк техники и организация работ.", home())
    projects.build(write)
    operations.build(write)
    write("brief/", "Памятка заказчику", "Какие сведения о площадке и объекте подготовить к началу проекта.", brief())
