export default function BlogSkeleton() {
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#0a0e27] to-[#14162E] pt-32 pb-20"
      aria-busy="true"
      aria-label="Loading blog"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-12">
        <div className="mx-auto mb-12 max-w-2xl space-y-4 text-center">
          <div className="mx-auto h-10 w-64 animate-pulse rounded-lg bg-white/10 md:h-14 md:w-96" />
          <div className="mx-auto h-5 w-72 animate-pulse rounded bg-white/[0.06] md:w-[28rem]" />
        </div>

        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-24 animate-pulse rounded-full bg-white/[0.08]"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D0F25]"
            >
              <div className="h-52 animate-pulse bg-white/[0.08]" />
              <div className="space-y-4 p-6">
                <div className="flex gap-2">
                  <div className="h-6 w-24 animate-pulse rounded-full bg-[#FF4D6D]/15" />
                  <div className="h-5 w-16 animate-pulse rounded bg-white/[0.06]" />
                </div>
                <div className="h-7 w-4/5 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-full animate-pulse rounded bg-white/[0.06]" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-white/[0.06]" />
                <div className="border-t border-white/[0.08] pt-4">
                  <div className="h-9 w-full animate-pulse rounded-xl bg-white/[0.08]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
