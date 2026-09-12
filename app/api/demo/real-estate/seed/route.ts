import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { DEMO_AGENTS, DEMO_PROPERTIES } from '@/lib/real-estate/data';

/**
 * POST /api/demo/real-estate/seed
 * Idempotent seed of the real-estate demo data (agents + properties).
 */
export async function POST() {
  try {
    for (const agent of DEMO_AGENTS) {
      await prisma.realEstateAgent.upsert({
        where: { id: agent.id },
        update: {
          name: agent.name,
          nameEn: agent.nameEn ?? null,
          jobTitle: agent.jobTitle,
          phone: agent.phone,
          whatsapp: agent.whatsapp ?? null,
          email: agent.email ?? null,
          avatarUrl: agent.avatarUrl ?? null,
          rating: agent.rating,
          dealsClosed: agent.dealsClosed,
        },
        create: {
          id: agent.id,
          name: agent.name,
          nameEn: agent.nameEn ?? null,
          jobTitle: agent.jobTitle,
          phone: agent.phone,
          whatsapp: agent.whatsapp ?? null,
          email: agent.email ?? null,
          avatarUrl: agent.avatarUrl ?? null,
          rating: agent.rating,
          dealsClosed: agent.dealsClosed,
        },
      });
    }

    let count = 0;
    for (const p of DEMO_PROPERTIES) {
      await prisma.realEstateProperty.upsert({
        where: { slug: p.slug },
        update: {
          title: p.title,
          description: p.description,
          type: p.type,
          listingType: p.listingType,
          price: p.price,
          city: p.city,
          district: p.district,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          areaSqm: p.areaSqm,
          features: JSON.stringify(p.features),
          images: JSON.stringify(p.images),
          latitude: p.latitude ?? null,
          longitude: p.longitude ?? null,
          featured: p.featured,
          status: p.status,
          agentId: p.agentId ?? null,
        },
        create: {
          id: p.id,
          slug: p.slug,
          title: p.title,
          description: p.description,
          type: p.type,
          listingType: p.listingType,
          price: p.price,
          currency: p.currency,
          city: p.city,
          district: p.district,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          areaSqm: p.areaSqm,
          features: JSON.stringify(p.features),
          images: JSON.stringify(p.images),
          latitude: p.latitude ?? null,
          longitude: p.longitude ?? null,
          featured: p.featured,
          status: p.status,
          agentId: p.agentId ?? null,
        },
      });
      count++;
    }

    return NextResponse.json({ success: true, seededProperties: count, seededAgents: DEMO_AGENTS.length });
  } catch (error) {
    console.error('Real-estate seed failed:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
