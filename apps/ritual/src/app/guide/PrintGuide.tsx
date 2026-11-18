'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const canPrint = () => typeof window.print === 'function';
const serverSnapshot = () => false;

export default function PrintGuide() {
  const printable = useSyncExternalStore(subscribe, canPrint, serverSnapshot);
  return printable ? <button className="fg-print" type="button" onClick={() => window.print()}>Распечатать памятку</button> : null;
}
