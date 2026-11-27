const {data, pictures, currentRevision, applyEdits} = window.preview;
const {services, doctors, prices} = data;
const q = new URLSearchParams(location.search);
const page = (window.preview.external && q.get('page')) || (location.pathname.split('/').pop() || 'index.html').replace('.html','');
const root = document.querySelector('main');
document.body.className=page==='index'?'clinic-home':'clinic-interior';
const esc = s => String(s??'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const href = (p, args={}) => (window.preview.external ? '?'+new URLSearchParams({page:p,...args}) : p+'.html'+(Object.keys(args).length?'?'+new URLSearchParams(args):''))+window.preview.viewHash;
const link = (p,label,cls='',args={})=>'<a class="'+cls+'" href="'+esc(href(p,args))+'">'+esc(label)+'</a>';
function img(key,alt='',cls='',eager=false){
 const src=pictures[key]||pictures.examination;
 const source=window.preview.loadMedia?'data-private-image="'+esc(src)+'"':'src="'+esc(src)+'"';
 return '<img class="'+esc(cls)+'" alt="'+esc(alt)+'" '+(eager?'fetchpriority="high"':'loading="lazy"')+' '+source+'>';
}
const iconPaths={phone:'M7 3l3 5-2 2a14 14 0 006 6l2-2 5 3-2 4c-6 1-17-10-16-16z',surgery:'M3 20h16M5 16l8-8 3 3-8 8H5zM14 7l3-3 3 3-3 3',orthopedics:'M5 15a3 3 0 103 4l9-10a3 3 0 103-4 3 3 0 00-5 2L6 16',diagnostics:'M3 4h18v13H3zM6 11h3l2-4 2 7 2-4h3M9 20h6',lab:'M8 3h8M10 3v6L5 18a2 2 0 002 3h10a2 2 0 002-3l-5-9V3M8 15h8'};
const icon=k=>'<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="'+iconPaths[k]+'"/></svg>';
const phones=[['+7 (8442) 26-99-08','78442269908'],['+7 (927) 524-97-88','79275249788']];
const phoneLinks=(buttons=false)=>phones.map(([name,tel])=>'<a href="tel:+'+tel+'"'+(buttons?' class="btn primary">'+icon('phone'):'>')+esc(name)+'</a>').join('');
const actions=()=>'<div class="actions">'+phoneLinks(true)+'</div>';
const nav=[['about','О центре'],['team','Врачи'],['prices','Цены'],['articles','Наши статьи'],['reviews','Отзывы'],['contacts','Контакты']];
function svcIsActive(){return page==='services'||services.some(s=>s[0]===page)}
const navSection = page==='equipment'?'about':data.doctors.some(d=>d.slug===page)?'team':
  (data.articles||[]).some(a=>a.slug===page)?'articles':
  /^procedure-/.test(page)?'prices':page;
const homePage = page === 'index';
const brand='<span aria-hidden="true" class="crossmark"><i></i></span><b>ВВЦ</b><small>Волгоградский ветеринарный центр хирургии и травматологии</small>';
document.body.insertAdjacentHTML('afterbegin','<a class="skip-content" href="#main-content">К содержанию</a><header><div class="bar wrap"><a class="brand" aria-label="ВВЦ — главная" href="'+href('index')+'">'+brand+'</a><nav aria-label="Основное меню" id="nav">'+nav.map(([p,t])=>'<a '+(navSection===p?'aria-current="page"':'')+' href="'+href(p)+'">'+t+'</a>').join('')+'</nav><a class="head-services" '+(svcIsActive()?'aria-current="'+(page==='services'?'page':'location')+'"':'')+' href="'+href('services')+'">Все услуги</a><button type="button" class="menu" aria-controls="nav" aria-expanded="false"><span class="visually-hidden">Меню</span><span aria-hidden="true">☰</span></button></div></header>');
const menu=document.querySelector('.menu'), bar=document.querySelector('.bar');
menu.onclick=()=>{
 const open=bar.classList.toggle('open');
 menu.setAttribute('aria-expanded',String(open));
 if(open)document.querySelector('#nav a').focus();
};
document.querySelector('header').onkeydown=e=>{
 if(e.key==='Escape'&&bar.classList.contains('open')){
  bar.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.focus();
 }
};
root.id='main-content';root.tabIndex=-1;
document.querySelector('.skip-content').onclick=e=>{
 e.preventDefault();root.focus();root.scrollIntoView({block:'start'});
};
const svc=k=>services.find(s=>s[0]===k);
const crumb=(title,anc)=>'<nav aria-label="Хлебные крошки" class="bread">'+link('index','Главная')+' / '+(anc?link(anc[0],anc[1])+' / ':'')+esc(title)+'</nav>';
const title=(s)=>{document.title=s+' · ВВЦ Волгоград'};
function head(t,desc='',tag='',anc){title(t);return '<div class="wrap">'+crumb(t,anc)+'<div class="pagehead masthead">'+(tag?'<div class="kicker">'+esc(tag)+'</div>':'')+'<h1>'+esc(t)+'</h1>'+(desc?'<p class="lead">'+esc(desc)+'</p>':'')+'</div></div>'}
const sCard=s=>'<a class="card" href="'+href(s[0])+'">'+img(s[3],'')+'<div class="caption"><div class="line-end"><h3>'+esc(s[1])+'</h3><span class="arrow" aria-hidden="true">↗</span></div><p>'+esc(s[2])+'</p></div></a>';
function portrait(d,profile=false){
 const [center,top,scale]=d.framing;
 const framing='--center:'+center+'%;--hairline:'+top+'%;--photo-width:'+Math.round(scale*100)+'%'+(d.matte?';background-color:'+d.matte:'');
 return '<div class="portrait'+(profile?' portrait-profile':'')+'" style="'+framing+'">'+img(d.image,profile?d.name:'','portrait-photo',profile)+'</div>';
}
function personName(d){
 const parts=d.name.trim().split(/\s+/);
 const surname=parts.pop();
 return '<span class="person-surname">'+esc(surname)+'</span> <span class="person-given">'+esc(parts.join(' '))+'</span>';
}
const roleBadge=d=>'<span class="role-badge">'+esc(d.role)+'</span>';
const profileAction='<span class="profile-action">О специалисте<span class="profile-chevron" aria-hidden="true"></span></span>';
function personCard(d){
 return '<article class="person-card"><a class="person-link" href="'+esc(href(d.slug))+'" aria-label="'+esc(d.name+' — '+d.role+'. О специалисте')+'">'+
 portrait(d)+'<div class="person-caption"><h3>'+personName(d)+'</h3>'+
 roleBadge(d)+'</div>'+profileAction+'</a></article>';
}
function teamPage(){
 title('Специалисты центра');
 const chief=doctors.find(d=>d.role.trim().toLowerCase()==='главный ветеринарный врач');
 const remaining=doctors.filter(d=>d!==chief);
 const administrative=d=>/администратор|учредитель/i.test(d.role);
 const sections=[['Клиническая команда',remaining.filter(d=>!administrative(d))],
  ['Администрация',remaining.filter(administrative)]];
 const feature=chief?'<article class="team-feature"><div class="chief-portrait">'+portrait(chief,true)+'</div>'+
 '<div class="chief-copy"><a class="chief-role-link" href="'+esc(href(chief.slug))+'">'+roleBadge(chief)+'</a><h2>'+personName(chief)+'</h2><p>'+esc(chief.summary)+'</p>'+
 '<a class="chief-action" href="'+esc(href(chief.slug))+'" aria-label="'+esc('О специалисте — '+chief.name)+'">'+profileAction+'</a></div></article>':'';
 return '<div class="wrap team-directory">'+crumb('Специалисты центра')+
 '<div class="team-mast"><h1>Специалисты центра</h1></div>'+feature+
 sections.filter(([,members])=>members.length).map(([label,members])=>'<section class="staff-section"><h2>'+esc(label)+'</h2><div class="staff-grid">'+members.map(personCard).join('')+'</div></section>').join('')+'</div>';
}
const pricesFor=s=>prices.map((p,i)=>({...p,i})).filter(p=>(p.category+' '+p.name).toLowerCase().includes(s.toLowerCase()));
function money(value){
 return String(value).split('\n').map(line=>{
  const match=line.trim().match(/^(от\s+)?(\d+)(?:\s+(за .+))?$/i);
  if(!match){
   const range=line.trim().match(/^(?:от )?(\d+)\s*(?:до|[-–])\s*(\d+)$/);
   return range?Number(range[1]).toLocaleString('ru-RU')+'–'+Number(range[2]).toLocaleString('ru-RU')+' ₽':line;
  }
  return (match[1]||'')+Number(match[2]).toLocaleString('ru-RU')+' ₽'+(match[3]?' '+match[3]:'');
 }).join(' / ');
}
const procedurePage=i=>'procedure-'+String(i+1).padStart(3,'0');
const priceNames=new Set(), repeatedNames=new Set();
for(const p of prices){if(priceNames.has(p.name))repeatedNames.add(p.name);priceNames.add(p.name)}
function priceVariant(p){
 if(!repeatedNames.has(p.name))return '';
 return p.note.split(/[\n(]/,1)[0].trim()||p.category;
}
function priceRow(p){
 const url=href(procedurePage(p.i)), variant=priceVariant(p);
 return '<a class="cost-entry" href="'+esc(url)+'"><span class="cost-name">'+esc(p.name)+(variant?'<small>'+esc(variant)+'</small>':'')+'</span><strong>'+esc(summaryMoney(p))+'</strong><span class="details-button">Подробнее <span aria-hidden="true">→</span></span></a>';
}
function callPanel(){
  const primary='<div class="callbox">'+icon('phone')+'<div><strong class="call-title">Позвонить в клинику</strong><div class="call-numbers">'+phoneLinks()+'</div></div></div>';
  return '<div class="call-actions">'+primary+'</div><p class="call-caption">Запись на приём по телефону</p>';
}
function home(){
  title('Волгоградский ветеринарный центр хирургии и травматологии');
  const shortcuts=[
    ['surgery','Хирургия','Малоинвазивные операции'],
    ['orthopedics','Травматология','Травмы, переломы и ортопедия'],
    ['diagnostics','Диагностика','Эндоскопия, рентген и УЗИ'],
    ['lab','Лаборатория','Исследования на месте']
  ];
  const featured=[
    ['surgery','Хирургия','Плановые и сложные операции'],
    ['orthopedics','Ортопедия','Травмы и заболевания суставов'],
    ['diagnostics','Диагностика','Эндоскопия, рентген, УЗИ и анализы']
  ];
  const imageKey=!window.preview.heroFilm&&window.matchMedia('(max-width:760px)').matches?'pdf-hero-mobile':'pdf-hero';
  return '<section class="home-cover"><div class="wrap cover-grid"><div class="cover-copy"><div class="kicker">Ветеринарная клиника в Волгограде</div><h1>Диагностика <br>и лечение<br><span>в одном центре</span></h1>'+
    '<p class="lead">Хирургия, ортопедия и травматология для собак и кошек. Эндоскопия, рентген, УЗИ и собственная лаборатория.</p><div class="home-call" role="group" aria-labelledby="home-call-title"><strong id="home-call-title">Позвонить в клинику</strong><div class="home-call-links">'+phoneLinks()+'</div></div></div>'+
    ('<div class="cover-film">'+img(imageKey,'Ветеринар с золотистым ретривером на приёме','cover-picture',true)+'<video class="hero-motion" autoplay muted loop playsinline preload="none" aria-hidden="true" disablepictureinpicture></video></div>')+'</div></section>'+
    '<div class="home-ribbon"><div class="shortcut wrap">'+shortcuts.map(([k,n,t])=>'<a href="'+href(k)+'">'+icon(k)+'<span><strong>'+n+'</strong><small class="desktop-sub">'+t+'</small><small class="mobile-sub">'+({surgery:'Эндоскопия',orthopedics:'Травмы и переломы',diagnostics:'Рентген и УЗИ',lab:'Анализы в клинике'})[k]+'</small></span></a>').join('')+'</div>'+
    '<div class="stats"><div class="wrap"><div><strong>10+ лет</strong><small>работы центра</small></div><div><strong>10:00–19:00</strong><small>ежедневно</small></div><a href="'+href('contacts')+'"><strong>Донецкая, 16А</strong><small>Волгоград</small></a></div></div></div>'+
    '<section class="wrap home-services"><div class="home-intro"><div><div class="kicker">Услуги центра</div><h2>Как мы <br>помогаем</h2></div></div><div class="grid">'+
    featured.map(([k,n,t])=>{return '<a class="card" href="'+href(k)+'">'+img('pdf-'+k,'')+'<div class="caption"><h3>'+n+'</h3><p>'+t+'</p></div><span class="arrow" aria-hidden="true">→</span></a>'}).join('')+'</div></section>';
}
function startCoverFilm(){
 const video=root.querySelector('.hero-motion');
 if(!video||!window.preview.heroFilm)return;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 let onscreen=true,source;
 async function sync(){
  if(document.hidden||reduce.matches||!onscreen){video.pause();return}
  try{
   source??=Promise.resolve(window.preview.heroFilm());
   const url=await source;
   if(document.hidden||reduce.matches||!onscreen)return;
   if(!video.src)video.src=url;
   await video.play();
  }catch{video.classList.remove('playing')}
 }
 video.muted=true;
 video.addEventListener('playing',()=>video.classList.add('playing'));
 video.addEventListener('error',()=>video.classList.remove('playing'));
 reduce.addEventListener('change',()=>{if(reduce.matches)video.classList.remove('playing');sync()});
 document.addEventListener('visibilitychange',sync);
 if('IntersectionObserver' in window){
  new IntersectionObserver(([entry])=>{onscreen=entry.isIntersecting;sync()}).observe(video);
 }
 sync();
}
function service(s){title(s[1]);const d=doctors.find(d=>d.slug===s[8]);return '<div class="wrap">'+crumb(s[1],['services','Услуги'])+'<div class="split pagehead"><div class="spaced"><div class="kicker">Услуги центра</div><h1>'+esc(s[1])+'</h1><p class="lead">'+esc(s[4])+'</p>'+actions()+'</div>'+img(s[3],s[1],'feature-img',true)+'</div></div><section class="block tint"><div class="wrap split"><h2>'+esc(s[5])+'</h2><p class="lead">'+esc(s[6])+'</p></div></section><section class="wrap block"><div class="sectiontop"><h2>Стоимость услуг</h2>'+link('prices','Все цены направления','btn',{direction:s[0]})+'</div>'+prices.map((p,i)=>({...p,i})).filter(p=>direction(p)===s[0]).slice(0,5).map(priceRow).join('')+'</section>'+(d?'<section class="wrap content article spaced"><h2>Специалист направления</h2><h3>'+link(d.slug,d.name,'textlink')+'</h3><p>'+esc(d.summary)+'</p></section>':'')}
function bio(d){title(d.name);return '<div class="wrap">'+crumb(d.name,['team','Врачи'])+'<section class="pagehead split staff-bio"><div class="bio-portrait">'+portrait(d,true)+'</div><div class="spaced">'+roleBadge(d)+'<h1>'+personName(d)+'</h1><p class="lead">'+esc(d.summary)+'</p>'+(/администратор|учредитель/i.test(d.role)?'':callPanel())+'<div class="actions">'+link('team','Вся команда','btn')+'</div>'+'</div></section></div>'+(d.details.length?'<section class="block tint"><div class="wrap split"><h2>Образование<br>и опыт</h2><div class="article">'+d.details.map(t=>'<p>'+esc(t)+'</p>').join('')+'</div></div></section>':'')}
function about(){
 title('О центре');
 return `<section class="wrap centre-spread"><div class="centre-copy"><h1>О центре</h1>
 <p class="centre-intro">С 2012 года принимаем собак, кошек и других питомцев на Донецкой, 16А.</p>
 <p>В команде — терапевты, хирурги, травматологи-ортопеды, анестезиолог и врач-лаборант. Для разных животных есть отдельные кабинеты. При центре работает ветаптека.</p>
 <div class="centre-equipment"><h2>Диагностика в центре</h2><div>${link('endoscopy','Эндоскопия')}${link('diagnostics','Рентген и УЗИ')}${link('lab','Лаборатория')}</div></div>
 <div class="actions">${link('team','Наши специалисты','btn primary')}${link('services','Все услуги','btn')}</div></div>
 <figure class="centre-image centre-instruments"><a href="${href('equipment')}" aria-label="Посмотреть оборудование клиники"><img src="assets/media/endoscopy.webp" alt="Оптические наконечники эндоскопов крупным планом" fetchpriority="high"><span class="centre-instrument-legend"><strong>Оборудование клиники</strong><span>Посмотреть раздел</span></span></a></figure></section>`;
}
function contact(){
 title('Контакты');
 return `<section class="wrap visit-contact"><h1>Контакты</h1><div class="contact-pair"><section class="address-panel"><h2>Как нас найти</h2>
 <address>Волгоград<br><strong>Донецкая, 16А</strong></address><p>Напротив стадиона «Динамо»</p>
 <a class="map-action" rel="noreferrer" href="https://yandex.ru/maps/org/1066278690/">Открыть в Яндекс Картах</a>
 <div class="visit-hours"><span>Ежедневно</span><strong>10:00–19:00</strong></div></section>
 <section class="reception-panel"><h2>Запись на приём</h2><p>Позвоните по любому из двух номеров. Администратор поможет выбрать врача и время приёма.</p>
 <div class="reception-phones">${phones.map(([label,tel])=>'<a href="tel:+'+tel+'">'+icon('phone')+esc(label)+'</a>').join('')}</div>
 <p class="reception-mail">Электронная почта<br><a href="mailto:volgovet@mail.ru">volgovet@mail.ru</a></p></section></div></section>`;
}
const cats=[...new Set(prices.map(p=>p.category))];
const photoCredits={"reptile": {"file": "reptile.webp", "source": "https://www.pexels.com/photo/close-up-shot-of-a-bearded-dragon-13028640/", "creator": "Kostiantyn Klymovets", "license": "Pexels License", "license_url": "https://www.pexels.com/license/", "changes": "Уменьшено и преобразовано в WebP", "alt": "Бородатая агама в террариуме"}, "rodent": {"file": "rodent.webp", "source": "https://www.pexels.com/photo/adorable-guinea-pig-sitting-on-a-cozy-blanket-30468830/", "creator": "Vika Glitter", "license": "Pexels License", "license_url": "https://www.pexels.com/license/", "changes": "Уменьшено и преобразовано в WebP", "alt": "Морская свинка на мягкой подстилке"}, "grooming": {"file": "grooming.webp", "source": "https://www.pexels.com/photo/dog-groomer-trimming-dogs-nails-19145872/", "creator": "Goochie Poochie Grooming", "license": "Pexels License", "license_url": "https://www.pexels.com/license/", "changes": "Уменьшено и преобразовано в WebP", "alt": "Уход за лапой собаки"}, "ward": {"file": "ward.webp", "source": "https://commons.wikimedia.org/wiki/File:Animals_Hospitalization_cages.jpg", "creator": "Ariel Palmon", "license": "CC BY-SA 3.0", "license_url": "https://creativecommons.org/licenses/by-sa/3.0/", "changes": "Уменьшено и преобразовано в WebP", "alt": "Боксы ветеринарного стационара, иллюстрация"}, "radiograph": {"file": "radiograph.webp", "source": "https://commons.wikimedia.org/wiki/File:Radiographie_thoracique_chien.jpg", "creator": "Ophélie TISSIER", "license": "CC BY-SA 4.0", "license_url": "https://creativecommons.org/licenses/by-sa/4.0/", "changes": "Уменьшено и преобразовано в WebP", "alt": "Рентгенограмма грудной клетки собаки в боковой проекции"}, "dental": {"file": "dental.webp", "source": "https://www.pexels.com/photo/a-veterinarian-examining-a-dog-teeth-6235115/", "creator": "Tima Miroshnichenko", "license": "Pexels License", "license_url": "https://www.pexels.com/license/", "changes": "Уменьшено и преобразовано в WebP", "alt": "Осмотр зубов собаки ветеринарным врачом"}, "microchip": {"source": "https://www.flickr.com/photos/87296837@N00/17400108206", "creator": "Tony Webster", "license": "CC BY 2.0", "license_url": "https://creativecommons.org/licenses/by/2.0/", "alt": "Сканер и микрочип для идентификации животного"}};
function direction(p){
 const text=(p.category+' '+p.name).toLowerCase();
 if(/лапаротом/.test(p.name.toLowerCase()))return 'surgery';
 if(/эндоскоп|гастроскоп/.test(text))return 'endoscopy';
 if(/стоматолог|зуб|ротовой полости/.test(text))return 'dentistry';
 if(/вакцинац/.test(text))return 'vaccination';
 if(/чипирован/.test(text))return 'chipping';
 if(/рентген|ультразвук|экг|люминесцентн/.test(text))return 'diagnostics';
 if(/остеосинтез|вывих|дисплази|ортопед|на конечностях|пункция сустава/.test(text))return 'orthopedics';
 if(/хирургические вмешательства|хирургическая обработка/.test(text))return 'surgery';
 if(/катетеризация мочевого/i.test(p.name))return 'therapy';
 if(/диагностические манипуляции|забор крови/.test(text))return 'lab';
 return /дополнительные услуги/i.test(p.category)?'additional':'therapy';
}
function itemImage(p){
 const text=(p.category+' '+p.name).toLowerCase();
 if(/стрижка|мыть[её]/.test(p.name.toLowerCase())&&pictures.grooming)return 'grooming';
 if(/рентген/.test(text))return 'radiograph';
 if(/чипирован/.test(text))return 'microchip';
 if(/ящериц|черепах/.test(text)&&pictures.reptile)return 'reptile';
 if(/грызун/.test(text)&&pictures.rodent)return 'rodent';
 if(/стационар/.test(text)&&pictures.ward)return 'ward';
 if(/грызуны и экзотические/.test(text))return 'lab';
 if(/консультац/.test(text)&&direction(p)==='therapy')return 'examination';
 return svc(direction(p))?.[3]||'examination';
}
const summaryMoney=p=>{
 const lines=p.price.split('\n');
 if(lines.length>1&&lines.every(s=>/^\d+$/.test(s.trim()))){
  const amounts=lines.map(Number);return Number(Math.min(...amounts)).toLocaleString('ru-RU')+'–'+money(String(Math.max(...amounts)));
 }
 if(p.price.includes('(Стандарт) или'))return p.price.replace(/(\d+) \(/g,(_,v)=>Number(v).toLocaleString('ru-RU')+' ₽ (');
 return money(p.price);
};
function tariff(p){
 const amounts=p.price.split('\n'),notes=p.note.split('\n');
 const profile=p.price.match(/^(\d+) \(Стандарт\) или (\d+) \(за один показатель\)$/);
 if(profile)return '<dl class="profile-price"><dt>Стандартный набор</dt><dd>'+money(profile[1])+'</dd><dt>Один показатель</dt><dd>'+money(profile[2])+'</dd></dl><p class="condition">'+esc(p.note)+'</p>';
 if(amounts.length>1&&amounts.length===notes.length){
  return '<table class="tariff"><caption>Стоимость по весовым категориям</caption><thead><tr><th>Вес и условия</th><th>Стоимость</th></tr></thead><tbody>'+
   amounts.map((v,i)=>'<tr><td>'+esc(notes[i])+'</td><td>'+esc(money(v))+'</td></tr>').join('')+'</tbody></table>';
 }
 return '<div class="single-cost"><span>Стоимость по прайсу клиники</span><strong>'+esc(summaryMoney(p))+'</strong></div>'+(p.note?'<p class="condition">'+esc(p.note)+'</p>':'');
}
function procedure(i){
 const p=prices[i],section=svc(direction(p))||['additional','Дополнительные услуги'],category=p.category.split(' · ').pop();
 const name=p.name.replace(/\s+/g,' ').trim();
 const other=prices.map((x,j)=>({...x,i:j})).filter(x=>x.i!==i&&x.category===p.category).slice(0,3);
 title(name);
 const imageKey=itemImage(p);
 const attribution=photoCredits[imageKey];
 const credit=attribution?'<figcaption>Иллюстрация · <a rel="noreferrer" href="'+esc(attribution.source)+'">'+esc(attribution.creator)+'</a> · <a rel="noreferrer" href="'+esc(attribution.license_url)+'">'+esc(attribution.license)+'</a> · адаптация WebP</figcaption>':'';
 const visit=procedureVisit(p,section);
 return '<div class="wrap procedure-wrap">'+crumb(name,['prices','Услуги и цены'])+
 '<section class="procedure-cover"><div><div class="kicker">'+esc(category)+'</div><h1>'+esc(name)+'</h1><p class="lead">'+esc(p.description)+'</p></div>'+
 '<figure>'+img(imageKey,attribution?.alt||'Иллюстрация направления «'+section[1]+'»','procedure-photo',true)+credit+'</figure></section>'+
 '<div class="procedure-lower"><section class="tariff-box"><h2>Стоимость</h2>'+tariff(p)+'</section>'+
 '<section class="visit-box"><h2>'+esc(visit[0])+'</h2><p>'+esc(visit[1])+'</p>'+callPanel()+'</section></div>'+
 '<div class="sectiontop related-head"><h2>В этом разделе</h2>'+link('prices','Все цены раздела','btn',{category:p.category})+'</div>'+
 other.map(priceRow).join('')+'</div>';
}
function procedureVisit(p,s){
 const n=p.name.toLowerCase();
 if(n.includes('без животного'))return ['К консультации','Подготовьте выписки, заключения и список вопросов о питомце. При записи уточните, какие материалы врач сможет разобрать на консультации без животного.'];
 if(n.includes('выезд'))return ['Как согласовать выезд','Позвоните в центр, назовите адрес и повод обращения. Администратор уточнит доступное время и условия выезда по вашему адресу.'];
 if(/грызуны и экзотические/.test(p.category.toLowerCase()))return ['Перед посещением','При записи назовите вид питомца и точное наименование процедуры. Уточните время приёма специалиста, который работает с этим видом животных.'];
 if(/стрижка|мытье|мытьё/.test(n))return ['Запись на уход','Назовите вид и размер питомца и нужную процедуру. Сотрудник центра уточнит подходящий тариф и варианты времени.'];
 if(/стационар/.test(p.category.toLowerCase()))return ['Условия пребывания','При звонке уточните продолжительность пребывания питомца, условия размещения и какие назначения оплачиваются отдельно.'];
 if(n.includes('повторный прием'))return ['К повторному приёму','Возьмите заключение прошлого приёма и результаты обследований, выполненных после него. Запишите, какие изменения вы заметили за это время.'];
 if(n.includes('забор крови'))return ['Забор материала и анализ','Забор крови и лабораторное исследование — отдельные позиции прайса. Назовите назначенные анализы при записи, чтобы уточнить полную стоимость и подготовку.'];
 if(n.includes('биохимическое исследование крови'))return ['Как выбрать тариф','В прайсе предусмотрены стандартный набор и расчёт за один показатель. Уточните у клиники, какой вариант соответствует назначению врача.'];
 if(/лапаротом/.test(n))return ['Что уточнить у хирурга','Это диагностическая хирургическая операция. При записи обсудите показания с врачом и уточните отдельные расходы на анестезию и наблюдение.'];
 if(/остеосинтез/.test(p.category.toLowerCase()))return ['К консультации по перелому','Если у вас уже есть рентгенограммы и заключение, возьмите их с собой. Спросите хирурга, какой именно позиции прайса соответствует план операции и как учитывается стоимость материалов.'];
 if(/стоматолог/.test(p.category.toLowerCase()))return ['Как рассчитывают стоимость','При записи назовите процедуру из прайса. Для услуги, рассчитанной на один зуб, итог зависит от количества зубов. Стоимость анестезии можно уточнить отдельно.'];
 if(/микроскоп|соскоб|цитолог|посев/.test(n))return ['Материал для исследования','Уточните, какой материал требуется для назначенного исследования, кто его берёт и оплачивается ли забор отдельно.'];
 if(/рентген/.test(n))return ['Перед рентгенографией','При записи назовите область исследования и уточните количество проекций. Если сохранились предыдущие снимки этой области, возьмите их с собой.'];
 if(/наркоз|анестез/.test(n))return ['Условия расчёта','Назовите запланированное вмешательство, вид и вес животного. Уточните у центра, как учитываются продолжительность анестезии и препараты.'];
 if(/блокад/.test(n))return ['Перед процедурой','Если на блокаду направил врач, сообщите при записи название назначенной процедуры и область вмешательства. Так в центре смогут уточнить нужную строку прайса.'];
 if(/стационар|кислородная камера/.test(n))return ['Размещение в центре','Уточните единицу времени, за которую рассчитан тариф, и входит ли наблюдение в общую стоимость пребывания.'];
 if(/чипирован|вакцинац/.test(n))return [s[5],s[6]];
 if(p.category.includes('Дополнительные'))return ['При записи','Назовите вид питомца и услугу из прайса. Администратор уточнит время и подскажет, какие документы или принадлежности могут потребоваться.'];
 return [s[5],s[6]];
}
function catalogue(){
 return head('Услуги и цены','Выберите раздел или введите название услуги. Откройте процедуру, чтобы посмотреть стоимость по прайсу клиники.','Прайс-лист клиники')+
 '<section class="wrap price-layout content"><aside><label for="find">Поиск услуги</label><input class="search" type="search" id="find" placeholder="Например, УЗИ или приём"><label for="category" class="visually-hidden">Раздел прайса</label><select class="category-mobile" id="category"></select><div class="categories" id="categories"></div></aside><div><div class="results-tools"><div class="priceres" role="status"></div><button class="filter-reset" id="reset-filters" type="button" hidden>Сбросить фильтры</button></div><div id="results"></div></div></section>';
}
const searchWords=text=>String(text??'').toLowerCase().replaceAll('ё','е').match(/[а-яa-z0-9]+/g)||[];
function searchStem(word){
 if(word.startsWith('биохим'))return 'биохим';
 if(word.startsWith('рентген'))return 'рентген';
 if(/^зуб(ы|ов|а|ной|ного|ных)?$/.test(word))return 'зуб';
 return word.length>4?word.replace(/(ами|ями|ого|ему|ыми|ими|ой|ей|ов|ия|ие|ы|и|а|я|у|е)$/,''):word;
}
function bindPrices(){
 const search=document.querySelector('#find'),select=document.querySelector('#category'),buttons=document.querySelector('#categories'),result=document.querySelector('#results');
 const all=['',...cats];let cat=q.get('category')??'';
 let selectedDirection=svc(q.get('direction'))?.[0]||'';if(!all.includes(cat))cat='';
 select.innerHTML=all.map(c=>'<option value="'+esc(c)+'">'+esc(c||'Все разделы')+'</option>').join('');
 search.value=q.get('search')||'';
 const reset=document.querySelector('#reset-filters');
 const indexed=prices.map((p,i)=>{
  const words=searchWords([p.name,p.category,p.note,p.description].join(' '));
  if(/ультразвуков[а-яё]* исследован/i.test(p.name))words.push('узи');
  return {row:{...p,i},words:words.map(searchStem)};
 });
 reset.onclick=()=>{cat='';selectedDirection='';search.value='';draw(true);search.focus()};
 function draw(save){
  select.value=cat;
  if(!buttons.childElementCount)buttons.innerHTML=all.map((c,i)=>'<button aria-pressed="'+(cat===c)+'" data-cat="'+i+'">'+esc(c.replace('Хирургические вмешательства · ','')||'Все разделы')+'</button>').join('');
  if(buttons.children)for(const b of buttons.children)b.setAttribute('aria-pressed',String(all[Number(b.dataset.cat)]===cat));
  const term=search.value.trim(),tokens=searchWords(term).map(searchStem);
  const hits=indexed.filter(({row,words})=>(!cat||row.category===cat)&&(!selectedDirection||direction(row)===selectedDirection)&&tokens.every(t=>words.some(w=>t.length<3?w===t:w.startsWith(t)))).map(({row})=>row);
  reset.hidden=!(term||selectedDirection||cat);
  document.querySelector('.priceres').textContent=hits.length?(selectedDirection?svc(selectedDirection)[1]+' · ':'')+'Найдено услуг — '+hits.length:'Услуг не найдено. Измените запрос или сбросьте фильтры.';
  let prev='';result.innerHTML=hits.map(p=>{const group=p.category!==prev?'<h2 class="group-title">'+esc(p.category.split(' · ').pop())+'</h2>':'';prev=p.category;return group+priceRow(p)}).join('');
  if(save){
   const params={};
   if(cat)params.category=cat;
   if(selectedDirection)params.direction=selectedDirection;
   if(term)params.search=search.value;
   history.replaceState(null,'',href('prices',params));
  }
 }
 buttons.onclick=e=>{const b=e.target.closest('button');if(b){cat=all[Number(b.dataset.cat)];selectedDirection='';draw(true)}};
 select.onchange=()=>{cat=select.value;selectedDirection='';draw(true)};
 search.oninput=()=>draw(true);draw(false);
}
const articles=data.articles||[];
const currentArticle=articles.find(a=>a.slug===page);
function articleListing(){
 title('Наши статьи');
 return `<section class="wrap paper-index"><div class="paper-mast"><h1>Наши статьи</h1><p>Обзоры ветеринарных исследований для владельцев собак и кошек</p></div>
 <div class="paper-stories">${articles.map((a,i)=>`<a class="paper-story" href="${esc(href(a.slug))}">${img(a.image,'','',i===0)}<div><h2>${esc(a.title)}</h2><p>${esc(a.dek)}</p><span class="paper-read">Читать статью</span></div></a>`).join('')}</div></section>`;
}
function articlePage(a){
 title(a.title);
 const meta=document.createElement('meta');meta.name='description';meta.content=a.dek;document.head.append(meta);
 const metadata=document.createElement('script');metadata.type='application/ld+json';
 metadata.textContent=JSON.stringify({'@context':'https://schema.org','@type':'Article',headline:a.title,description:a.dek,inLanguage:'ru',citation:a.sources.map(s=>s.url)});
 document.head.append(metadata);
 const credit=a.credit?`<figcaption>${esc(a.credit.label)} · <a href="${esc(a.credit.url)}">${esc(a.credit.author)}</a> · <a href="${esc(a.credit.licenseUrl)}">${esc(a.credit.license)}</a></figcaption>`:'';
 const marked=t=>esc(t).replace(/\[(\d+)\]/g,(mark,n)=>a.sources[n-1]?`<a class="cite" aria-label="Источник ${n}" href="${esc(a.sources[n-1].url)}">${mark}</a>`:mark);
 const other=articles[(articles.indexOf(a)+1)%articles.length];
 const direction=svc(a.service);
 return `<article class="wrap edition"><div class="edition-strip">${link('articles','Все статьи')}<span>Демонстрационный материал</span></div>
 <div class="edition-spread"><div class="edition-cover"><h1>${esc(a.title)}</h1><p>${esc(a.dek)}</p><figure>${img(a.image,a.alt,'',true)}${credit}</figure></div>
 <div class="edition-leaf"><div class="edition-controls"><label for="leaf-index">Содержание</label><select id="leaf-index">${[...a.sections.map(s=>s.heading),'Источники'].map((t,i)=>`<option value="${i+1}">${esc(t)}</option>`).join('')}</select></div>
 <div class="leaf-body">${a.sections.map(part=>`<section class="print-leaf"><h2 tabindex="-1">${esc(part.heading)}</h2>${part.paragraphs.map(t=>'<p>'+marked(t)+'</p>').join('')}</section>`).join('')}
 <section class="print-leaf"><h2 tabindex="-1">Источники</h2><ol>${a.sources.map(s=>`<li><a href="${esc(s.url)}">${esc(s.title)}</a></li>`).join('')}</ol>
 <div class="end-links">${direction?link(direction[0],direction[1]):''}${other!==a?link(other.slug,'Следующая статья — '+other.title):''}</div></section></div>
 <nav class="folio" aria-label="Перелистывание статьи"><button type="button" data-step="-1">Назад</button><span role="status"></span><button type="button" data-step="1">Далее</button></nav></div></div></article>`;
}
function bindEdition(a){
 const reader=root.querySelector('.edition-leaf'),leaves=Array.from(reader.querySelectorAll('.print-leaf'));
 const select=reader.querySelector('select'),back=reader.querySelector('[data-step="-1"]'),next=reader.querySelector('[data-step="1"]');
 let current=0,start;
 const fromURL=()=>Number(new URLSearchParams(location.search).get('list'))||1;
 function turn(n,action){
  const number=Math.max(1,Math.min(leaves.length,Number.isInteger(n)?n:1));
  if(action&&number===current)return;
  leaves.forEach((el,i)=>{el.hidden=i!==number-1});
  current=number;select.value=String(number);
  back.disabled=number===1;next.disabled=number===leaves.length;
  reader.querySelector('[role="status"]').textContent='Страница '+number+' из '+leaves.length;
  if(action){
   const url=new URL(location.href);url.searchParams.set('list',number);history.pushState(null,'',url);
   leaves[number-1].querySelector('h2').focus({preventScroll:true});
   if(reader.getBoundingClientRect().top<0)reader.scrollIntoView({block:'start',behavior:'instant'});
  }
 }
 select.onchange=()=>turn(Number(select.value),true);
 back.onclick=()=>turn(current-1,true);next.onclick=()=>turn(current+1,true);
 document.addEventListener('keydown',e=>{
  if(e.defaultPrevented||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||e.target.closest('input,select,textarea,[contenteditable]'))return;
  if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();turn(current+(e.key==='ArrowRight'?1:-1),true)}
 });
 const body=reader.querySelector('.leaf-body');
 body.addEventListener('touchstart',e=>{start=e.touches.length===1?[e.touches[0].clientX,e.touches[0].clientY]:null},{passive:true});
 body.addEventListener('touchcancel',()=>{start=null},{passive:true});
 body.addEventListener('touchend',e=>{
  if(!start||!e.changedTouches.length)return;
  const dx=e.changedTouches[0].clientX-start[0],dy=e.changedTouches[0].clientY-start[1];start=null;
  if(Math.abs(dx)>65&&Math.abs(dx)>2*Math.abs(dy)&&!window.getSelection()?.toString())turn(current+(dx<0?1:-1),true);
 },{passive:true});
 window.addEventListener('popstate',()=>turn(fromURL(),false));turn(fromURL(),false);
}
const currentService=svc(page), person=doctors.find(d=>d.slug===page);
if(root.dataset.sectionTitle && root.firstElementChild){title(root.dataset.sectionTitle)}
else if(page==='index'){root.innerHTML=home();startCoverFilm()}
else if(page==='articles')root.innerHTML=articleListing();
else if(currentArticle){
 root.innerHTML=articlePage(currentArticle);
 bindEdition(currentArticle);
}
else if(page==='services')root.innerHTML=head('Услуги центра','От профилактического приёма до эндоскопической операции. Выберите направление, чтобы узнать, как проходит визит и какие процедуры доступны.')+'<div class="wrap content"><div class="catalog-callout"><div><h2>Стоимость каждой услуги</h2><p>Консультации, процедуры, исследования и операции.</p></div>'+link('prices','Открыть услуги и цены','btn primary')+'</div><div class="grid service-directory">'+services.map(sCard).join('')+'</div></div>';
else if(page==='team')root.innerHTML=teamPage();
else if(page==='about')root.innerHTML=about();
else if(page==='contacts')root.innerHTML=contact();
else if(/^procedure-[0-9]{3}$/.test(page)&&prices[Number(page.slice(10))-1])root.innerHTML=procedure(Number(page.slice(10))-1);
else if(page==='prices'&&/^\d+$/.test(q.get('item')||'')&&prices[Number(q.get('item'))])root.innerHTML=procedure(Number(q.get('item')));
else if(page==='prices'){root.innerHTML=catalogue();bindPrices()}
else if(currentService)root.innerHTML=service(currentService);
else if(person)root.innerHTML=bio(person);

else root.innerHTML=head('Страница не найдена')+link('index','Вернуться на главную','btn');

if (!homePage && page !== 'contacts') {
 const address = page === 'about' ? '' : 'Волгоград, ул. Донецкая, 16А<br>';
 const numbers = root.querySelector('a[href^="tel:"]') ? '' : '<div class="inline">'+phoneLinks()+'</div>';
 const details = '<div class="wrap"><div>'+address+'<small>Ежедневно с 10:00 до 19:00</small></div>'+numbers+'</div>';
 const footer = document.querySelector('footer.site-footer');
 if (footer) footer.insertAdjacentHTML('afterbegin', details);
 else document.body.insertAdjacentHTML('beforeend','<footer>'+details+'</footer>');
}
