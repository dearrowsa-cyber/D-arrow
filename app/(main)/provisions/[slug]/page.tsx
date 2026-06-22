import { notFound } from 'next/navigation';
import { projects } from '@/lib/data/portfolio';
import ClientProjectPage from './ClientProjectPage';

// Generate static params for all projects
export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return <ClientProjectPage project={project} />;
}

