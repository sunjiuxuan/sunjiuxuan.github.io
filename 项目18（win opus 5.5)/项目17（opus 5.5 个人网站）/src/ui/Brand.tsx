export function Blossom({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <g fill="currentColor">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse
            key={a}
            cx="32"
            cy="21"
            rx="7.5"
            ry="12"
            transform={`rotate(${a} 32 32)`}
          />
        ))}
      </g>
      <circle cx="32" cy="32" r="4" fill="#f4f1e8" />
    </svg>
  );
}
