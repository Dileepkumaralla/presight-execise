interface StatusPanelProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

function StatusPanel({ title, message, actionLabel, onAction }: StatusPanelProps) {
  return (
    <div className="flex h-full min-h-72 flex-col items-center justify-center px-6 text-center">
      <h2 className="font-display text-3xl">{title}</h2>
      <p className="mt-2 max-w-md text-muted">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-paper"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="space-y-3 p-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-28 animate-pulse rounded-2xl border border-line bg-card"
        />
      ))}
    </div>
  );
}

export function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <StatusPanel
      title="No people match"
      message="Try a different name, or remove a hobby or nationality filter to widen the directory."
      actionLabel="Clear filters"
      onAction={onClear}
    />
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <StatusPanel
      title="Directory unavailable"
      message={message}
      actionLabel="Try again"
      onAction={onRetry}
    />
  );
}
