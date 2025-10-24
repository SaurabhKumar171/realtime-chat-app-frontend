import { cn } from "@/lib/utils";

type UserListProps = {
  users: string[];
  me: string;
  showUsers: boolean;
  className?: string;
};

export function UserList({ users, me, showUsers, className }: UserListProps) {
  return (
    <aside
      className={cn(
        "h-full w-64 shrink-0 border-r border-white/10 bg-black/20 backdrop-blur-sm transition-all duration-200 ease-in-out",
        // Desktop: always visible
        "hidden md:flex flex-col",
        // Mobile: visible only when toggled
        showUsers && "flex fixed inset-0 z-50 md:relative md:z-auto",
        className
      )}
    >
      <div className="px-4 py-3 text-xs uppercase tracking-wide text-muted-foreground/80 border-b border-white/10">
        Online Users
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {users.length === 0 && (
          <div className="text-sm text-muted-foreground/70">
            No users online
          </div>
        )}
        {users.length > 0 &&
          users.map((u) => (
            <div
              key={u}
              className={cn(
                "group flex items-center gap-3 rounded-md px-2 py-2",
                "hover:bg-white/5 transition-colors"
              )}
            >
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  u === me ? "bg-emerald-400" : "bg-blue-400"
                )}
              />
              <div className="text-sm truncate">
                <span className={cn(u === me && "font-semibold")}>{u}</span>
                {u === me && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    (you)
                  </span>
                )}
              </div>
            </div>
          ))}
      </div>
      <div className="p-3 text-xs text-muted-foreground/70 border-t border-white/10">
        Use
        <code className="mx-1 rounded bg-white/5 px-1.5 py-0.5">
          /dm &lt;user&gt; &lt;message&gt;
        </code>
        for private messages
      </div>
    </aside>
  );
}
