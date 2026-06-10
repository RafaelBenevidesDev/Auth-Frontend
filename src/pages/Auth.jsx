import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './Auth.css';

const AUTH_HIGHLIGHTS = [
  {
    title: 'Login sem friccao',
    text: 'Interface rapida, clara e pensada para entrar em fluxo sem distracoes.',
  },
  {
    title: 'Registro guiado',
    text: 'Microfeedback visual transforma o cadastro em uma experiencia memoravel.',
  },
  {
    title: 'Tema cinematografico',
    text: 'Dark e light com contraste forte, camadas vivas e transicoes suaves.',
  },
];

function getPasswordScore(password) {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.min(score, 5);
}

function getPasswordLabel(score) {
  if (score <= 1) return 'Fraca';
  if (score === 2) return 'Basica';
  if (score === 3) return 'Boa';
  if (score === 4) return 'Forte';
  return 'Quase imbativel';
}

export default function AuthPage() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const passwordScore = useMemo(() => getPasswordScore(form.password), [form.password]);
  const passwordLabel = useMemo(() => getPasswordLabel(passwordScore), [passwordScore]);

  const change = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (tab === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }

      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message;
      const errs = err.response?.data?.errors;
      setError(errs ? errs.map((item) => item.message).join(' · ') : msg || 'Algo deu errado');
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (nextTab) => {
    setTab(nextTab);
    setError('');
  };

  return (
    <div className="auth-page page">
      <div className="bloom-bg" />
      <div className="motion-lattice" />
      <div className="auth-ambient auth-ambient-one" />
      <div className="auth-ambient auth-ambient-two" />
      <div className="auth-grid-noise" />

      <button className="theme-toggle" onClick={toggle} aria-label="Alternar tema">
        <span>{theme === 'light' ? 'NOX' : 'SOL'}</span>
      </button>

      <main className="auth-shell">
        <section className="auth-showcase card animate-fade">
          <div className="auth-brand">
            <div className="auth-brand-mark" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div>
              <p className="auth-brand-kicker">PORTFOLIO AUTH</p>
              <h1>Entrada com personalidade.</h1>
            </div>
          </div>

          <p className="auth-showcase-copy">
            Uma experiencia de autenticacao com energia de painel editorial, contraste alto e animacoes
            que dao vida ao fluxo de acesso.
          </p>

          <div className="auth-pill-row">
            <span className="auth-pill">Creative UI</span>
            <span className="auth-pill">Motion First</span>
            <span className="auth-pill">Secure Flow</span>
          </div>

          <div className="auth-hero-frame">
            <div className="auth-hero-symbol" aria-hidden="true">
              <div className="auth-symbol-glow" />
              <div className="auth-symbol-core">
                <span />
              </div>
              <div className="auth-symbol-ring" />
              <div className="auth-symbol-spark auth-symbol-spark-1" />
              <div className="auth-symbol-spark auth-symbol-spark-2" />
            </div>
            <div className="auth-floating-card auth-floating-card-top">
              <strong>+98%</strong>
              <span>de impacto visual</span>
            </div>
            <div className="auth-floating-card auth-floating-card-bottom">
              <strong>{theme === 'light' ? 'Light mode' : 'Dark mode'}</strong>
              <span>com transicao suave</span>
            </div>
          </div>

          <ul className="auth-highlight-list">
            {AUTH_HIGHLIGHTS.map((item) => (
              <li key={item.title} className="auth-highlight-item">
                <span className="auth-highlight-dot" aria-hidden="true" />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="auth-panel card animate-slide-up">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => switchTab('login')}
            >
              Entrar
            </button>
            <button
              className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
              onClick={() => switchTab('register')}
            >
              Criar conta
            </button>
            <div className={`auth-tab-indicator ${tab === 'register' ? 'right' : ''}`} />
          </div>

          <div className="auth-body">
            <div className="auth-heading">
              <span className="auth-eyebrow">{tab === 'login' ? 'ACESSO RAPIDO' : 'NOVO PERFIL'}</span>
              <h2>{tab === 'login' ? 'Bem vindo de volta' : 'Crie sua conta'}</h2>
              <p>
                {tab === 'login'
                  ? 'Entre com suas credenciais para continuar.'
                  : 'Preencha os dados abaixo para comecar com estilo.'}
              </p>
            </div>

            {error && <div className="alert alert-error animate-fade">{error}</div>}

            <form onSubmit={submit} className="auth-form">
              {tab === 'register' && (
                <div className="field animate-fade">
                  <label htmlFor="name">Nome completo</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Joao Silva"
                    value={form.name}
                    onChange={change}
                    required
                    autoComplete="name"
                  />
                </div>
              )}

              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="joao@email.com"
                  value={form.email}
                  onChange={change}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="field">
                <label htmlFor="password">
                  Senha
                  {tab === 'register' && (
                    <span className="field-hint">min. 8 chars, uma maiuscula e um numero</span>
                  )}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  value={form.password}
                  onChange={change}
                  required
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                />
                {tab === 'register' && (
                  <div className="password-meter" aria-live="polite">
                    <div className="password-meter-track">
                      <span className={`password-meter-fill score-${passwordScore}`} />
                    </div>
                    <div className="password-meter-meta">
                      <span>{passwordLabel}</span>
                      <span>{passwordScore}/5</span>
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="spinner" />
                    Aguarde...
                  </>
                ) : tab === 'login' ? (
                  'Entrar'
                ) : (
                  'Criar conta'
                )}
              </button>
            </form>

            <div className="divider">ou continue</div>

            <p className="auth-switch">
              {tab === 'login' ? 'Nao tem uma conta?' : 'Ja tem uma conta?'}
              {' '}
              <button
                className="auth-link"
                onClick={() => switchTab(tab === 'login' ? 'register' : 'login')}
              >
                {tab === 'login' ? 'Criar conta' : 'Entrar'}
              </button>
            </p>
          </div>
        </section>
      </main>

      <p className="auth-footer animate-fade">Projeto portfolio · Full Stack Developer</p>
    </div>
  );
}
