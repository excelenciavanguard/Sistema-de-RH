# Alpha RH Foundation and Access Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar o protótipo existente em uma base interna autenticada, autorizada e auditável sem alterar o banco do Weboper.

**Architecture:** Manter o monólito modular FastAPI e o SPA React existentes. A autenticação usará senha com Argon2 e sessões opacas armazenadas no MySQL próprio; o navegador receberá apenas cookie `HttpOnly`, e mutações exigirão token CSRF. As permissões serão verificadas no backend por função e refletidas no frontend apenas para navegação.

**Tech Stack:** Python 3.12, FastAPI, SQLAlchemy 2, Alembic, MySQL, Pydantic Settings, Argon2, Pytest, React 19, Vite 6, Vitest e Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-08-alpha-rh-master-spec.md`

**Situação em 14/09/2026:** execução adiada por decisão do responsável do projeto. A tela de login não será criada na primeira rodada de código. Este plano será retomado antes de usar currículos reais, dados pessoais ou liberar acesso pela rede.

## Global Constraints

- O Weboper permanece somente leitura e não participa das migrações do Alpha RH.
- Credenciais e chaves ficam somente no backend e nunca são retornadas por API.
- Diretoria acessa todos os dados e fluxos de negócio, mas não recebe valores brutos de senhas ou chaves de integração.
- Currículos e dados pessoais exigem usuário autenticado e função autorizada.
- Tokens de autenticação não são armazenados em `localStorage` ou `sessionStorage`.
- Eventos de auditoria não copiam currículo, senha, chave ou documento pessoal.
- A API mantém mensagens de autenticação genéricas para não revelar se um e-mail existe.
- O frontend permanece em português do Brasil.
- Migrações são aplicadas somente ao banco próprio do Alpha RH.

---

### Task 1: Padronizar a execução e a configuração de segurança

**Files:**
- Create: `backend/pytest.ini`
- Modify: `backend/requirements.txt`
- Modify: `backend/app/config.py`
- Modify: `backend/.env.example`
- Test: `backend/tests/test_config.py`

**Interfaces:**
- Consumes: variáveis existentes `DATABASE_URL`, `UPLOAD_DIR` e `CORS_ORIGINS`.
- Produces: `Settings.session_cookie_name`, `Settings.session_ttl_hours`, `Settings.session_cookie_secure` e `Settings.allowed_hosts`.

- [ ] **Step 1: Escrever testes de configuração**

```python
from app.config import Settings


def test_security_defaults_are_safe_for_local_development(tmp_path):
    settings = Settings(
        database_url="sqlite+pysqlite:///:memory:",
        upload_dir=tmp_path,
    )
    assert settings.session_cookie_name == "alpha_rh_session"
    assert settings.session_ttl_hours == 8
    assert settings.session_cookie_secure is False
    assert settings.allowed_host_list == ["localhost", "127.0.0.1"]


def test_production_requires_secure_cookie(tmp_path):
    try:
        Settings(
            app_env="production",
            database_url="mysql+pymysql://user:pass@db/alpha_rh",
            upload_dir=tmp_path,
            session_cookie_secure=False,
        )
    except ValueError as error:
        assert "SESSION_COOKIE_SECURE" in str(error)
    else:
        raise AssertionError("produção deve exigir cookie seguro")
```

- [ ] **Step 2: Executar o teste e confirmar a falha**

Run: `.\.venv\Scripts\python.exe -m pytest tests/test_config.py -q`

Expected: FAIL porque os campos de sessão e a validação de produção ainda não existem.

- [ ] **Step 3: Adicionar `argon2-cffi>=23.1,<26`, criar `backend/pytest.ini` com `pythonpath = .` e implementar os campos testados em `Settings`**

```ini
[pytest]
pythonpath = .
testpaths = tests
```

```python
session_cookie_name: str = "alpha_rh_session"
session_ttl_hours: int = 8
session_cookie_secure: bool = False
allowed_hosts: str = "localhost,127.0.0.1"

@property
def allowed_host_list(self) -> list[str]:
    return [item.strip() for item in self.allowed_hosts.split(",") if item.strip()]

@model_validator(mode="after")
def require_secure_production_cookie(self):
    if self.app_env == "production" and not self.session_cookie_secure:
        raise ValueError("SESSION_COOKIE_SECURE deve ser true em produção")
    return self
```

- [ ] **Step 4: Executar a suíte do backend**

Run: `.\.venv\Scripts\python.exe -m pytest -q`

Expected: os 21 testes existentes e os novos testes passam.

- [ ] **Step 5: Commit**

```bash
git add backend/pytest.ini backend/requirements.txt backend/app/config.py backend/.env.example backend/tests/test_config.py
git commit -m "chore: harden backend security settings"
```

### Task 2: Criar usuários, funções e sessões no banco próprio

**Files:**
- Modify: `backend/app/models.py`
- Create: `backend/alembic/versions/0004_users_and_sessions.py`
- Test: `backend/tests/test_auth_models.py`

**Interfaces:**
- Consumes: `Base`, `utcnow()` e `AuditEvent` existentes.
- Produces: `UserRole`, `User`, `UserSession` e `AuditEvent.actor_user_id`.

- [ ] **Step 1: Escrever o teste dos modelos**

```python
from datetime import timedelta
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

from app.db import Base
from app.models import User, UserRole, UserSession, utcnow


def test_user_and_session_are_persisted():
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(engine)
    with Session(engine) as db:
        user = User(email="diretoria@example.invalid", display_name="Diretoria", password_hash="hash", role=UserRole.director)
        session = UserSession(user=user, token_hash="a" * 64, csrf_hash="b" * 64, expires_at=utcnow() + timedelta(hours=8))
        db.add(session)
        db.commit()
        assert db.scalar(select(User).where(User.email == user.email)).role == UserRole.director
        assert db.scalar(select(UserSession).where(UserSession.user_id == user.id)) is not None
```

- [ ] **Step 2: Executar o teste e confirmar a falha**

Run: `.\.venv\Scripts\python.exe -m pytest tests/test_auth_models.py -q`

Expected: FAIL porque os modelos ainda não existem.

- [ ] **Step 3: Implementar os modelos e a migração**

Definir funções exatas `operations`, `director`, `hr`, `dp` e `admin`. `users.email` será único; `user_sessions.token_hash` será único; sessões terão `created_at`, `last_seen_at`, `expires_at` e `revoked_at`. Adicionar `actor_user_id` anulável a `audit_events`, com chave estrangeira para `users.id`.

- [ ] **Step 4: Testar modelos e migrações**

Run: `.\.venv\Scripts\python.exe -m pytest tests/test_auth_models.py -q`

Expected: PASS.

Run: `.\.venv\Scripts\alembic.exe upgrade head`

Expected: banco próprio atualizado até `0004_users_and_sessions`.

- [ ] **Step 5: Commit**

```bash
git add backend/app/models.py backend/alembic/versions/0004_users_and_sessions.py backend/tests/test_auth_models.py
git commit -m "feat: add users roles and sessions"
```

### Task 3: Implementar senhas Argon2 e sessões opacas

**Files:**
- Create: `backend/app/services/auth.py`
- Test: `backend/tests/test_auth_service.py`

**Interfaces:**
- Produces: `hash_password(password: str) -> str`, `verify_password(password: str, password_hash: str) -> bool`, `create_session(db: Session, user: User, ttl_hours: int) -> SessionCredentials`, `authenticate_session(db: Session, raw_token: str) -> User | None` e `revoke_session(db: Session, raw_token: str) -> None`.
- `SessionCredentials` contém `raw_token: str`, `csrf_token: str` e `expires_at: datetime`; somente os hashes SHA-256 são persistidos.

- [ ] **Step 1: Escrever testes para hash, sessão e expiração**

```python
def test_password_hash_does_not_contain_plaintext():
    encoded = hash_password("senha-segura-de-teste")
    assert "senha-segura-de-teste" not in encoded
    assert verify_password("senha-segura-de-teste", encoded) is True
    assert verify_password("senha-incorreta", encoded) is False


def test_session_stores_only_token_hash(db, active_hr_user):
    credentials = create_session(db, active_hr_user, ttl_hours=8)
    stored = db.scalar(select(UserSession))
    assert credentials.raw_token not in stored.token_hash
    assert len(stored.token_hash) == 64
    assert authenticate_session(db, credentials.raw_token).id == active_hr_user.id
```

- [ ] **Step 2: Executar os testes e confirmar a falha**

Run: `.\.venv\Scripts\python.exe -m pytest tests/test_auth_service.py -q`

Expected: FAIL porque o serviço ainda não existe.

- [ ] **Step 3: Implementar o serviço**

Usar `argon2.PasswordHasher` para senhas, `secrets.token_urlsafe(32)` para token e CSRF, e `hashlib.sha256` antes de qualquer persistência ou busca. Sessão expirada, revogada ou de usuário inativo retorna `None`.

- [ ] **Step 4: Executar os testes do serviço**

Run: `.\.venv\Scripts\python.exe -m pytest tests/test_auth_service.py -q`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/app/services/auth.py backend/tests/test_auth_service.py
git commit -m "feat: add secure authentication service"
```

### Task 4: Expor login, sessão atual e logout

**Files:**
- Create: `backend/app/api/routes/auth.py`
- Modify: `backend/app/api/router.py`
- Modify: `backend/app/schemas.py`
- Test: `backend/tests/test_auth_routes.py`

**Interfaces:**
- Produces: `POST /api/v1/auth/login`, `GET /api/v1/auth/me` e `POST /api/v1/auth/logout`.
- O login recebe `{ "email": str, "password": str }`, define o cookie configurado e retorna `{ "user": AuthUserOut, "csrfToken": str }`.
- `/auth/me` renova `last_seen_at` e retorna usuário e token CSRF; logout revoga a sessão e apaga o cookie.

- [ ] **Step 1: Escrever testes das três rotas**

```python
def test_login_sets_http_only_cookie(client, active_hr_user):
    response = client.post("/api/v1/auth/login", json={"email": active_hr_user.email, "password": "senha-segura-de-teste"})
    assert response.status_code == 200
    assert "HttpOnly" in response.headers["set-cookie"]
    assert response.json()["user"]["role"] == "hr"
    assert response.json()["csrfToken"]


def test_invalid_login_is_generic(client):
    response = client.post("/api/v1/auth/login", json={"email": "missing@example.invalid", "password": "incorreta"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Credenciais inválidas."
```

- [ ] **Step 2: Executar os testes e confirmar a falha**

Run: `.\.venv\Scripts\python.exe -m pytest tests/test_auth_routes.py -q`

Expected: FAIL com rota não encontrada.

- [ ] **Step 3: Implementar schemas e rotas**

Definir cookie com `httponly=True`, `samesite="lax"`, `secure=settings.session_cookie_secure`, `path="/"` e `max_age=settings.session_ttl_hours * 3600`. Registrar `login_succeeded`, `login_failed` e `logout` em `audit_events` sem senha ou token.

- [ ] **Step 4: Executar os testes de rota e a suíte completa**

Run: `.\.venv\Scripts\python.exe -m pytest tests/test_auth_routes.py -q`

Expected: PASS.

Run: `.\.venv\Scripts\python.exe -m pytest -q`

Expected: todos os testes passam.

- [ ] **Step 5: Commit**

```bash
git add backend/app/api/routes/auth.py backend/app/api/router.py backend/app/schemas.py backend/tests/test_auth_routes.py
git commit -m "feat: expose secure session endpoints"
```

### Task 5: Aplicar autorização por função e proteção CSRF

**Files:**
- Create: `backend/app/api/dependencies.py`
- Modify: `backend/app/api/routes/candidates.py`
- Modify: `backend/app/api/routes/extractions.py`
- Modify: `backend/app/main.py`
- Test: `backend/tests/test_authorization.py`

**Interfaces:**
- Produces: `get_current_user`, `require_roles(*roles)` e `require_csrf` como dependências FastAPI.
- Diretoria lê todos os fluxos de negócio. RH e admin operam candidatos e extrações. Operações e DP recebem `403` nessas mutações.

- [ ] **Step 1: Escrever testes de autenticação, função e CSRF**

```python
def test_anonymous_candidate_access_is_rejected(client):
    response = client.get("/api/v1/vacancies/2026-0157/candidates")
    assert response.status_code == 401


def test_operations_cannot_start_extraction(operations_client, resume_file):
    response = operations_client.post("/api/v1/extractions", files={"file": resume_file})
    assert response.status_code == 403


def test_mutation_without_csrf_is_rejected(hr_client):
    response = hr_client.patch("/api/v1/applications/example/stage", json={"stage": "screening"})
    assert response.status_code == 403
    assert response.json()["detail"] == "Token CSRF inválido."
```

- [ ] **Step 2: Executar os testes e confirmar a falha**

Run: `.\.venv\Scripts\python.exe -m pytest tests/test_authorization.py -q`

Expected: FAIL porque as rotas ainda são públicas.

- [ ] **Step 3: Implementar dependências e proteger rotas**

Comparar o header `X-CSRF-Token` por hash e `hmac.compare_digest`. Manter somente `/`, `/api/v1/health` e `/api/v1/auth/login` públicos. Alterar CORS para `allow_credentials=True`, métodos explícitos `GET`, `POST`, `PATCH`, `PUT`, `DELETE` e header `X-CSRF-Token`.

- [ ] **Step 4: Executar testes de autorização e regressão**

Run: `.\.venv\Scripts\python.exe -m pytest tests/test_authorization.py -q`

Expected: PASS.

Run: `.\.venv\Scripts\python.exe -m pytest -q`

Expected: todos os testes passam após adaptar fixtures existentes para sessões autenticadas.

- [ ] **Step 5: Commit**

```bash
git add backend/app/api/dependencies.py backend/app/api/routes/candidates.py backend/app/api/routes/extractions.py backend/app/main.py backend/tests
git commit -m "feat: enforce role and csrf protection"
```

### Task 6: Implementar login e sessão no React

**Files:**
- Create: `prototype/src/services/api.js`
- Create: `prototype/src/services/auth.js`
- Create: `prototype/src/auth/AuthProvider.jsx`
- Create: `prototype/src/components/LoginPage.jsx`
- Modify: `prototype/src/main.jsx`
- Modify: `prototype/src/App.jsx`
- Modify: `prototype/src/services/candidates.js`
- Modify: `prototype/src/services/extraction.js`
- Test: `prototype/src/AuthProvider.test.jsx`
- Test: `prototype/src/LoginPage.test.jsx`
- Modify: `prototype/src/App.test.jsx`

**Interfaces:**
- Produces: `apiFetch(path, options)`, `login(email, password)`, `logout()`, `getSession()` e contexto `{ user, csrfToken, status, signIn, signOut }`.
- `apiFetch` sempre usa `credentials: "include"` e adiciona `X-CSRF-Token` nas mutações.

- [ ] **Step 1: Escrever teste da página de login**

```jsx
it("autentica e abre o aplicativo sem armazenar token no navegador", async () => {
  fetch.mockResolvedValueOnce(jsonResponse({ user: { displayName: "Ana", role: "hr" }, csrfToken: "csrf-test" }));
  render(<LoginPage onSubmit={login} />);
  fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "ana@example.invalid" } });
  fireEvent.change(screen.getByLabelText("Senha"), { target: { value: "senha-segura-de-teste" } });
  fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
  await waitFor(() => expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/auth/login"), expect.objectContaining({ method: "POST", credentials: "include" })));
  expect(localStorage.length).toBe(0);
  expect(sessionStorage.length).toBe(0);
});
```

- [ ] **Step 2: Executar os testes e confirmar a falha**

Run: `npm test -- LoginPage.test.jsx AuthProvider.test.jsx`

Expected: FAIL porque os componentes ainda não existem.

- [ ] **Step 3: Criar cliente HTTP, contexto e página de login**

Ao iniciar, chamar `/auth/me`. Exibir estado de carregamento enquanto a sessão é conferida, `LoginPage` quando não autenticado e `App` quando autenticado. Em `401`, limpar apenas o estado em memória e retornar ao login.

- [ ] **Step 4: Migrar serviços existentes para `apiFetch` e adaptar testes**

Remover chamadas diretas a `fetch` em `candidates.js` e `extraction.js`. Toda mutação recebe automaticamente CSRF; nenhum token é gravado no navegador.

- [ ] **Step 5: Executar testes e build**

Run: `npm test`

Expected: testes novos e os 7 testes existentes passam.

Run: `npm run build`

Expected: `dist/client/index.html`, `dist/server/index.js` e `dist/.openai/hosting.json` são gerados.

- [ ] **Step 6: Commit**

```bash
git add prototype/src
git commit -m "feat: add authenticated frontend session"
```

### Task 7: Criar usuário inicial sem senha em arquivo e documentar a operação

**Files:**
- Create: `backend/scripts/create-user.py`
- Create: `backend/tests/test_create_user.py`
- Modify: `backend/README.md`
- Modify: `README.md`

**Interfaces:**
- O script recebe `--email`, `--name` e `--role`; lê a senha duas vezes com `getpass`, aplica Argon2 e nunca imprime a senha ou o hash.
- Funções aceitas: `operations`, `director`, `hr`, `dp` e `admin`.

- [ ] **Step 1: Escrever teste do comando de criação**

```python
def test_create_user_never_outputs_password(monkeypatch, capsys, db):
    monkeypatch.setattr("getpass.getpass", lambda _prompt: "senha-segura-de-teste")
    result = create_user(db, "rh@example.invalid", "Equipe RH", UserRole.hr)
    output = capsys.readouterr().out
    assert result.email == "rh@example.invalid"
    assert "senha-segura-de-teste" not in output
    assert verify_password("senha-segura-de-teste", result.password_hash)
```

- [ ] **Step 2: Executar o teste e confirmar a falha**

Run: `.\.venv\Scripts\python.exe -m pytest tests/test_create_user.py -q`

Expected: FAIL porque o script ainda não existe.

- [ ] **Step 3: Implementar o script e documentação**

Documentar o comando local:

```powershell
.\.venv\Scripts\python.exe scripts\create-user.py --email rh@empresa.invalid --name "Equipe RH" --role hr
```

O endereço acima é apenas exemplo; o operador informa o e-mail real localmente. Não documentar senha de banco, usuário, chave de API ou senha de login.

- [ ] **Step 4: Executar verificação final da fase**

Run: `.\.venv\Scripts\python.exe -m pytest -q`

Expected: backend completo passa.

Run: `npm test && npm run build`

Expected: frontend completo passa e gera o build.

Teste manual: criar usuários das cinco funções, autenticar, confirmar menus visíveis e receber `403` ao tentar ação não autorizada diretamente pela API.

- [ ] **Step 5: Commit**

```bash
git add backend/scripts/create-user.py backend/tests/test_create_user.py backend/README.md README.md
git commit -m "docs: add secure user bootstrap workflow"
```

## Conclusão da fase

A fase termina quando um usuário entra pelo navegador, a sessão sobrevive ao recarregamento, logout revoga o acesso, mutações sem CSRF falham, funções não autorizadas recebem `403`, ações registram o responsável e nenhuma rota pessoal existente permanece pública.
