// components/core/breadcrumb/CustomBreadcrumbs.tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CustomBreadcrumbsProps } from "./types/breadcrums-type";

export function CustomBreadcrumbs({
  links,
  action,
  heading,
  moreLink,
  activeLast = true,
  className = "", // Default empty string di hai taaki undefined naa ho
  headingClassName = "",
  breadcrumbsClassName = "",
  actionClassName = "",
  moreLinkClassName = "",
}: CustomBreadcrumbsProps) {
  return (
    // 1. Simple string interpolation
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center">
        <div className="grow">
          {heading && (
            <h1 className={`text-2xl font-semibold mb-2 ${headingClassName}`}>
              {heading}
            </h1>
          )}

          {links.length > 0 && (
            <nav
              className={`flex items-center space-x-2 ${breadcrumbsClassName}`}
            >
              {links.map((link, index) => {
                const isLast = index === links.length - 1;
                const isDisabled = isLast && activeLast;

                // 2. Conditional classes ke liye variable bana liya
                const linkColorClass = isLast
                  ? "text-foreground"
                  : "text-muted-foreground";

                return (
                  <div key={link.name} className="flex items-center">
                    {link.href && !isDisabled ? (
                      <Link
                        href={link.href}
                        className={`font-medium transition-colors hover:text-primary ${linkColorClass}`}
                      >
                        {link.icon && <span className="mr-1">{link.icon}</span>}
                        {link.name}
                      </Link>
                    ) : (
                      <span className={`font-medium ${linkColorClass}`}>
                        {link.icon && <span className="mr-1">{link.icon}</span>}
                        {link.name}
                      </span>
                    )}
                    {!isLast && (
                      <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                );
              })}
            </nav>
          )}
        </div>

        {action && (
          <div className={`shrink-0 ${actionClassName}`}>{action}</div>
        )}
      </div>

      {moreLink && moreLink.length > 0 && (
        <div className={`flex flex-wrap gap-2 ${moreLinkClassName}`}>
          {moreLink.map((href) => (
            <Link
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary"
            >
              {href}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
