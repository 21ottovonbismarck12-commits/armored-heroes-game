import { useState } from 'react';
import authService from '../services/authService';
import './Auth.css';

function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Por favor completa todos los campos');
        setLoading(false);
        return;
      }

      const response = await authService.login(email, password);
      
      if (response.success) {
        onLoginSuccess(response.user, response.player);
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>🎮 Iniciar Sesión</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Correo Electrónico:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="tu@correo.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="btn-auth"
            disabled={loading}
          >
            {loading ? '⏳ Iniciando sesión...' : '✅ Iniciar Sesión'}
          </button>
        </form>

        <div className="auth-footer">
          <p>¿No tienes cuenta? <button onClick={onSwitchToRegister} className="link-btn">Regístrate aquí</button></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
