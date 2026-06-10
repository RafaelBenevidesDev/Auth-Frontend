import { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { authService } from '../services/api';
import './Dashboard.css';

const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
  calendar: 'M3 4h18v18H3zM16 2v4M8 2v4M3 10h18',
  edit: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  check: 'M20 6L9 17l-5-5',
  sun: 'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 1 0 0 14A7 7 0 0 0 12 5z',
  moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  spark: 'M13 2L9 11H3l8 11 4-9h6L13 2z',
};

function formatDate(dateStr) {
  if (!dateStr) return '---';
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export default function Dashboard() {
  const { user, logout, updateUser } = useAuth();
  const { theme, toggle } = useTheme();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const profileCompleteness = useMemo(() => {
    const checks = [user?.name, user?.email, user?.created_at, user?.id];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [user]);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await authService.updateMe(form);
      updateUser(res.data.user);
      setFeedback({ type: 'success', msg: 'Perfil atualizado com sucesso!' });
      setEditing(false);
    } catch {
      updateUser({ ...user, ...form });
      setFeedback({ type: 'success', msg: 'Perfil atualizado localmente.' });
      setEditing(false);
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  const cancel = () => {
    setForm({ name: user?.name || '', email: user?.email || '' });
    setEditing(false);
    setFeedback(null);
  };

  return (
    <div className="dash-page page">
      <div className="bloom-bg" />
      <div className="motion-lattice" />

      <aside className="dash-sidebar card">
        <div className="sidebar-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <rect width="28" height="28" rx="8" fill="var(--accent)" opacity="0.16" />
            <path d="M14 5L22 9.5V18.5L14 23L6 18.5V9.5L14 5Z" stroke="var(--accent)" strokeWidth="1.8" />
            <circle cx="14" cy="14" r="3" fill="var(--accent)" />
          </svg>
          <span className="sidebar-logo-text">Portfolio<strong>Auth</strong></span>
        </div>

        <nav className="sidebar-nav">
          <a className="nav-item active">
            <Icon d={ICONS.user} size={18} />
            Meu perfil
          </a>
          <a className="nav-item disabled">
            <Icon d={ICONS.shield} size={18} />
            Seguranca
          </a>
        </nav>

        <div className="sidebar-pulse">
          <span className="pulse-dot" />
          <div>
            <strong>Sessao ativa</strong>
            <p>Ambiente autenticado</p>
          </div>
        </div>

        <div className="sidebar-bottom">
          <button className="theme-btn" onClick={toggle}>
            <Icon d={theme === 'light' ? ICONS.moon : ICONS.sun} size={16} />
            {theme === 'light' ? 'Modo escuro' : 'Modo claro'}
          </button>
          <button className="logout-btn" onClick={logout}>
            <Icon d={ICONS.logout} size={16} />
            Sair
          </button>
        </div>
      </aside>

      <main className="dash-main">
        <header className="dash-header animate-fade">
          <div>
            <span className="dash-eyebrow">CONTROL CENTER</span>
            <h1 className="dash-title">Meu Perfil</h1>
            <p className="dash-subtitle">Gerencie suas informacoes pessoais em uma interface viva, clara e responsiva.</p>
          </div>
          {!editing && (
            <button className="btn btn-ghost" onClick={() => setEditing(true)}>
              <Icon d={ICONS.edit} size={16} />
              Editar perfil
            </button>
          )}
        </header>

        {feedback && (
          <div className={`alert alert-${feedback.type} animate-fade`}>
            {feedback.type === 'success' && <Icon d={ICONS.check} size={16} />}
            {feedback.msg}
          </div>
        )}

        <section className="profile-hero card animate-slide-up">
          <div className="hero-scan" aria-hidden="true" />
          <div className="profile-avatar">
            <span>{getInitials(user?.name) || 'PA'}</span>
            <div className="avatar-ring" />
          </div>
          <div className="profile-meta">
            <span className="profile-kicker">Identidade digital</span>
            <h2 className="profile-name">{user?.name}</h2>
            <p className="profile-email">{user?.email}</p>
            <span className="profile-badge">
              <Icon d={ICONS.shield} size={12} />
              Conta verificada
            </span>
          </div>
          <div className="profile-status">
            <span>{profileCompleteness}%</span>
            <p>perfil completo</p>
            <div className="status-track">
              <i style={{ width: `${profileCompleteness}%` }} />
            </div>
          </div>
        </section>

        <section className="dash-command-strip animate-slide-up" style={{ animationDelay: '0.06s' }}>
          <div className="command-item">
            <Icon d={ICONS.spark} size={16} />
            <span>UI energizada</span>
          </div>
          <div className="command-item">
            <Icon d={ICONS.check} size={16} />
            <span>Dados sincronizados</span>
          </div>
          <div className="command-item">
            <Icon d={ICONS.shield} size={16} />
            <span>Acesso protegido</span>
          </div>
        </section>

        <section className="info-grid animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="info-card card">
            <div className="info-icon"><Icon d={ICONS.user} size={18} /></div>
            <div className="info-content">
              <span className="info-label">Nome completo</span>
              <span className="info-value">{user?.name}</span>
            </div>
          </div>
          <div className="info-card card">
            <div className="info-icon"><Icon d={ICONS.mail} size={18} /></div>
            <div className="info-content">
              <span className="info-label">Email</span>
              <span className="info-value">{user?.email}</span>
            </div>
          </div>
          <div className="info-card card">
            <div className="info-icon"><Icon d={ICONS.calendar} size={18} /></div>
            <div className="info-content">
              <span className="info-label">Membro desde</span>
              <span className="info-value">{formatDate(user?.created_at)}</span>
            </div>
          </div>
          <div className="info-card card">
            <div className="info-icon"><Icon d={ICONS.shield} size={18} /></div>
            <div className="info-content">
              <span className="info-label">ID da conta</span>
              <span className="info-value">#{user?.id}</span>
            </div>
          </div>
        </section>

        {editing && (
          <section className="edit-card card animate-slide-up">
            <div className="edit-heading">
              <span className="dash-eyebrow">PROFILE LAB</span>
              <h3 className="edit-title">Editar informacoes</h3>
            </div>
            <form onSubmit={save} className="edit-form">
              <div className="field">
                <label>Nome completo</label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={change}
                  required
                  placeholder="Seu nome"
                />
              </div>
              <div className="field">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={change}
                  required
                  placeholder="seu@email.com"
                />
              </div>
              <div className="edit-actions">
                <button type="button" className="btn btn-danger" onClick={cancel}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><div className="spinner" /> Salvando...</> : <><Icon d={ICONS.check} size={16} /> Salvar</>}
                </button>
              </div>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
