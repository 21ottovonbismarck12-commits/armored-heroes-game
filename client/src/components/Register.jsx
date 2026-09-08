import { useState } from 'react';
import authService from '../services/authService';
import './Auth.css';

function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    characterName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { username, email, password, confirmPassword, characterName } = formData;

      if (!username || !email || !password || !confirmPassword || !characterName) {
        setError('Por favor completa todos los campos');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        setLoading(false);
        return;
      }

      const response = await authService.register(username, email, password, characterName);
      
      if (response.success) {
        onRegisterSuccess(response.user, response.player);
      }
    } catch (err) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>⚔️ Crear Cuenta</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nombre de Usuario:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Tu nombre de usuario (3-20 caracteres)"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Correo Electrónico:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@correo.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Nombre del Personaje:</label>
            <input
              type="text"
              name="characterName"
              value={formData.characterName}
              onChange={handleChange}
              placeholder="Nombre de tu guerrero"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Confirmar Contraseña:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="btn-auth"
            disabled={loading}
          >
            {loading ? '⏳ Registrando...' : '✅ Crear Cuenta'}
          </button>
        </form>

        <div className="auth-footer">
          <p>¿Ya tienes cuenta? <button onClick={onSwitchToLogin} className="link-btn">Inicia sesión</button></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
