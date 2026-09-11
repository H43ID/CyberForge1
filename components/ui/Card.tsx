export function Card({
  children,
  className = "",
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`glass-panel rounded-lg p-5 ${
        hover ? "transition-colors duration-200 hover:border-dusty-rose/40" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
