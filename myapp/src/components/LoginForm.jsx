import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

function LoginForm() {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleChange = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/login', creds);

      const authHeader = response.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '');
        login(token);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Неверный логин или пароль');
      } else {
        setError('Ошибка соединения с сервером');
      }
    }
  };

  return (
    <div className="card">
      <h2>Авторизация в системе</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label>Логин:</label>
          <input
            type="text"
            name="username"
            value={creds.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Пароль:</label>
          <input
            type="password"
            name="password"
            value={creds.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Войти</button>
      </form>
    </div>
  );
}

export default LoginForm;