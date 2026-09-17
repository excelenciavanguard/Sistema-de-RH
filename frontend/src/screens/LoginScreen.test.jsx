import '@testing-library/jest-dom/vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LoginScreen } from './LoginScreen';
import { ROUTES, routeFromHash } from '../navigation';

afterEach(cleanup);

describe('Login frontend preview', () => {
  it('opens login at the root and keeps internal preview links working', () => {
    expect(routeFromHash('')).toBe(ROUTES.login);
    expect(routeFromHash('#/login')).toBe(ROUTES.login);
    expect(routeFromHash('#/inicio')).toBe(ROUTES.home);
  });
  it('uses username, validates blank fields and enters without persisting credentials', () => {
    const onEnter = vi.fn();
    render(<LoginScreen onEnter={onEnter} />);
    expect(screen.queryByLabelText(/e-mail/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Preencha seu usuário');
    expect(onEnter).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText('Usuário'), { target: { value: 'ramon' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'senha-ilustrativa' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(onEnter).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('Senha')).toHaveValue('');
  });
  it('toggles password visibility and explains access recovery', () => {
    render(<LoginScreen onEnter={vi.fn()} />);
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password');
    fireEvent.click(screen.getByRole('button', { name: 'Mostrar senha' }));
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'text');
    fireEvent.click(screen.getByRole('button', { name: 'Ocultar senha' }));
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password');
    fireEvent.click(screen.getByRole('button', { name: 'Esqueci minha senha' }));
    expect(screen.getByRole('status')).toHaveTextContent('Fale com o administrador');
  });
});
