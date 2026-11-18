import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categories, collectionPath, pieces } from '@/lib/collection';
import { Catalog, PieceDetail } from '../Catalog';

type RouteProps = { params: Promise<{ slug: string }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return [...categories, ...pieces].map(({ slug }) => ({ slug }));
}

function getEntry(slug: string) {
  const category = categories.find(item => item.slug === slug);
  if (category) return { type: 'category' as const, item: category };
  const piece = pieces.find(item => item.slug === slug);
  if (piece) return { type: 'piece' as const, item: piece };
  return notFound();
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const { item } = getEntry(slug);
  return {
    title: item.title + ' | Коллекция',
    description: item.description,
    alternates: { canonical: collectionPath + slug + '/' },
  };
}

export default async function CollectionEntryPage({ params }: RouteProps) {
  const { slug } = await params;
  const entry = getEntry(slug);
  return entry.type === 'category' ? <Catalog category={entry.item} /> : <PieceDetail piece={entry.item} />;
}
