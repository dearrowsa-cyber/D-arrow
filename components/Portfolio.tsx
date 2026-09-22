"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "@util/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { projects, ProjectCategory } from "@/lib/data/portfolio";

// Solid dark placeholder matching the card — no flash, tiny payload
const CARD_BG = "#12142b";
const DARK_BLUR =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect width='1' height='1' fill='%2312142b'/%3E%3C/svg%3E";

const categories: ProjectCategory[] = [
  "All",
  "Web Design",
  "Marketing",
  "Branding",
  "Web Development",
  "UI/UX Design",
];

const Portfolio = () => {
  const { t, lang } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>("All");

  const filteredProjects = projects.filter((project) =>
    activeFilter === "All" ? true : project.category.includes(activeFilter),
  );

  return (
    <section
      id="Portfolio"
      className="py-10 lg:py-16 border-t border-gray-800/40 bg-gradient-to-b from-transparent via-[rgba(255,77,109,0.03)] to-transparent"
    >
      <div className="w-full mx-auto px-4 md:px-8 max-w-7xl">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-brand-pink mb-3 px-4 py-1.5 rounded-full bg-brand-pink/5 border border-brand-pink/10">
            {lang === "ar" ? "أعمالنا" : "Our Work"}
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3 text-black dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-brand-pink dark:to-brand-orange">
            {t("discoverOurWork")}
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            {t("discoverDesc")}
          </p>
        </motion.div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                activeFilter === category
                  ? "bg-gradient-to-r from-brand-pink to-brand-orange text-white shadow-lg shadow-brand-pink/20 scale-105"
                  : "bg-white dark:bg-[#14162E] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700/50 hover:border-brand-pink/40 hover:text-brand-pink"
              }`}
            >
              {category === "All"
                ? lang === "ar"
                  ? "الكل"
                  : "All"
                : category === "Web Design"
                  ? lang === "ar"
                    ? "تصميم الويب"
                    : "Web Design"
                  : category === "Marketing"
                    ? lang === "ar"
                      ? "التسويق"
                      : "Marketing"
                    : lang === "ar"
                      ? "الهوية البصرية"
                      : "Branding"}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => {
              // Only eagerly load the first 3 (typically above-the-fold on desktop)
              const isAboveFold = i < 3;

              return (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="h-full"
                >
                  <Link
                    href={`/provisions/${project.slug}`}
                    className="block h-full relative group"
                  >
                    <div className="flex flex-col h-full rounded-2xl overflow-hidden bg-[#12142b] border border-white/[0.06] transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_16px_48px_rgba(255,77,109,0.12)] group-hover:border-brand-pink/20">
                      {/* Image Area */}
                      <div
                        className="relative aspect-[4/3] w-full overflow-hidden"
                        style={{ backgroundColor: CARD_BG }}
                      >
                        <Image
                          src={project.imageUrl}
                          alt={project.title[lang]}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          priority={isAboveFold}
                          loading={isAboveFold ? "eager" : "lazy"}
                          fetchPriority={isAboveFold ? "high" : "auto"}
                          decoding="async"
                          quality={72}
                          placeholder="blur"
                          blurDataURL={DARK_BLUR}
                        />

                        {/* Hover overlay with arrow */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none flex items-end justify-end p-4">
                          <span
                            className="isolate flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ring-1 ring-white/30 shadow-[0_8px_24px_rgba(255,77,109,0.45)] translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                            style={{
                              backgroundImage:
                                "linear-gradient(135deg, #FF4D6D 0%, #FF9A3C 100%)",
                            }}
                          >
                            <ArrowUpRight
                              className="w-4 h-4 text-white"
                              strokeWidth={2.5}
                            />
                          </span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-5 flex flex-col flex-grow">
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {project.category.map((cat, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-medium tracking-wide uppercase text-brand-pink/80 px-2 py-0.5 rounded-md bg-brand-pink/[0.06]"
                            >
                              {cat === "Web Design"
                                ? lang === "ar"
                                  ? "تصميم ويب"
                                  : "Web Design"
                                : cat === "Marketing"
                                  ? lang === "ar"
                                    ? "تسويق"
                                    : "Marketing"
                                  : cat === "Branding"
                                    ? lang === "ar"
                                      ? "هوية بصرية"
                                      : "Branding"
                                    : cat === "Web Development"
                                      ? lang === "ar"
                                        ? "تطوير ويب"
                                        : "Web Dev"
                                      : cat === "UI/UX Design"
                                        ? lang === "ar"
                                          ? "واجهات"
                                          : "UI/UX"
                                        : cat}
                            </span>
                          ))}
                        </div>

                        <h3 className="text-sm font-semibold text-white leading-snug mb-1.5 group-hover:text-brand-pink transition-colors duration-300">
                          {project.title[lang]}
                        </h3>

                        <p className="text-xs text-gray-400 mb-3">
                          {project.subtitle[lang]}
                        </p>

                        <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-2 flex-grow">
                          {project.description[lang]}
                        </p>

                        <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {project.logoUrl && (
                              <div
                                className="w-6 h-6 rounded-md p-0.5 flex items-center justify-center border border-white/10"
                                style={{ backgroundColor: CARD_BG }}
                              >
                                <Image
                                  src={project.logoUrl}
                                  alt=""
                                  width={20}
                                  height={20}
                                  className="object-contain"
                                  loading="lazy"
                                  decoding="async"
                                  quality={70}
                                  placeholder="blur"
                                  blurDataURL={DARK_BLUR}
                                />
                              </div>
                            )}
                            <div className="flex gap-1">
                              {project.tags[lang]
                                .slice(0, 2)
                                .map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="text-[9px] text-gray-400 dark:text-gray-500 px-1.5 py-0.5 rounded bg-gray-50 dark:bg-white/[0.03]"
                                  >
                                    {tag}
                                  </span>
                                ))}
                            </div>
                          </div>
                          <span className="text-[10px] font-medium text-brand-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                            {lang === "ar" ? "اكتشف" : "View"}
                            <ArrowUpRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {t("portfolioProjectDesc")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;
