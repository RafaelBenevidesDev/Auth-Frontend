import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', gap: '12px', color: 'var(--text-muted)',
        fontFamily: 'var(--font-body)'
      }}>
        <div className="spinner" style={{ borderTopColor: 'var(--accent)' }} />
        Carregando...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}
