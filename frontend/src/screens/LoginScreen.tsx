import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react';
import './login.css';

type LoginScreenProps = { onEnter: () => void };

export function LoginScreen({ onEnter }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [help, setHelp] = useState(false);
  const [error, setError] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!String(data.get('username') ?? '').trim() || !String(data.get('password') ?? '').trim()) {
      setError('Preencha seu usuário e sua senha para continuar.');
      return;
    }
    // Frontend demonstration only: no credential verification or password persistence.
    event.currentTarget.reset();
    onEnter();
  }

  return (
    <main className="login-screen">
      <div className="login-story">
        <img className="login-logo" src="/assets/Logo%20Rh.png" alt="Alpha RH" />
        <div className="login-story-copy">
          <h1>Pessoas no centro.<br />Gestão com propósito.</h1>
          <span className="login-story-rule" aria-hidden="true" />
          <p>Equipes mais fortes <br />constroem <br />amanhãs melhores.</p>
        </div>
      </div>
      <section className="login-panel" aria-labelledby="login-title">
        <h2 id="login-title">Acesse sua conta</h2>
        <p className="login-subtitle">Entre para acessar o Alpha RH.</p>
        <form onSubmit={submit} noValidate>
          <div className="login-field">
            <label htmlFor="login-username">Usuário</label>
            <div className="login-input-wrap">
              <UserRound aria-hidden="true" />
              <input id="login-username" name="username" type="text" autoComplete="username" placeholder="Digite seu usuário" required aria-describedby={error ? 'login-error' : undefined} onChange={() => setError('')} />
            </div>
          </div>
          <div className="login-field">
            <label htmlFor="login-password">Senha</label>
            <div className="login-input-wrap">
              <LockKeyhole aria-hidden="true" />
              <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="••••••••••" required aria-describedby={error ? 'login-error' : undefined} onChange={() => setError('')} />
              <button className="login-password-toggle" type="button" aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              </button>
            </div>
          </div>
          <div className="login-options">
            <label className="login-remember"><input name="remember" type="checkbox" />Manter conectado</label>
            <button className="login-help-link" type="button" aria-expanded={help} aria-controls="login-help" onClick={() => setHelp(!help)}>Esqueci minha senha</button>
          </div>
          {error && <p className="login-error" id="login-error" role="alert">{error}</p>}
          {help && <p className="login-help" id="login-help" role="status">Fale com o administrador para recuperar seu acesso. A recuperação de senha ainda não está disponível no protótipo.</p>}
          <button className="login-submit" type="submit">Entrar</button>
        </form>
        <p className="login-access-help">Precisa de acesso? Fale com o administrador.</p>
        <p className="login-prototype-note">Protótipo visual · autenticação ainda não conectada.</p>
      </section>
    </main>
  );
}
