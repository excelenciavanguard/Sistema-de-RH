'use client';

import * as React from 'react';
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

  React.useEffect(() => setOpenMenu(null), [route]);

  React.useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenu(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
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
                onMouseEnter={() => setOpenMenu(navItem.label)}
                onMouseLeave={() => setOpenMenu(null)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpenMenu(null);
                }}
              >
                <button
                  type="button"
                  className={cn(
                    'alpha-dropdown-trigger relative flex h-10 cursor-pointer items-center justify-center gap-2 overflow-hidden border border-transparent px-3 text-[14px] font-semibold text-[#163832] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#235347]/30',
                    active && 'is-active',
                    open && 'is-open',
                  )}
                  aria-expanded={open}
                  aria-haspopup="menu"
                  aria-controls={`alpha-menu-${navItem.id}`}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setOpenMenu(navItem.label)}
                  onFocus={() => setOpenMenu(navItem.label)}
                >
                  {NavIcon ? <NavIcon className="relative z-10 size-[17px]" aria-hidden="true" /> : null}
                  <span className="relative z-10">{navItem.label}</span>
                  <ChevronDown className={cn('relative z-10 size-[14px] transition-transform duration-200', open && 'rotate-180')} aria-hidden="true" />
                </button>

                  {open ? (
                    <div className="alpha-dropdown-flyout absolute left-0 top-full">
                      <div
                        id={`alpha-menu-${navItem.id}`}
                        role="menu"
                        className={cn('alpha-dropdown-panel', navItem.subMenus.length > 1 ? 'is-multi' : 'is-single')}
                      >
                        <div className="alpha-dropdown-summary">
                          <h2>{navItem.label}</h2>
                          <p>{navItem.description}</p>
                        </div>
                        <div className="alpha-dropdown-groups">
                          {navItem.subMenus.map((subMenu) => (
                            <section key={subMenu.title} className="alpha-dropdown-group">
                              <h3>{subMenu.title}</h3>
                              <ul>
                                {subMenu.items.map((item) => {
                                  const Icon = item.icon;
                                  const itemActive = item.active?.(route) ?? false;
                                  return (
                                    <li key={item.label}>
                                      <a href={item.href} role="menuitem" onClick={() => setOpenMenu(null)} className={cn('alpha-dropdown-link group', itemActive && 'is-active')} aria-current={itemActive ? 'page' : undefined}>
                                        <span className="alpha-dropdown-icon">
                                          <Icon aria-hidden="true" />
                                        </span>
                                        <span className="alpha-dropdown-copy">
                                          <strong>{item.label}</strong>
                                          <small>{item.description}</small>
                                        </span>
                                      </a>
                                    </li>
                                  );
                                })}
                              </ul>
                            </section>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
              </li>
            );
          })}
        </ul>
      </nav>
  );
}
