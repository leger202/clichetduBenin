/**
 * Frise de triangles aux couleurs du drapeau béninois,
 * inspirée des tissus traditionnels.
 */
export default function FlagStrip({
  className = "",
  triangles = 48,
}: {
  className?: string;
  triangles?: number;
}) {
  const colors = ["#0a7a46", "#f2b90d", "#cf3a2a"];
  const w = 100 / triangles;
  const points = Array.from({ length: triangles }, (_, i) => {
    const x0 = i * w;
    const x1 = x0 + w;
    const xm = x0 + w / 2;
    return { x0, x1, xm, color: colors[i % 3] };
  });

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 100 10"
        preserveAspectRatio="none"
        className="block h-3.5 w-full"
      >
        {points.map((p, i) => (
          <polygon
            key={i}
            points={`${p.x0},10 ${p.x1},10 ${p.xm},0`}
            fill={p.color}
          />
        ))}
      </svg>
    </div>
  );
}
