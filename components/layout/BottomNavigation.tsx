import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./navigation";

type BottomNavigationProps = {
  activeHref: string | null;
};

export function BottomNavigation({ activeHref }: BottomNavigationProps) {
  return (
    <nav
      aria-label="Navigasi utama"
      className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md rounded-t-2xl bg-card pb-[env(safe-area-inset-bottom)] shadow-bar"
    >
      <ul className="grid h-16 grid-cols-4">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === activeHref;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-0.5 text-[13px] font-medium text-muted-foreground transition-colors",
                  isActive && "font-semibold text-primary",
                )}
              >
                {/* Pill di belakang ikon menandai menu yang sedang dibuka. */}
                <span
                  className={cn(
                    "flex h-8 w-14 items-center justify-center rounded-full transition-colors",
                    isActive && "bg-primary/10",
                  )}
                >
                  <item.icon className="size-6" />
                </span>
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
