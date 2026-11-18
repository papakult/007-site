"""Operations pages for the construction portfolio."""

from html import escape

BASE = "/directions/sites/construction/"

FLEET = {
    "earth": {
        "name": "Земляные работы", "image": "fleet-earth", "alt": "Гусеничный экскаватор с ковшом на краю выемки",
        "task": "От разработки котлована до обратной засыпки.",
        "intro": "У котлована, узкой траншеи и протяжённого проезда разные условия. Выбор машины начинается с грунта, глубины разработки и места, где можно развернуться.",
        "brief": ("Условия площадки", "Границы котлована, существующие сети, материал грунта и схема вывоза."),
        "handover": "Перед следующим этапом сверяют отметки дна, расположение траншей и подготовку основания с рабочими чертежами.",
        "jobs": ("site", "foundation", "landscape"),
        "machines": [
            ("Гусеничный экскаватор", "Котлованы и большие объёмы выемки", "Учитывают глубину копания, вылет стрелы и место для подачи самосвалов."),
            ("Колёсный экскаватор", "Траншеи вдоль проездов", "Удобен при смене захваток по готовому покрытию. Заранее проверяют ширину проезда и рабочую зону."),
            ("Мини-экскаватор", "Работа рядом со зданиями", "Габариты машины и поворот задней части сравнивают с шириной прохода."),
            ("Бульдозер", "Снятие растительного слоя и планировка", "Длину перемещения грунта и уклон участка учитывают при разбивке работ."),
            ("Фронтальный погрузчик", "Перемещение сыпучих материалов", "Проверяют место погрузки, разворота и высоту борта принимающей машины."),
        ],
    },
    "lift": {
        "name": "Подъём и монтаж", "image": "fleet-lift", "alt": "Башенный кран над строящимся каркасом",
        "task": "Подъём конструкций, перемещение материалов, доступ на высоте.",
        "intro": "Машину подбирают под массу элемента, рабочий вылет и место установки. Для монтажа конструкций и для доступа специалиста на высоту нужны разные решения.",
        "brief": ("Условия подъёма", "Масса и габариты элемента, точка подачи, положение машины, соседние здания и линии."),
        "handover": "До монтажа сверяют опорные поверхности, монтажные отметки и последовательность подачи элементов по проекту производства работ.",
        "jobs": ("foundation", "frame"),
        "machines": [
            ("Автомобильный кран", "Монтаж отдельных конструкций", "Подбор ведут по грузовой характеристике на рабочем вылете и по условиям установки опор."),
            ("Башенный кран", "Регулярная подача на ярусы", "Привязку к зданию и обслуживаемую зону предусматривают в организации строительства."),
            ("Телескопический погрузчик", "Доставка материалов к месту монтажа", "Тип навесного оборудования и положение груза согласуют с допустимой диаграммой нагрузок."),
            ("Коленчатый подъёмник", "Доступ к фасадам и узлам", "Форма стрелы позволяет обойти выступы. Для выбора важны высота, горизонтальный вылет и состояние площадки."),
            ("Ножничный подъёмник", "Работа на одной вертикали", "Сравнивают высоту рабочей зоны, ширину проходов и несущую способность основания."),
        ],
    },
    "concrete": {
        "name": "Бетонные работы", "image": "fleet-concrete", "alt": "Автобетоносмеситель на площадке рядом со строящимся зданием",
        "task": "Доставка, подача и укладка бетонной смеси.",
        "intro": "Бетонирование связывает несколько операций в одну смену. Важно согласовать подъезд миксеров, точку подачи, доступ к опалубке и порядок укладки по захваткам.",
        "brief": ("Схема подачи", "Конфигурация конструкции, объём захватки, подъезд миксеров, место для насоса и прокладка трассы."),
        "handover": "До укладки фиксируют готовность опалубки, арматуры, закладных и выпусков. После — условия ухода за бетоном по проекту.",
        "jobs": ("foundation", "frame"),
        "machines": [
            ("Автобетоносмеситель", "Доставка смеси на площадку", "Планируют маршрут, место ожидания и очередность разгрузки."),
            ("Автобетононасос", "Подача смеси стрелой", "Точку установки выбирают с учётом рабочей зоны стрелы, опор и подъезда миксеров."),
            ("Стационарный бетононасос", "Подача по бетоноводу", "Трассу бетоновода и места обслуживания закладывают в схему бетонирования."),
            ("Распределительная стрела", "Обслуживание протяжённых захваток", "Положение стрелы согласуют с геометрией плиты и принятым способом подачи смеси."),
            ("Глубинный вибратор", "Уплотнение при укладке", "Размер рабочей части подбирают под толщину элемента и расположение арматуры."),
        ],
    },
    "road": {
        "name": "Дороги и покрытия", "image": "fleet-road", "alt": "Тандемный каток уплотняет асфальтовое покрытие",
        "task": "Формирование профиля, послойное уплотнение и устройство покрытия.",
        "intro": "Временный проезд для стройки, двор и подъезд к складу работают под разной нагрузкой. Сначала определяют конструкцию основания, затем очередность проходов техники.",
        "brief": ("Параметры участка", "Проектные отметки, уклоны, состав слоёв, водоотвод и очерёдность открытия проездов."),
        "handover": "Перед устройством следующего слоя сверяют профиль, толщину и предусмотренные проектом результаты контроля уплотнения.",
        "jobs": ("site", "landscape"),
        "machines": [
            ("Автогрейдер", "Формирование профиля", "Задаёт продольные и поперечные уклоны подготовленного материала."),
            ("Грунтовый каток", "Уплотнение основания", "Тип вальца и режим подбирают по материалу слоя и требованиям к уплотнению."),
            ("Асфальтоукладчик", "Распределение асфальтобетонной смеси", "Ширину полосы и схему подачи согласуют с геометрией проезда."),
            ("Тандемный каток", "Уплотнение покрытия", "Работает в составе звена с укладчиком по технологической карте."),
            ("Виброплита", "Примыкания и узкие участки", "Применяют у бортов, в проходах и там, где крупный каток не может подойти."),
        ],
    },
}

STAGES = [
    ("ground", "Основание", "Подготовка и фундамент", "Сначала площадка получает координаты и высотные отметки. По ним выполняют земляные работы, готовят основание и собирают фундамент.", "Отметки и оси по исполнительной съёмке", "Армирование и закладные до бетонирования", "Земляные работы", "earth"),
    ("frame", "Каркас", "Несущие конструкции", "Из фундамента вырастает пространственная схема здания. Колонны, балки и перекрытия монтируют в порядке, который обеспечивает устойчивость каждого участка.", "Положение колонн и опорных узлов", "Соединения и отметки перекрытий", "Подъём и монтаж", "lift"),
    ("facade", "Контур", "Фасад и кровля", "После каркаса здание закрывают от осадков. К фасадной системе привязывают окна, кровельные примыкания, инженерные проходки и водоотвод.", "Непрерывность утепления в узлах", "Герметичность примыканий и проходок", "Техника для монтажа", "lift"),
    ("finished", "Готовый объект", "Территория и передача", "К завершённому зданию подключают сети, устраивают проезды и благоустройство. Результаты испытаний, съёмки и осмотров собирают для передачи заказчику.", "Испытания систем и доступ для обслуживания", "Исполнительная документация и перечень замечаний", "Дороги и покрытия", "road"),
]

TASKS = [
    ("all", "Все работы"), ("site", "Подготовка площадки"), ("foundation", "Фундамент"),
    ("frame", "Каркас"), ("landscape", "Благоустройство"),
]


def url(path=""):
    return BASE + path


def photo(key, alt, eager=False):
    loading = 'loading="eager" fetchpriority="high"' if eager else 'loading="lazy"'
    return f'<img src="{url("media/" + key + ".webp")}" alt="{escape(alt, quote=True)}" {loading} decoding="async">'


def crumbs(*items):
    links = [f'<a href="{BASE}">Главная</a>']
    for label, target in items:
        links.append(f'<a href="{url(target)}">{escape(label)}</a>' if target else f'<span aria-current="page">{escape(label)}</span>')
    return '<nav class="op-crumbs" aria-label="Хлебные крошки">' + '<i aria-hidden="true">/</i>'.join(links) + '</nav>'


def arrow_link(path, title):
    return f'<a class="op-link" href="{url(path)}">{escape(title)}<span aria-hidden="true">↗</span></a>'


def mast(crumb, label, title, intro, image="", alt=""):
    image_markup = '<figure class="op-mast-art">' + photo(image, alt, True) + '</figure>' if image else ''
    return f'''<header class="op-mast {'op-mast-photo' if image else 'op-mast-text'}"><div class="op-wrap">
      <div class="op-mast-copy">{crumb}<p class="op-label">{label}</p><h1>{title}</h1><p class="op-intro">{intro}</p></div>
      {image_markup}</div></header>'''


def fleet_index():
    head = mast(crumbs(("Техника", None)), "Механизация строительства", "Техника<br>на площадке",
                "Четыре направления работы парка — от первой выемки грунта до чистового покрытия. Выберите этап, чтобы подобрать семейство машин.",
                "fleet-earth", FLEET["earth"]["alt"])
    tools = ''.join(f'<button type="button" data-op-filter="{key}" aria-pressed="{str(key == "all").lower()}">{title}</button>' for key, title in TASKS)
    cards = []
    for key, group in FLEET.items():
        machines = ' · '.join(t[0] for t in group["machines"][:3])
        cards.append(f'''<a class="op-family" data-op-family="{' '.join(group["jobs"])}" href="{url('fleet/'+key+'/')}">
            <div class="op-family-photo">{photo(group["image"], group["alt"])}</div>
            <div class="op-family-copy"><h3>{group["name"]}</h3><span class="op-family-arrow" aria-hidden="true">↗</span>
            <p>{group["task"]}</p><small>{machines}</small></div></a>''')
    return f'''<div class="op-page">{head}<section class="op-wrap op-section" aria-labelledby="op-parks"><div class="op-headline">
      <h2 id="op-parks">Направления техники</h2></div>
      <div class="op-filter" data-op-filters role="group" aria-label="Подбор техники по этапу" hidden>{tools}</div>
      <p class="op-visually-hidden" aria-live="polite" data-op-filter-status></p>
      <div class="op-families">{''.join(cards)}</div></section></div>'''


def fleet_detail(key):
    g = FLEET[key]
    head = mast(crumbs(("Техника", "fleet/"), (g["name"], None)), "Парк техники", g["name"], g["intro"], g["image"], g["alt"])
    accordion = []
    for i, (name, task, desc) in enumerate(g["machines"]):
        accordion.append(f'''<details class="op-machine" {'open' if i == 0 else ''}>
          <summary>{name}<span aria-hidden="true"></span></summary>
          <div><strong>{task}</strong><p>{desc}</p></div></details>''')
    title, text = g["brief"]
    adjacent = ' '.join(arrow_link(f"fleet/{other}/", FLEET[other]["name"]) for other in FLEET if other != key)
    return f'''<div class="op-page">{head}<section class="op-wrap op-section op-equipment" aria-labelledby="op-units">
      <aside class="op-aside"><p class="op-label">Подбор техники</p><h2 id="op-units">Машины<br> и задачи</h2><div class="op-brief"><h3>{title}</h3><p>{text}</p></div></aside>
      <div class="op-machinery">{''.join(accordion)}</div></section>
      <div class="op-band"><div class="op-wrap op-band-inner"><div><p class="op-label">Контроль участка</p><h2>Передача работ</h2></div><div><p>{g["handover"]}</p>{arrow_link("process/", "Этапы строительства")}</div></div></div>
      <section class="op-wrap op-next" aria-label="Другие направления техники">{adjacent}</section></div>'''


def process():
    head = mast(crumbs(("Ход строительства", None)), "Производственный цикл", "Ход строительства",
                "Одна площадка в четырёх состояниях. Сравните, как меняется объект и что проверяют перед переходом к следующему этапу.")
    tabs, panels = [], []
    for i, (key, short, title, text, check1, check2, equipment, fleet_key) in enumerate(STAGES):
        tabs.append(f'<a id="op-tab-{key}" href="#stage-{key}" data-op-tab="{key}">{short}</a>')
        panels.append(f'''<article class="op-stage" data-op-panel="{key}" id="stage-{key}">
          <figure>{photo('stage-'+key, title + ' на строительной площадке', i == 0)}<figcaption>Один ракурс <i aria-hidden="true">/</i> {short}</figcaption></figure>
          <div class="op-stage-copy"><p class="op-label">Этап {i+1} из 4</p><h2>{title}</h2><p>{text}</p>
          <h3>Что проверяют</h3><ul class="op-checks"><li>{check1}</li><li>{check2}</li></ul>
          {arrow_link('fleet/'+fleet_key+'/', equipment)}</div></article>''')
    return f'''<div class="op-page">{head}<section class="op-showcase" aria-label="Этапы работ на объекте" data-op-process>
      <div class="op-wrap"><nav class="op-stage-tabs" aria-label="Выбор этапа">{''.join(tabs)}</nav>
      {''.join(panels)}</div></section>
      <section class="op-wrap comparison" aria-labelledby="compare-title">
      <div class="comparison-head"><div><p class="op-label">Сравнение этапов</p><h2 id="compare-title">От каркаса к фасаду</h2></div>
      <p id="compare-hint" hidden>Передвиньте разделитель, чтобы сравнить несущий каркас и готовый корпус с одной точки.</p></div>
      <div class="compare-photos" data-comparison>
        <figure>{photo('stage-finished', 'Готовый трёхэтажный корпус с облицовкой')}<figcaption>Готовый корпус</figcaption></figure>
        <figure>{photo('stage-frame', 'Открытый железобетонный каркас до облицовки')}<figcaption>Каркас</figcaption></figure>
        <span class="compare-divider" aria-hidden="true"></span>
        <input hidden type="range" min="0" max="100" value="50" aria-label="Доля кадра с открытым каркасом" aria-describedby="compare-hint">
      </div></section></div>'''


def company():
    head = mast(crumbs(("Компания", None)), "Строительная компания", "Как устроена<br>работа",
                "Строительство связывает решения проектировщика, работу площадки и интересы заказчика. Задача генподрядчика — собрать их в один выполнимый порядок.",
                "hero-yard", "Здания и техника на строительной площадке")
    articles = [
        ("До выхода на площадку", "Разбирают рабочую документацию, доступные мощности, границы работ и подъезды. В календарный план закладывают зависимости между этапами и поставками."),
        ("Во время строительства", "Увязывают работу подрядчиков, доступ техники и поставку материалов. Результаты осмотров и изменения по участкам фиксируют вместе с ответственными специалистами."),
        ("При передаче объекта", "Сводят исполнительные схемы, акты скрытых работ, результаты испытаний и замечания. Заказчику передают сведения, которые понадобятся при эксплуатации."),
    ]
    rows = ''.join(f'<section><h3>{h}</h3><p>{p}</p></section>' for h, p in articles)
    return f'''<div class="op-page">{head}<section class="op-wrap op-section op-company" aria-labelledby="op-scope">
      <div><p class="op-label">Управление проектом</p><h2 id="op-scope">Зоны<br> ответственности</h2></div><div class="op-scope">{rows}</div></section>
      <nav class="op-wrap op-next" aria-label="Подробнее о работе">{arrow_link("process/", "Посмотреть ход строительства")}{arrow_link("fleet/", "Изучить технику")}</nav></div>'''


def build(write):
    write("fleet/", "Парк строительной техники", "Техника для земляных, монтажных, бетонных и дорожных работ. Подбор семейства машин по задаче площадки.", fleet_index())
    for key, group in FLEET.items():
        write("fleet/" + key + "/", group["name"], group["task"], fleet_detail(key))
    write("process/", "Ход строительства", "Строительная площадка от основания до готового объекта. Четыре стадии, их задачи и контроль работ.", process())
    write("company/", "О компании", "Как устроена работа строительной компании: подготовка, управление площадкой и передача результата заказчику.", company())
