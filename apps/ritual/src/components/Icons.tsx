export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function LilyMark() {
  return <svg viewBox="0 0 40 48" fill="none" aria-hidden="true"><path d="M20 41V24m0 7C6 24 7 11 6 7c8 0 12 4 14 9C22 8 29 4 34 3c1 15-3 23-14 28Z" stroke="currentColor" strokeWidth="1.1"/><path d="M20 26c-1-8 5-14 10-18M20 31c-6-3-11-9-12-16M20 41c5-2 8-5 9-9-6 1-9 4-9 9Z" stroke="currentColor" strokeWidth=".8"/></svg>;
}
export function ServiceIcon({ type }: { type: number }) {
  return <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1.05" strokeLinecap="round" strokeLinejoin="round">{type === 0 ? <><path d="M10 42h32M16 42V22h20v20M12 22 26 9l14 13M22 42V30h8v12M26 5v8M22 9h8"/><path d="M8 42V29h8m20 0h8v13"/></> : type === 1 ? <><path d="M12 35h28V16H12v19ZM8 35v6h36v-6M17 35V21h18v14M21 26h10M21 30h10"/><path d="M20 16V9h12v7M26 5v4M23 7h6"/></> : <><path d="M8 34h36v-8l-8-9H20l-6 9H8v8ZM20 17v9h22M14 26h6M8 30h4M39 30h5"/><circle cx="16" cy="35" r="4"/><circle cx="36" cy="35" r="4"/><path d="M25 21h7M28.5 18v6"/></>}</g></svg>;
}
