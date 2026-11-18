'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { plate } from '../lib/site';

const scrollCoverQuery = '(min-width: 701px) and (min-height: 621px) and (prefers-reduced-motion: no-preference)';

const scenes = [
  {image:'hero-wide',alt:'Бронзовые двери в арочном портале из известняка, под сенью старого дерева',label:'Бюро',type:'Частное похоронное бюро',title:'Архитектура',last:'памяти',copy:'Камерные церемонии прощания, семейные мемориалы и вещи, которые хранят личную историю.',action:'Выбрать церемонию',url:'/#services'},
  {image:'ceremony',alt:'Гроб из тёмного ореха в частном зале с высокими окнами',label:'Прощание',type:'Традиционное захоронение',title:'Церемония',last:'прощания',copy:'Тихий зал, любимая музыка и время для слов, которые хочется сказать в кругу близких.',action:'О захоронении',url:'/ceremonies/burial/'},
  {image:'urn',alt:'Полупрозрачная каменная урна в тёплом боковом свете',label:'Кремация',type:'Прощание и кремация',title:'Камерное',last:'прощание',copy:'Открытая церемония или встреча в узком кругу. Семья выбирает место, ритм и детали прощания.',action:'О кремации',url:'/ceremonies/cremation/'},
  {image:'monument',alt:'Светлая мемориальная арка среди кипарисов и низких цветов',label:'Мемориал',type:'Мемориальная архитектура',title:'Семейный',last:'мемориал',copy:'Камень, бронза и живой сад образуют место, куда можно возвращаться год за годом.',action:'Посмотреть мемориалы',url:'/ceremonies/memorials/'},
];

export default function ScrollCover() {
  const region=useRef<HTMLElement>(null);
  const stage=useRef<HTMLDivElement>(null);
  const [active,setActive]=useState(0);
  useEffect(()=>{
    const target=region.current;
    const frame=stage.current;
    if(!target||!frame) return;
    target.classList.add('is-ready');
    const scrollMode = window.matchMedia(scrollCoverQuery);
    let tick=0;
    const update=()=>{
      tick=0;
      if (!scrollMode.matches) return;
      const box=target.getBoundingClientRect();
      const distance=box.height-frame.offsetHeight;
      if(distance>1) setActive(Math.max(0,Math.min(scenes.length-1,Math.round((parseFloat(getComputedStyle(frame).top)-box.top)/distance*(scenes.length-1)))));
    };
    const schedule=()=>{if(!tick) tick=requestAnimationFrame(update);};
    const resize = new ResizeObserver(schedule);
    const syncMode = () => {
      target.classList.toggle('is-scroll-driven', scrollMode.matches);
      if (scrollMode.matches) {
        resize.observe(target);
        resize.observe(frame);
        window.addEventListener('scroll', schedule, { passive: true });
        schedule();
      } else {
        resize.disconnect();
        window.removeEventListener('scroll', schedule);
      }
    };
    scrollMode.addEventListener('change', syncMode);
    syncMode();
    return () => {
      target.classList.remove('is-ready', 'is-scroll-driven');
      cancelAnimationFrame(tick);
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      scrollMode.removeEventListener('change', syncMode);
    };
  },[]);
  function select(index:number) {
    if(!region.current||!stage.current) return;
    setActive(index);
    if (!region.current.classList.contains('is-scroll-driven')) return;
    const current=region.current.getBoundingClientRect();
    const distance=current.height-stage.current.offsetHeight;
    const top=window.scrollY+current.top-parseFloat(getComputedStyle(stage.current).top)+distance*index/(scenes.length-1);
    window.scrollTo({top:index===0?0:top,behavior:'instant'});
  }
  const scene=scenes[active];
  return <section className="cover-track" ref={region} aria-label="Бюро и его направления">
    <div className="cover-stage" ref={stage}>
      <div className="cover-stills" aria-hidden="true">{scenes.map((s,i)=><div className={'cover-still still-'+i+(i===active?' selected':'')} key={s.image}><Image src={plate(s.image)} alt="" fill sizes="100vw" loading={i===0?'eager':'lazy'} fetchPriority={i===0?'high':undefined}/></div>)}</div>
      <div className="cover-shade"/>
      <div className="cover-copy" key={scene.image}>
        <p className="cover-kicker"><b aria-hidden="true"/> {scene.type}</p>
        {active===0?<h1>{scene.title}<br/><em>{scene.last}</em></h1>:<><h1 className="visually-hidden">Тихий свет — частное похоронное бюро</h1><h2>{scene.title}<br/><em>{scene.last}</em></h2></>}
        <p className="cover-summary">{scene.copy}</p>
        <Link prefetch={false} className="cover-cta" href={scene.url}>{scene.action}</Link>
      </div>
      <div className="cover-controls" role="group" aria-label="Сцены обложки">{scenes.map((s,i)=><button key={s.label} type="button" aria-pressed={active===i} onClick={()=>select(i)}><span className="scene-rule" aria-hidden="true"/>{s.label}</button>)}</div>
      <div className="cover-caption" aria-hidden="true"><i/> Листайте вниз</div>
    </div>
  </section>;
}
