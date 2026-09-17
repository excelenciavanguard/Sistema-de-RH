import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { BriefcaseBusiness } from 'lucide-react';
import { DropdownNavigation } from './dropdown-navigation';

afterEach(cleanup);

const navItems = [{
  id: 1,
  label: 'Recrutamento',
  description: 'Processo seletivo',
  subMenus: [{ title: 'Seleção', items: [{
    label: 'Vagas e Kanban', description: 'Abrir vagas', href: '#/recrutamento/vagas', icon: BriefcaseBusiness,
  }] }],
}];

describe('dropdown pointer path regression', () => {
  it('keeps the panel connected to the trigger with hoverable padding at every desktop height', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/styles.css'), 'utf8');
    expect(css).toMatch(/\.alpha-dropdown-flyout\s*\{\s*top:\s*100%;\s*padding-top:\s*20px;/);
    expect(css).not.toMatch(/\.alpha-dropdown-flyout\s*\{[^}]*top:\s*calc\(100%\s*\+/);
    expect(css).toMatch(/\.alpha-dropdown-flyout\s*\{\s*padding-top:\s*16px;/);
  });

  it('allows moving from the trigger through the flyout to a destination', () => {
    render(<DropdownNavigation navItems={navItems} route="/inicio" />);
    const trigger = screen.getByRole('button', { name: 'Recrutamento' });
    fireEvent.mouseEnter(trigger);
    const item = screen.getByRole('menuitem');
    fireEvent.mouseOut(trigger, { relatedTarget: item.parentElement?.closest('.alpha-dropdown-flyout') });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(item).toHaveAttribute('href', '#/recrutamento/vagas');
    fireEvent.click(item);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
