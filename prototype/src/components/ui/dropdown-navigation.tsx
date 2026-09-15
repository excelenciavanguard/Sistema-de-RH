'use client';

import * as React from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { ChevronDown, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DropdownNavigationLink = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  active?: (route: string) => boolean;
};

export type DropdownNavigationItem = {
  id: number;
  label: string;
  description: string;
  icon?: LucideIcon;
  subMenus: Array<{
    title: string;
    items: DropdownNavigationLink[];
  }>;
  active?: (route: string) => boolean;
};

type DropdownNavigationProps = {
  navItems: DropdownNavigationItem[];
  route: string;
  className?: string;
};

export function DropdownNavigation({ navItems, route, className }: DropdownNavigationProps) {
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);
  const [hoveredMenu, setHoveredMenu] = React.useState<string | null>(null);

  React.useEffect(() => setOpenMenu(null), [route]);

  React.useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenu(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}>
      <nav className={cn('relative', className)} aria-label="Navegação principal">
        <ul className="m-0 flex list-none items-center gap-0.5 p-0">
          {navItems.map((navItem) => {
            const open = openMenu === navItem.label;
            const active = navItem.active?.(route) ?? false;
            const NavIcon = navItem.icon;
            return (
              <li
                key={navItem.id}
                className="relative"
                onMouseEnter={() => { setHoveredMenu(navItem.label); setOpenMenu(navItem.label); }}
                onMouseLeave={() => { setHoveredMenu(null); setOpenMenu(null); }}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpenMenu(null);
                }}
              >
                <button
                  type="button"
                  className={cn(
                    'alpha-dropdown-trigger relative flex h-full cursor-pointer items-center justify-center gap-1.5 overflow-hidden border-x-0 border-t-0 border-b-2 border-transparent px-3 text-[12px] font-bold text-[#163832] outline-none transition-colors hover:bg-[#EDF6EF] hover:text-[#235347] focus-visible:ring-2 focus-visible:ring-[#235347]/30',
                    active && !open && 'bg-[#EDF6EF] text-[#235347]',
                    open && 'is-open border-[#DFF3E4] bg-white text-[#235347] shadow-[0_7px_18px_rgba(25,62,96,.10)]',
                  )}
                  aria-expanded={open}
                  aria-haspopup="menu"
                  aria-controls={`alpha-menu-${navItem.id}`}
                  onClick={() => setOpenMenu(navItem.label)}
                  onFocus={() => setOpenMenu(navItem.label)}
                >
                  {(hoveredMenu === navItem.label || active) && !open ? (
                    <motion.span layoutId="alpha-nav-hover" className="absolute inset-0 rounded-xl bg-[#EDF6EF]" aria-hidden="true" />
                  ) : null}
                  {NavIcon ? <NavIcon className="relative z-10 size-[15px]" aria-hidden="true" /> : null}
                  <span className="relative z-10">{navItem.label}</span>
                  <ChevronDown className={cn('relative z-10 size-3.5 transition-transform duration-200', open && 'rotate-180')} aria-hidden="true" />
                </button>

                <AnimatePresence>
                  {open ? (
                    <div className="absolute left-0 top-full pt-2">
                      <motion.div
                        id={`alpha-menu-${navItem.id}`}
                        role="menu"
                        initial={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -4, filter: 'blur(3px)' }}
                        className="w-max max-w-[720px] overflow-hidden rounded-2xl border border-[#DFF3E4] bg-white p-3 text-[#0B2B26] shadow-[0_22px_55px_rgba(5,34,62,.2)]"
                      >
                        <div className="mb-2 rounded-xl bg-[#EDF6EF] px-4 py-3">
                          <h2 className="m-0 text-[15px] font-extrabold tracking-[-0.025em]">{navItem.label}</h2>
                          <p className="mt-1 max-w-[520px] text-[10px] leading-4 text-[#235347]">{navItem.description}</p>
                        </div>
                        <div className="flex gap-2">
                          {navItem.subMenus.map((subMenu) => (
                            <section key={subMenu.title} className="min-w-[250px] flex-1 px-1 py-2">
                              <h3 className="mb-2 px-2 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#235347]">{subMenu.title}</h3>
                              <ul className="m-0 grid list-none gap-1 p-0">
                                {subMenu.items.map((item) => {
                                  const Icon = item.icon;
                                  const itemActive = item.active?.(route) ?? false;
                                  return (
                                    <li key={item.label}>
                                      <a href={item.href} role="menuitem" onClick={() => setOpenMenu(null)} className={cn('group flex min-h-[62px] items-center gap-3 rounded-xl px-2.5 py-2 outline-none transition-colors hover:bg-[#EDF6EF] focus:bg-[#EDF6EF]', itemActive && 'bg-[#EDF6EF]')} aria-current={itemActive ? 'page' : undefined}>
                                        <span className={cn('grid size-9 shrink-0 place-items-center rounded-lg border border-[#DFF3E4] bg-white text-[#235347] shadow-[0_4px_10px_rgba(22,62,96,.06)] transition-transform duration-200 group-hover:-translate-y-0.5', itemActive && 'border-[#DFF3E4] bg-[#DFF3E4] text-[#163832]')}>
                                          <Icon className="size-[17px]" />
                                        </span>
                                        <span className="flex min-w-0 flex-col">
                                          <strong className="text-[11px] font-extrabold text-[#0B2B26]">{item.label}</strong>
                                          <small className="mt-0.5 text-[9px] leading-4 text-[#235347]">{item.description}</small>
                                        </span>
                                      </a>
                                    </li>
                                  );
                                })}
                              </ul>
                            </section>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </nav>
    </MotionConfig>
  );
}
