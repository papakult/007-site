import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const prata = localFont({ src: '../../public/fonts/prata.ttf', variable: '--font-display', display: 'swap' });
const manrope = localFont({ src: '../../public/fonts/manrope.ttf', variable: '--font-body', display: 'swap' });

export const metadata: Metadata = {
  title: 'Тихий свет — ритуальные услуги | Концепт 007-A',
  description: 'Бережный подход к прощанию. Интерактивный концепт ритуальной службы: помощь, порядок действий и памятка для семьи. Проект студии 007-A.',
  metadataBase: new URL('https://007-a.ru'),
  alternates: { canonical: '/directions/sites/ritual/' },
  robots: { index: false, follow: true },
  openGraph: { title: 'Тихий свет', description: 'Когда важны забота, уважение и память.', locale: 'ru_RU', type: 'website' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru" className={`${prata.variable} ${manrope.variable}`}><body>{children}</body></html>;
}
