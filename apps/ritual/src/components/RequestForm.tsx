'use client';
import { useRef, useState, type FormEvent } from 'react';
import { Arrow } from './Icons';

export default function RequestForm() {
  const [request, setRequest] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const result = useRef<HTMLDivElement>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    if (name.length < 2) { setError('Укажите ваше имя — не менее двух букв.'); (form.elements.namedItem('name') as HTMLInputElement)?.focus(); return; }
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) { setError('Проверьте номер телефона: от 10 до 15 цифр с кодом страны.'); (form.elements.namedItem('phone') as HTMLInputElement).focus(); return; }
    setError('');
    setRequest(`Обращение — Тихий свет\n\nИмя: ${name}\nТелефон: ${phone}\nТема: ${data.get('subject')}\nУдобное время: ${data.get('time')}\n\nПодготовлено в демонстрационной форме 007-A. Не отправлено.`);
    setStatus('Обращение подготовлено. В этой демоверсии данные никуда не отправляются. Вы можете сохранить текст на своём устройстве.');
    requestAnimationFrame(() => result.current?.focus());
  }
  function download() {
    const url = URL.createObjectURL(new Blob([request], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'obrashchenie-tihiy-svet.txt'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function copy() {
    try { await navigator.clipboard.writeText(request); setStatus('Текст обращения скопирован. Данные не отправлены.'); }
    catch { setStatus('Не удалось скопировать текст. Используйте кнопку «Скачать обращение».'); }
  }
  return <form className="request-form" onSubmit={submit}>
    <div className="form-top"><span className="eyebrow">Форма обращения</span><span className="form-time">01 / 02</span></div>
    <div className="fields-row">
      <label htmlFor="request-name">Как к вам обращаться<input id="request-name" name="name" placeholder="Ваше имя" autoComplete="name" minLength={2} maxLength={80} required aria-describedby={error ? 'form-error' : undefined}/></label>
      <label htmlFor="request-phone">Номер телефона<input id="request-phone" name="phone" type="tel" inputMode="tel" placeholder="+7 (___) ___-__-__" autoComplete="tel" maxLength={24} required aria-describedby={error ? 'form-error' : undefined}/></label>
    </div>
    <div className="fields-row">
      <label htmlFor="request-subject">В чём нужна помощь<select name="subject" id="request-subject" defaultValue="Хочу получить консультацию"><option>Хочу получить консультацию</option><option>Организация прощания</option><option>Оформление и принадлежности</option><option>Ритуальный транспорт</option></select></label>
      <label htmlFor="request-time">Удобное время звонка<select name="time" id="request-time" defaultValue="Как можно скорее"><option>Как можно скорее</option><option>Утром, 09:00–12:00</option><option>Днём, 12:00–18:00</option><option>Вечером, 18:00–21:00</option></select></label>
    </div>
    <label className="consent"><input name="consent" type="checkbox" required/><span>Я понимаю, что это демонстрационная форма: она подготовит текст обращения без отправки данных.</span></label>
    {error && <p className="form-error" role="alert" id="form-error">{error}</p>}
    <button className="button form-submit" type="submit">Подготовить обращение<Arrow/></button>
    <p className="form-note">Демонстрационный проект 007-A. Приём реальных заявок не подключён.</p>
    {request && <div className="form-result" ref={result} tabIndex={-1} role="status"><p>{status}</p><div className="result-actions"><button type="button" onClick={download}>Скачать обращение<Arrow diagonal/></button><button type="button" onClick={copy}>Скопировать текст</button><button type="button" onClick={() => { setRequest(''); setStatus(''); }}>Закрыть</button></div></div>}
  </form>;
}
