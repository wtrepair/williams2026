export default function WellIcon({
  size = 24,
  strokeWidth = 2,
  className = "",
  ...props
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-well ${className}`.trim()}
      aria-hidden="true"
      {...props}
    >
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M10 6v14a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V6" />
      <path d="M14 10h4a2 2 0 0 1 2 2v2" />
      <path d="M2 14h5m10 0h5" />
      <path d="M10 17h4" />
    </svg>
  );
}
