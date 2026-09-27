import { useState } from "react";
import type { User } from "../types";

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const visibleHobbies = user.hobbies.slice(0, 2);
  const remaining = user.hobbies.length - visibleHobbies.length;
  const initials = `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`;

  return (
    <article className="grid grid-cols-[72px_1fr] gap-4 rounded-2xl border border-line bg-card p-4 shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
      {imageFailed ? (
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-accent-soft text-lg font-semibold text-accent">
          {initials}
        </div>
      ) : (
        <img
          src={user.avatar}
          alt={`${user.firstName} ${user.lastName}`}
          className="h-[72px] w-[72px] rounded-2xl object-cover"
          onError={() => setImageFailed(true)}
        />
      )}

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h2 className="truncate text-lg font-semibold tracking-tight">
            {user.firstName} {user.lastName}
          </h2>
          <span className="shrink-0 rounded-full bg-paper px-2.5 py-1 text-xs font-medium text-muted">
            {user.age}
          </span>
        </div>

        <p className="mt-1 text-sm text-muted">{user.nationality}</p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {visibleHobbies.length === 0 ? (
            <span className="text-sm text-muted">No hobbies listed</span>
          ) : (
            visibleHobbies.map((hobby) => (
              <span
                key={hobby}
                className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent"
              >
                {hobby}
              </span>
            ))
          )}
          {remaining > 0 && (
            <span className="text-xs font-semibold text-muted">+{remaining}</span>
          )}
        </div>
      </div>
    </article>
  );
}
