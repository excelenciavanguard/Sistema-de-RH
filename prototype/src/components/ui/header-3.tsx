'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronDown,
  FileCheck2,
  GitPullRequestCreateArrow,
  Home,
  LayoutDashboard,
  Link2,
  Search,
  Settings2,
  UserRoundCheck,
  UsersRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownNavigation, type DropdownNavigationItem } from '@/components/ui/dropdown-navigation';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { cn } from '@/lib/utils';

type HeaderProps = { route: string };

export function Header({ route }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const scrolled = useScroll(8);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  React.useEffect(() => setMobileOpen(false), [route]);

  return (
    <header className={cn('alpha-app-header sticky top-0 z-50 w-full', scrolled && 'is-scrolled')}>
      <div className="alpha-header-bar">
        <div className="mx-auto flex h-[68px] w-full max-w-[1820px] items-stretch gap-5 px-5 lg:px-8">
          <a href="#/inicio" className="alpha-wordmark group flex shrink-0 items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-[#1677e8]/35" aria-label="Ir para o Início">
            <AlphaMark className="h-10 w-9" />
            <span className="hidden min-w-max flex-col sm:flex">
              <strong>Alpha RH</strong>
              <small>Pessoas impulsionam resultados</small>
            </span>
          </a>

          <a href="#/inicio" className={cn('alpha-home-link hidden items-center gap-2 px-4 text-[12px] font-extrabold outline-none lg:flex', route === '/inicio' && 'is-active')} aria-label="Hoje no RH" aria-current={route === '/inicio' ? 'page' : undefined}>
            <Home className="size-[17px]" />
            <span>Hoje no RH</span>
          </a>

          <DropdownNavigation navItems={menuGroups} route={route} className="alpha-desktop-nav flex-none" />

          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <label className="alpha-header-search h-10 w-[320px] items-center gap-2 rounded-lg border border-[#d7e1ec] bg-white px-3 text-[#61758c] transition-colors focus-within:border-[#83b5e7] focus-within:ring-2 focus-within:ring-[#1677e8]/10">
              <Search className="size-4 shrink-0" />
              <input type="search" aria-label="Buscar no Alpha RH" placeholder="Buscar pessoas, vagas ou menus" className="min-w-0 flex-1 bg-transparent text-[11px] text-[#213d5c] outline-none placeholder:text-[#8b9bad]" />
              <kbd className="rounded border border-[#d8e2ed] bg-white px-1.5 py-0.5 text-[9px] font-semibold text-[#74869b]">⌘ K</kbd>
            </label>

            <button type="button" className="alpha-utility-action relative" aria-label="Abrir notificações">
              <Bell className="size-[18px]" />
              <span className="absolute right-[8px] top-[7px] size-2 rounded-full bg-[#f4a51c] ring-2 ring-white" aria-hidden="true" />
            </button>
            <span className="hidden h-8 w-px bg-[#dce5ef] xl:block" aria-hidden="true" />
            <button className="alpha-profile-button ml-0.5 flex h-12 items-center gap-2.5 border-0 bg-transparent px-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#1677e8]/30" type="button" aria-label="Abrir perfil de Lucas">
              <span className="grid size-9 place-items-center rounded-full bg-[#0c2e61] text-[11px] font-extrabold text-white">LS</span>
              <span className="hidden flex-col 2xl:flex"><strong>Lucas</strong><small>RH Global</small></span>
              <ChevronDown className="hidden size-3.5 text-[#526984] 2xl:block" />
            </button>
            <Button size="icon" variant="outline" onClick={() => setMobileOpen((current) => !current)} className="alpha-mobile-toggle size-10 rounded-xl border-[#d8e2ed] bg-white text-[#234968] hover:bg-[#f1f6fb]" aria-expanded={mobileOpen} aria-controls="mobile-navigation" aria-label="Alternar menu">
              <MenuToggleIcon open={mobileOpen} className="size-5" />
            </Button>
          </div>
        </div>
      </div>
      <MobileMenu open={mobileOpen} route={route} />
    </header>
  );
}

function MobileMenu({ open, route }: { open: boolean; route: string }) {
  if (!open || typeof window === 'undefined') return null;
  return createPortal(
    <div id="mobile-navigation" className="fixed inset-x-0 bottom-0 top-[68px] z-40 overflow-y-auto bg-[#f5f8fc] p-4 lg:hidden">
      <label className="flex h-11 items-center gap-2 rounded-xl border border-[#dce6f0] bg-white px-3 text-[#60738a] shadow-sm">
        <Search className="size-4" />
        <input type="search" aria-label="Buscar no menu móvel" placeholder="Buscar pessoas, vagas ou processos" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
      </label>
      <a href="#/inicio" className={cn('mt-3 flex items-center gap-3 rounded-xl bg-white p-3 text-sm font-bold text-[#173754] shadow-sm', route === '/inicio' && 'ring-2 ring-[#2b78bd]/20')}>
        <span className="grid size-9 place-items-center rounded-lg bg-[#edf5ff] text-[#1665ac]"><Home className="size-[17px]" /></span>Início
      </a>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {menuGroups.map((group) => (
          <section key={group.label} className="rounded-2xl border border-[#e1e8f0] bg-white p-3 shadow-[0_8px_24px_rgba(20,54,84,.06)]">
            <div className="px-1 pb-2">
              <h2 className="mt-1 text-sm font-extrabold text-[#173754]">{group.label}</h2>
              <p className="mt-1 text-[9px] leading-4 text-[#718197]">{group.description}</p>
            </div>
            <div className="grid gap-1">
              {group.subMenus.flatMap((subMenu) => subMenu.items).map((item) => {
                const Icon = item.icon;
                const active = item.active?.(route) ?? false;
                return <a key={item.label} href={item.href} className={cn('flex items-center gap-2.5 rounded-xl p-2.5 text-xs font-bold text-[#294966]', active ? 'bg-[#edf5ff] text-[#0e61aa]' : 'hover:bg-[#f4f7fb]')}><span className="grid size-8 place-items-center rounded-lg bg-[#edf3f9] text-[#2b73b2]"><Icon className="size-4" /></span>{item.label}</a>;
              })}
            </div>
          </section>
        ))}
      </div>
    </div>,
    document.body,
  );
}

const menuGroups: DropdownNavigationItem[] = [
  {
    id: 1,
    label: 'Recrutamento',
    icon: BriefcaseBusiness,
    description: 'Da solicitação de pessoal à condução dos candidatos no processo seletivo.',
    active: (route) => route.startsWith('/recrutamento'),
    subMenus: [
      {
        title: 'Abertura da vaga',
        items: [
          { label: 'Requisições', href: '#/recrutamento/requisicoes', description: 'Operações solicita a abertura da vaga', icon: GitPullRequestCreateArrow, active: (route) => route.startsWith('/recrutamento/requisicoes') },
          { label: 'Aprovações', href: '#/recrutamento/aprovacoes', description: 'Diretoria analisa e registra a decisão', icon: FileCheck2, active: (route) => route === '/recrutamento/aprovacoes' },
        ],
      },
      {
        title: 'Seleção',
        items: [
          { label: 'Vagas e Kanban', href: '#/recrutamento/vagas', description: 'RH cria vagas e conduz os candidatos', icon: BriefcaseBusiness, active: (route) => route.startsWith('/recrutamento/vagas') && !route.endsWith('/kanban') },
          { label: 'Visão do processo', href: '#/recrutamento/vagas/2026-0157/kanban', description: 'Acesse o processo seletivo em andamento', icon: LayoutDashboard, active: (route) => route.endsWith('/kanban') },
        ],
      },
    ],
  },
  {
    id: 2,
    label: 'Talentos e Pessoas',
    icon: UsersRound,
    description: 'Histórico dos candidatos e continuidade de quem avança para a empresa.',
    active: (route) => route === '/talentos' || route === '/admissao',
    subMenus: [
      {
        title: 'Pessoas',
        items: [
          { label: 'Banco de talentos', href: '#/talentos', description: 'Candidatos classificados e arquivados', icon: UsersRound, active: (route) => route === '/talentos' },
          { label: 'Admissão', href: '#/admissao', description: 'Documentos e preparação da contratação', icon: UserRoundCheck, active: (route) => route === '/admissao' },
        ],
      },
    ],
  },
  {
    id: 3,
    label: 'Jornada',
    icon: CalendarDays,
    description: 'Entrevistas, tarefas, compromissos e próximos passos da equipe de RH.',
    active: (route) => route === '/agenda',
    subMenus: [
      {
        title: 'Organização',
        items: [
          { label: 'Agenda da equipe', href: '#/agenda', description: 'Entrevistas, contatos e compromissos', icon: CalendarDays, active: (route) => route === '/agenda' },
        ],
      },
    ],
  },
  {
    id: 4,
    label: 'Gestão',
    icon: ChartNoAxesCombined,
    description: 'Indicadores, canais integrados e configurações que sustentam o Alpha RH.',
    active: (route) => ['/relatorios', '/integracoes', '/administracao'].includes(route),
    subMenus: [
      {
        title: 'Análise',
        items: [
          { label: 'Relatórios', href: '#/relatorios', description: 'Indicadores do recrutamento e prazos', icon: ChartNoAxesCombined, active: (route) => route === '/relatorios' },
        ],
      },
      {
        title: 'Configuração',
        items: [
          { label: 'Integrações', href: '#/integracoes', description: 'Canais de entrada e serviços conectados', icon: Link2, active: (route) => route === '/integracoes' },
          { label: 'Administração', href: '#/administracao', description: 'Permissões e parâmetros do sistema', icon: Settings2, active: (route) => route === '/administracao' },
        ],
      },
    ],
  },
];

function useScroll(threshold: number) {
  const [scrolled, setScrolled] = React.useState(false);
  const onScroll = React.useCallback(() => setScrolled(window.scrollY > threshold), [threshold]);
  React.useEffect(() => { window.addEventListener('scroll', onScroll); return () => window.removeEventListener('scroll', onScroll); }, [onScroll]);
  React.useEffect(() => onScroll(), [onScroll]);
  return scrolled;
}

const AlphaMark = (props: React.ComponentProps<'svg'>) => (
  <svg viewBox="0 0 42 46" fill="none" aria-hidden="true" {...props}>
    <path d="M21 2 40 43H29.8L20.7 22.6 11.5 43H1L21 2Z" fill="#0878CF" />
    <path d="M21 2 40 43 24.7 29.4 20.7 22.6 11.5 43H1L21 2Z" fill="#19A6D8" opacity=".72" />
    <path d="m9.4 31.7 11.3-9.1 5.1 11.5-16.4-2.4Z" fill="white" />
  </svg>
);
