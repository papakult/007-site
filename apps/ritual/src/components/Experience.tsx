'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type ComponentType } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Arrow, LilyMark, ServiceIcon } from './Icons';
import FamilyGuide from './RequestForm';
import type { SceneMotion, SceneProps } from './sceneMotion';
import { canMountWebGLScene } from './webglProbe';
const services = [
  { title: 'Организация\nпрощания', text: 'Внимание к каждой детали церемонии — от выбора места до сопровождения в день прощания.', detail: 'Церемония · сопровождение' },
  { title: 'Оформление\nи принадлежности', text: 'Цветы, ритуальные принадлежности и оформление пространства с уважением к семейным традициям.', detail: 'Флористика · оформление' },
  { title: 'Ритуальный\nтранспорт', text: 'Помощь с маршрутом, временем и транспортом для церемонии и сопровождающих близких.', detail: 'Маршрут · сопровождение' },
];
const steps = [
  { num: '01', title: 'Не оставайтесь одни', text: 'Свяжитесь с близким человеком. В трудный момент рядом нужен тот, кто сможет поддержать и помочь с первыми решениями.', tag: 'Поддержка рядом' },
  { num: '02', title: 'Уточните порядок действий', text: 'Дальнейшие шаги зависят от обстоятельств и места. Уточните необходимый порядок у соответствующей медицинской организации или экстренной службы.', tag: 'Спокойно, шаг за шагом' },
  { num: '03', title: 'Соберите важную информацию', text: 'Подготовьте имеющиеся документы и запишите вопросы. Специалист поможет уточнить, какие сведения потребуются в вашей ситуации.', tag: 'Ничего не упустить' },
  { num: '04', title: 'Обсудите прощание', text: 'Расскажите о пожеланиях семьи. Заранее обсудите состав услуг, время, стоимость и то, что для вас особенно важно.', tag: 'Ваши пожелания — в основе' },
];

export default function Experience() {
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const motion = useRef<SceneMotion>({ progress:0, reduced:false });
  const [sceneActive, setSceneActive] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);
  const [mountScene, setMountScene] = useState(false);
  const [SceneView, setSceneView] = useState<ComponentType<SceneProps> | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    let lenis: Lenis | undefined;
    let tick: ((time: number) => void) | undefined;
    media.add('(prefers-reduced-motion: no-preference)', () => {
      motion.current.reduced = false;
      lenis = new Lenis({ duration:1.15, smoothWheel:true, syncTouch:false, anchors:{ offset:-96 } });
      lenis.on('scroll', ScrollTrigger.update);
      tick = (time) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
      const ctx = gsap.context(() => {
        const timeline = gsap.timeline({ scrollTrigger:{ trigger:hero.current, start:'top top', end:'bottom bottom', scrub:1 } });
        timeline.to(motion.current, {progress:1, ease:'none', duration:1}, 0)
          .to('.hero-copy-first', { y:-55, opacity:0, duration:.26, ease:'none' }, .08)
          .fromTo('.hero-copy-second', { y:70, opacity:0 }, { y:0, opacity:1, duration:.3 }, .35)
          .to('.hero-copy-second', { y:-30, opacity:0, duration:.2 }, .83)
          .to('.scene-wrap', { xPercent: -5, scale:1.04, duration:1, ease:'none' }, 0)
          .to('.hero-scroll-line', { scaleY:1, duration:1, ease:'none' }, 0);
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
          gsap.from(element, { y:36, opacity:0, duration:.95, ease:'power2.out', scrollTrigger:{ trigger:element, start:'top 92%', once:true } });
        });
        gsap.from('.timeline-progress', { scaleY:0, ease:'none', scrollTrigger:{ trigger:'.steps', start:'top 70%', end:'bottom 75%', scrub:.6 } });
      }, root);
      return () => { ctx.revert(); if(tick)gsap.ticker.remove(tick); lenis?.destroy(); };
    });
    media.add('(prefers-reduced-motion: reduce)', () => { motion.current.reduced = true; motion.current.progress = 0; });
    const observer = new IntersectionObserver(([entry]) => setSceneActive(entry.isIntersecting && !document.hidden), { threshold:0 });
    if(hero.current) observer.observe(hero.current);
    function visibility() { if (hero.current) setSceneActive(!document.hidden && hero.current.getBoundingClientRect().bottom > 0); }
    document.addEventListener('visibilitychange', visibility);
    return () => { media.revert(); observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, []);

  useEffect(() => {
    if (!canMountWebGLScene()) return;
    let cancelled = false;
    import('./Scene')
      .then((mod) => {
        if (cancelled) return;
        setSceneView(() => mod.default);
        setMountScene(true);
      })
      .catch(() => { if (!cancelled) setMountScene(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function close(event: KeyboardEvent) { if(event.key === 'Escape') { setMenuOpen(false); document.getElementById('menu-toggle')?.focus(); } }
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menuOpen]);

  return <div ref={root} className="experience">
    <a href="#main-content" className="skip-link">Перейти к содержанию</a>
    <header className="header">
      <a className="identity" href="#top"><LilyMark/><span>ТИХИЙ СВЕТ<small>РИТУАЛЬНАЯ СЛУЖБА</small></span></a>
      <nav className={`navigation ${menuOpen ? 'is-open' : ''}`} id="navigation" aria-label="Главная навигация"><a href="#services" onClick={() => setMenuOpen(false)}>Услуги</a><a href="#first-hours" onClick={() => setMenuOpen(false)}>Первые часы</a><a href="#approach" onClick={() => setMenuOpen(false)}>Наш подход</a></nav>
      <a className="header-contact" href="#contact">Памятка для семьи<Arrow diagonal/></a>
      <button className="menu-toggle" id="menu-toggle" type="button" aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-controls="navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span/><span/></button>
    </header>
    <main id="main-content">
      <section className="hero" id="top" ref={hero} aria-labelledby="hero-title">
        <div className="hero-stage">
          <div className="hero-light" aria-hidden="true"/><div className={`hero-poster ${sceneReady ? 'scene-ready' : ''}`} aria-hidden="true"><Image src="/directions/sites/ritual/still-life.webp" alt="" fill sizes="100vw" preload/></div><div className={sceneReady ? 'scene-wrap is-live' : 'scene-wrap'} role="img" aria-label="Белые каллы и горящая свеча на тёмном каменном постаменте">{mountScene && SceneView ? <SceneView motion={motion} active={sceneActive} onReady={() => setSceneReady(true)} onFailure={() => { window.setTimeout(() => { setSceneReady(false); setMountScene(false); }, 0); }}/> : null}</div>
          <div className="scene-vignette" aria-hidden="true"/>
          <div className="hero-copy hero-copy-first">
            <div className="eyebrow"><span className="tiny-line"/> Забота. Уважение. Память.</div>
            <h1 id="hero-title">Когда важна<br/>каждая <em>деталь.</em></h1>
            <p>Поможем пройти трудный путь.<br/>Бережно организуем достойное прощание,<br className="desktop-break"/> чтобы вы могли быть рядом с близкими.</p>
            <a className="button hero-button" href="#contact">Открыть памятку<Arrow/></a>
          </div>
          <div className="hero-copy hero-copy-second" aria-hidden="true"><span className="eyebrow">Сохраняя главное</span><h2>Память остаётся.<br/><em>Заботы доверяют.</em></h2><p>Время, чтобы быть вместе.<br/>Внимание к тому, что действительно важно.</p></div>
          <div className="hero-bottom"><span className="scroll-hint"><span className="scroll-track"><i className="hero-scroll-line"/></span>Продолжить знакомство</span><span className="hero-caption">Свет, который остаётся с нами</span><span className="hero-index">01 <i>/</i> 04</span></div>
        </div>
      </section>
      <section className="services section-shell" id="services" aria-labelledby="services-title">
        <div className="section-heading" data-reveal><span className="eyebrow">01 — Бережная помощь</span><div><h2 id="services-title">Возьмём на себя<br/><em>организацию.</em></h2><p>Поможем с необходимым. Обсудим каждый шаг.<br/>Оставим вам время для самого важного.</p></div></div>
        <div className="services-grid">{services.map((service, i) => <article className="service-card" key={service.title} data-reveal><div className="service-top"><ServiceIcon type={i}/><span>0{i+1}</span></div><h3>{service.title.split('\n').map((line,j) => <span key={line}>{j>0 && <br/>}{line}</span>)}</h3><p>{service.text}</p><div className="service-bottom"><span>{service.detail}</span><a href="#contact" aria-label={`К памятке для семьи. ${service.title.replace('\n',' ')}`}><Arrow diagonal/></a></div></article>)}</div>
      </section>
      <section className="approach section-shell" id="approach" aria-labelledby="approach-title"><div className="approach-symbol" aria-hidden="true"><LilyMark/></div><span className="eyebrow" data-reveal>Тихое присутствие. Настоящая забота.</span><h2 id="approach-title" data-reveal>В такие моменты<br/>нужны <em>не лишние слова.</em><br/>Нужно знать, что вы не одни.</h2><p data-reveal>Вы можете задавать вопросы, не спешить с решениями<br className="desktop-break"/> и говорить о том, что важно именно вашей семье.</p><span className="approach-rule" aria-hidden="true"/></section>
      <section className="first-hours section-shell" id="first-hours" aria-labelledby="hours-title"><div className="hours-intro"><span className="eyebrow" data-reveal>02 — Порядок действий</span><h2 id="hours-title" data-reveal>Первые часы.<br/><em>Шаг за шагом.</em></h2><p data-reveal>В растерянности трудно понять, с чего начать.<br/>Ориентир, который поможет собраться.</p><a className="text-link" href="#contact" data-reveal>К памятке для семьи<Arrow diagonal/></a><p className="hours-footnote">Последовательность действий зависит<br/>от обстоятельств. Уточняйте её у специалистов.</p></div><div className="steps"><div className="timeline-track" aria-hidden="true"><i className="timeline-progress"/></div>{steps.map(step => <article className="step" key={step.num} data-reveal><span className="step-number">{step.num}</span><div><span className="step-tag">{step.tag}</span><h3>{step.title}</h3><p>{step.text}</p></div></article>)}</div></section>
      <section className="contact section-shell" id="contact" aria-labelledby="contact-title"><div className="contact-copy" data-reveal><span className="eyebrow">03 — Для близких</span><h2 id="contact-title">Подготовиться<br/><em>к первому<br/>разговору.</em></h2><p>Не обязательно знать ответы на все вопросы.<br/>Достаточно сделать первый шаг.</p><div className="contact-detail"><span className="contact-dot"/><span>Спокойный разговор.<br/>Внимание к вашей ситуации.</span></div></div><div data-reveal><FamilyGuide/></div></section>
    </main>
    <footer className="footer section-shell"><div className="footer-top"><a className="identity" href="#top"><LilyMark/><span>ТИХИЙ СВЕТ<small>ЗАБОТА. УВАЖЕНИЕ. ПАМЯТЬ.</small></span></a><a className="text-link" href="#top">Наверх<span>↑</span></a></div><div className="footer-bottom"><p>Демонстрационный проект. Название и услуги иллюстрируют концепцию сайта.<br/>Не является действующей ритуальной службой.</p><a href="/directions/sites/">Создано в <strong>007—A</strong><Arrow diagonal/></a></div></footer>
  </div>;
}
