import type { Metadata } from 'next';
import { collectionPath } from '@/lib/collection';
import { Catalog } from './Catalog';

export const metadata: Metadata = {
  title: 'Коллекция предметов памяти',
  description: 'Гробы, урны, цветы, памятные украшения и архитектурные мемориалы. Иллюстрированный каталог частного ритуального бюро.',
  alternates: { canonical: collectionPath },
};

export default function CollectionPage() {
  return <Catalog />;
}
