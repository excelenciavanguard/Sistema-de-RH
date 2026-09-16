import * as React from "react";
import { cn } from "@/lib/utils";

type MenuToggleIconProps = React.ComponentProps<"svg"> & {
  open: boolean;
  duration?: number;
};

export function MenuToggleIcon({ open, duration = 300, className, ...props }: MenuToggleIconProps) {
  const shared = { transition: `transform ${duration}ms cubic-bezier(.2,.8,.2,1), opacity ${duration}ms ease` };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={cn("overflow-visible", className)} aria-hidden="true" {...props}>
      <path d="M4 7h16" style={{ ...shared, transformOrigin: "12px 7px", transform: open ? "translateY(5px) rotate(45deg)" : "none" }} />
      <path d="M4 12h16" style={{ ...shared, opacity: open ? 0 : 1, transform: open ? "scaleX(.3)" : "none" }} />
      <path d="M4 17h16" style={{ ...shared, transformOrigin: "12px 17px", transform: open ? "translateY(-5px) rotate(-45deg)" : "none" }} />
    </svg>
  );
}
