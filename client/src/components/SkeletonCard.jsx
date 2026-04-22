export default function SkeletonCard() {
  return (
    <div className="block">
      <div className="aspect-[3/4] skeleton" />
      <div className="pt-3 space-y-2">
        <div className="h-4 skeleton w-3/4" />
        <div className="h-3 skeleton w-1/2" />
        <div className="h-4 skeleton w-1/3" />
      </div>
    </div>
  );
}
