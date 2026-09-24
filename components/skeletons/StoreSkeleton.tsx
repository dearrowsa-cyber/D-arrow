export default function StoreSkeleton() {
  return (
    <div
      className="min-h-screen bg-[#070913] text-white pt-28 pb-20"
      aria-busy="true"
      aria-label="Loading store"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Hero */}
        <section className="rounded-3xl border border-[#FF4D6D]/25 bg-[#12142B]/95 p-6 sm:p-10">
          <div className="space-y-4">
            <div className="h-6 w-64 animate-pulse rounded-full bg-white/[0.08]" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-white/10 sm:w-1/2" />
            <div className="h-5 w-full max-w-xl animate-pulse rounded bg-white/[0.06]" />
          </div>
        </section>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-32 animate-pulse rounded-xl bg-white/[0.08]"
            />
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#0D0F22]"
            >
              <div className="aspect-[16/11] animate-pulse bg-white/[0.08]" />
              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 animate-pulse rounded bg-[#FF4D6D]/15" />
                  <div className="h-4 w-12 animate-pulse rounded bg-white/[0.06]" />
                </div>
                <div className="h-6 w-4/5 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-full animate-pulse rounded bg-white/[0.06]" />
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-10 flex-1 animate-pulse rounded-xl bg-white/[0.08]" />
                    <div className="h-10 w-20 animate-pulse rounded-xl bg-white/[0.06]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}