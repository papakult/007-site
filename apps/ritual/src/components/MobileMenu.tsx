'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export default function MobileMenu({children}:{children:ReactNode}) {
  const menu=useRef<HTMLDetailsElement>(null);
  useEffect(()=>{
    function closeOutside(event:PointerEvent){
      if(menu.current?.open && event.target instanceof Node && !menu.current.contains(event.target)) menu.current.open=false;
    }
    function closeOnEscape(event:KeyboardEvent){
      if(event.key==='Escape'&&menu.current?.open){menu.current.open=false;menu.current.querySelector('summary')?.focus();}
    }
    document.addEventListener('pointerdown',closeOutside);
    document.addEventListener('keydown',closeOnEscape);
    return ()=>{document.removeEventListener('pointerdown',closeOutside);document.removeEventListener('keydown',closeOnEscape);};
  },[]);
  return <details className="bureau-menu" ref={menu}><summary aria-label="Меню разделов"><span>Меню</span><i aria-hidden="true"/></summary>
    <nav aria-label="Мобильное меню" onClick={(e)=>{if(e.target instanceof Element && e.target.closest('a') && menu.current) menu.current.open=false;}}>{children}</nav></details>;
}
