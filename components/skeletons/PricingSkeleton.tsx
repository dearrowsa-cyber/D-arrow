import styles from "@/app/(main)/pricing/pricing.module.css";

export default function PricingSkeleton() {
  return (
    <div
      className={styles.page}
      dir="rtl"
      aria-busy="true"
      aria-label="Loading pricing"
    >
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div className="mx-auto h-4 w-24 animate-pulse rounded-full bg-white/[0.08]" />
          <div className="mx-auto mt-4 h-8 w-72 animate-pulse rounded bg-white/10 md:w-96" />
          <div className="mx-auto mt-4 h-5 w-80 animate-pulse rounded bg-white/[0.06] md:w-[34rem]" />
        </div>

        <div className={styles.packagesGrid}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={styles.pkg}>
              <div className="mx-auto h-6 w-32 animate-pulse rounded bg-white/10" />
              <div className="mx-auto mt-2 h-4 w-40 animate-pulse rounded bg-white/[0.06]" />
              <div className="mx-auto mt-7 h-7 w-44 animate-pulse rounded bg-white/10" />
              <div className="mx-auto mt-2 h-3 w-36 animate-pulse rounded bg-white/[0.06]" />
              <div className="mt-7 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="mx-auto h-3 w-52 animate-pulse rounded bg-white/[0.06]"
                  />
                ))}
              </div>
              <div className="mt-8 h-12 animate-pulse rounded-xl bg-white/[0.08]" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}