import { Virtuoso } from "react-virtuoso";
import type { User } from "../types";
import { EmptyState, ErrorState, LoadingState } from "./StatusPanels";
import { UserCard } from "./UserCard";

interface UserListProps {
  users: User[];
  isInitialLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  onLoadMore: () => void;
  onRetry: () => void;
  onClearFilters: () => void;
}

export function UserList({
  users,
  isInitialLoading,
  isLoadingMore,
  hasMore,
  error,
  onLoadMore,
  onRetry,
  onClearFilters,
}: UserListProps) {
  if (isInitialLoading) {
    return <LoadingState />;
  }

  if (error && users.length === 0) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (users.length === 0) {
    return <EmptyState onClear={onClearFilters} />;
  }

  return (
    <div className="h-full">
      {error && (
        <div className="mx-4 mt-4 rounded-xl border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-200">
          {error}{" "}
          <button type="button" className="font-semibold underline" onClick={onRetry}>
            Retry
          </button>
        </div>
      )}
      <Virtuoso
        className="h-full"
        data={users}
        endReached={() => {
          if (hasMore) {
            onLoadMore();
          }
        }}
        increaseViewportBy={400}
        itemContent={(_index, user) => (
          <div className="px-4 pb-3 md:px-6">
            <UserCard user={user} />
          </div>
        )}
        components={{
          Footer: () =>
            isLoadingMore ? (
              <p className="px-6 py-4 text-center text-sm text-muted">Loading more people…</p>
            ) : (
              <div className="h-8" />
            ),
        }}
      />
    </div>
  );
}
