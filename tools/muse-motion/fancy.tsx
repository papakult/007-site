import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import { MediaBetweenText, type MediaBetweenTextRef } from "./MediaBetweenText";
import Floating, { FloatingElement } from "./Floating";
import CenterUnderline from "./CenterUnderline";

function ServiceTitle({link, label, url}: {link: HTMLElement, label: string, url: string}) {
  const ref = useRef<MediaBetweenTextRef>(null);
  useEffect(() => {
    const show = () => ref.current?.animate();
    const hide = () => ref.current?.reset();
    for (const [event, handler] of Object.entries({pointerenter: show, focus: show, pointerleave: hide, blur: hide})) {
      link.addEventListener(event, handler);
    }
    return () => {
      link.removeEventListener("pointerenter", show);
      link.removeEventListener("focus", show);
      link.removeEventListener("pointerleave", hide);
      link.removeEventListener("blur", hide);
    };
  }, [link]);
  const split = label.indexOf(" ");
  return <MediaBetweenText ref={ref} as="span" triggerType="ref" firstText={label.slice(0,split)}
    secondText={label.slice(split + 1)} mediaType="image" mediaUrl={url} alt=""
    className="media-title" mediaContainerClassName="media-insert"
    animationVariants={{initial:{width:0},animate:{width:57,transition:{duration:.24}}}}/>;
}

export function mountFancy() {
  const roots: ReturnType<typeof createRoot>[] = [];
  const restore: (() => void)[] = [];
  function mount(el: HTMLElement, node: React.ReactNode) {
    const original = Array.from(el.childNodes);
    const root = createRoot(el);
    roots.push(root);
    restore.push(() => el.replaceChildren(...original));
    root.render(<MotionConfig reducedMotion="user">{node}</MotionConfig>);
  }
  for (const link of document.querySelectorAll<HTMLElement>('[data-preview]')) {
    const el = link.querySelector<HTMLElement>('.service-title');
    if (el && link.dataset.preview) mount(el, <ServiceTitle link={link} label={el.textContent || ''} url={link.dataset.preview}/>);
  }
  for (const link of document.querySelectorAll<HTMLElement>('.desktop-nav a, .edition-link')) {
    mount(link, <CenterUnderline className="center-rule" underlineHeightRatio={.07}>{link.textContent}</CenterUnderline>);
  }
  for (const el of document.querySelectorAll<HTMLElement>('[data-floating]')) {
    const original = el.querySelector('img')!;
    mount(el, <Floating className="space-floating" sensitivity={16} easingFactor={.09}>
      <FloatingElement className="space-wide" depth={8}><img src={original.src} alt={original.alt}/></FloatingElement>
      <FloatingElement className="space-detail" depth={-18}><img src={el.dataset.detail} alt="Деталь образа из коллекции ателье"/></FloatingElement>
    </Floating>);
  }
  return () => {roots.forEach(root => root.unmount());restore.forEach(fn => fn());};
}
