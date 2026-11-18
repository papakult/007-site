import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { BureauHeader, BureauFooter } from '../components/BureauFrame';
import './globals.css';

const display = localFont({src:'../../public/fonts/prata.ttf',variable:'--font-display',display:'swap'});
const body = localFont({src:'../../public/fonts/manrope.ttf',variable:'--font-body',weight:'200 800',display:'swap'});

export const metadata: Metadata = {
  metadataBase:new URL('https://007-a.ru'),
  title:{ default:'Тихий свет — частное похоронное бюро | 007-А',template:'%s · Тихий свет' },
  description:'Камерные церемонии, кремация, авторские памятники и коллекция мемориальных изделий. Демонстрационный проект студии 007-А.',
  robots:{index:false,follow:true},
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="ru" className={`${display.variable} ${body.variable}`}><body><BureauHeader/>{children}<BureauFooter/></body></html>;
}
