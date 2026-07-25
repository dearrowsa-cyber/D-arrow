"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { projectsShowcase, type ProjectShowcase } from "@/lib/data/projects-showcase";

const DARK_BLUR =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg==";

/* ─── Lightbox ─── */
function Lightbox({
  project,
  startIndex,
  onClose,
  lang,
}: {
  project: ProjectShowcase;
  startIndex: number;
  onClose: () => void;
  lang: "en" | "ar";
}) {
  const [idx, setIdx] = useState(startIndex);
  const imgs = project.images;

  const prev = useCallback(
    () => setIdx((i) => (i === 0 ? imgs.length - 1 : i - 1)),
    [imgs.length]
  );
  const next = useCallback(
    () => setIdx((i) => (i === imgs.length - 1 ? 0 : i + 1)),
    [imgs.length]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Counter */}
      <span className="absolute top-5 left-1/2 -translate-x-1/2 text-sm text-white/60 font-medium tracking-wider">
        {idx + 1} / {imgs.length}
      </span>

      {/* Prev */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
        aria-label="Previous"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
        aria-label="Next"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Image */}
      <motion.div
        key={idx}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.25 }}
        className="relative w-[90vw] h-[80vh] md:w-[70vw] md:h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={imgs[idx]}
          alt={`${project.title[lang]} - ${idx + 1}`}
          fill
          className="object-contain select-none"
          sizes="90vw"
          priority
        />
      </motion.div>

      {/* Title */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
        <p className="text-white/80 text-sm font-semibold">
          {project.title[lang]}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Project Card ─── */
function ProjectCard({
  project,
  index,
  lang,
  onOpenGallery,
}: {
  project: ProjectShowcase;
  index: number;
  lang: "en" | "ar";
  onOpenGallery: (projectId: string, imageIndex: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group"
    >
      {/* Cover Image */}
      <div
        className="relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer bg-[#0c0e20]"
        onClick={() => onOpenGallery(project.id, 0)}
      >
        <Image
          src={project.coverImage}
          alt={project.title[lang]}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          placeholder="blur"
          blurDataURL={DARK_BLUR}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Hover eye icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl"
          >
            <Eye className="w-6 h-6 text-white" />
          </motion.div>
        </div>

        {/* Image count badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-[11px] text-white/80 font-medium flex items-center gap-1">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          {project.images.length}
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 inset-x-0 p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-400">
          <h3 className="text-base md:text-lg font-bold text-white mb-1 drop-shadow-lg">
            {project.title[lang]}
          </h3>
          <p className="text-[11px] md:text-xs text-white/70 line-clamp-2 leading-relaxed">
            {project.description[lang]}
          </p>
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-1.5 mt-2.5 overflow-hidden">
        {project.images.slice(1, 5).map((img, i) => (
          <div
            key={i}
            onClick={() => onOpenGallery(project.id, i + 1)}
            className="relative flex-1 aspect-square rounded-lg overflow-hidden cursor-pointer bg-[#0c0e20] group/thumb"
          >
            <Image
              src={img}
              alt={`${project.title[lang]} ${i + 2}`}
              fill
              className="object-cover transition-transform duration-500 group-hover/thumb:scale-110"
              sizes="80px"
              placeholder="blur"
              blurDataURL={DARK_BLUR}
            />
            <div className="absolute inset-0 bg-black/10 group-hover/thumb:bg-black/0 transition-colors" />
            {/* Show "+N" on last thumb if more images */}
            {i === 3 && project.images.length > 5 && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  +{project.images.length - 5}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export default function ProjectsShowcase() {
  const { lang } = useLanguage();
  const [lightbox, setLightbox] = useState<{
    project: ProjectShowcase;
    index: number;
  } | null>(null);

  const openGallery = useCallback(
    (projectId: string, imageIndex: number) => {
      const project = projectsShowcase.find((p) => p.id === projectId);
      if (project) setLightbox({ project, index: imageIndex });
    },
    []
  );

  const closeLightbox = useCallback(() => setLightbox(null), []);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  return (
    <>
      <section
        id="projects"
        className="py-12 lg:py-20 border-t border-gray-800/40 bg-gradient-to-b from-transparent via-[rgba(139,92,246,0.03)] to-transparent relative overflow-hidden"
      >
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-brand-pink/[0.04] to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="w-full mx-auto px-4 md:px-8 max-w-7xl relative">
          {/* Section Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-brand-pink mb-3 px-4 py-1.5 rounded-full bg-brand-pink/5 border border-brand-pink/10">
              {lang === "ar" ? "مشاريعنا" : "Our Projects"}
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3 text-black dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-brand-pink dark:via-brand-orange dark:to-brand-pink">
              {lang === "ar"
                ? "تصميمات سوشيال ميديا لعملائنا"
                : "Social Media Designs for Our Clients"}
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {lang === "ar"
                ? "نفخر بتقديم أعمالنا الإبداعية لعملائنا في مختلف المجالات — كل مشروع يحكي قصة نجاح."
                : "We take pride in our creative work for clients across diverse industries — each project tells a success story."}
            </p>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projectsShowcase.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                lang={lang}
                onOpenGallery={openGallery}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
              {lang === "ar"
                ? "هل تريد تصميمات مشابهة لعلامتك التجارية؟"
                : "Want similar designs for your brand?"}
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-pink to-brand-orange text-white text-sm font-semibold shadow-lg shadow-brand-pink/20 hover:shadow-brand-pink/40 hover:scale-105 transition-all duration-300"
            >
              {lang === "ar" ? "تواصل معنا" : "Get in Touch"}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Portal */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox
            project={lightbox.project}
            startIndex={lightbox.index}
            onClose={closeLightbox}
            lang={lang}
          />
        )}
      </AnimatePresence>
    </>
  );
}
