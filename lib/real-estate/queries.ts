import prisma from '@/lib/prisma';
import { DEMO_AGENTS, DEMO_PROPERTIES, type DemoProperty } from './data';

// Parse the JSON-string columns stored in Postgres back into arrays.
function hydrate(row: Record<string, unknown>): DemoProperty {
  return {
    ...(row as unknown as DemoProperty),
    features: row.features ? (JSON.parse(String(row.features)) as string[]) : [],
    images: row.images ? (JSON.parse(String(row.images)) as string[]) : [],
  };
}

/**
 * Fetch all demo properties. Falls back to the bundled seed dataset
 * whenever the DB is unreachable or has not been seeded yet, so the
 * demo always renders.
 */
export async function getDemoProperties(): Promise<DemoProperty[]> {
  try {
    const rows = await prisma.realEstateProperty.findMany({
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    });
    if (rows.length > 0) return rows.map(hydrate);
  } catch {
    // DB offline — use static fallback below.
  }
  return [...DEMO_PROPERTIES].sort((a, b) => Number(b.featured) - Number(a.featured));
}

export async function getDemoPropertyBySlug(slug: string): Promise<DemoProperty | null> {
  try {
    const row = await prisma.realEstateProperty.findUnique({ where: { slug } });
    if (row) return hydrate(row);
  } catch {
    // DB offline — fall through to static lookup.
  }
  return DEMO_PROPERTIES.find((p) => p.slug === slug) ?? null;
}

export async function getDemoAgents(): Promise<DemoAgentMap> {
  const map: DemoAgentMap = {};
  try {
    const rows = await prisma.realEstateAgent.findMany();
    if (rows.length > 0) {
      for (const a of rows) map[a.id] = a;
      return map;
    }
  } catch {
    // ignore
  }
  for (const a of DEMO_AGENTS) map[a.id] = a;
  return map;
}

export type DemoAgentRecord = (typeof DEMO_AGENTS)[number];
export interface DemoAgentMap {
  [agentId: string]: DemoAgentRecord;
}
