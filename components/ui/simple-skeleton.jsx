export function SimpleSkeleton({ className = "", ...props }) {
  return (
    <div
      className={`bg-gray-200 animate-pulse rounded-md ${className}`}
      {...props}
    />
  )
} 