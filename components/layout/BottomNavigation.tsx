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
      className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-md border-t bg-background"
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
                  "flex h-full flex-col items-center justify-center gap-1 text-xs text-muted-foreground transition-colors",
                  isActive && "font-medium text-primary",
                )}
              >
                <item.icon className="size-5" />
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
