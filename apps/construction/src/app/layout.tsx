import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
const manrope = localFont({ src: '../../public/fonts/manrope.ttf', display: 'swap', variable: '--font-manrope' });
const url = 'https://007-a.ru/directions/sites/construction/';
export const metadata: Metadata = {
  metadataBase: new URL('https://007-a.ru'),
  title: 'ОПОРА — архитектура, которая становится жизнью | Концепция 007-A',
  description: 'Концепция сайта строительной компании от 007-A: коттеджи, жилые комплексы, коммерческие и промышленные объекты. Интерактивная сборка дома и форма расчёта проекта.',
  alternates: { canonical: url },
  openGraph: { title: 'ОПОРА — создаём пространство для жизни', description: 'Архитектура. Строительство. Внимание к каждой детали. Демонстрационный проект 007-A.', url, locale:'ru_RU', type:'website', images: [{url:'/directions/sites/construction/hero-villa.webp',width:1600,height:900,alt:'Современная вилла из камня и стекла в вечернем свете'}] },
  twitter: {card:'summary_large_image',title:'ОПОРА — архитектура для жизни',images:['/directions/sites/construction/hero-villa.webp']},
  robots: {index:true,follow:true}, icons: {icon:'/favicon.ico'},
};
export const viewport: Viewport = {themeColor:'#191b18',width:'device-width',initialScale:1};
export default function RootLayout({children}:{children:React.ReactNode}) {
  const schema = {'@context':'https://schema.org','@type':'WebPage',name:'ОПОРА — концепция строительного сайта',url,description:'Демонстрационный проект строительной компании. Объекты — архитектурные визуализации.',inLanguage:'ru',isPartOf:{'@type':'WebSite',name:'007-A',url:'https://007-a.ru'}};
  return <html lang="ru" className={manrope.variable}><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>{children}</body></html>;
}
