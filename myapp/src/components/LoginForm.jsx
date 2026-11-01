import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

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
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds),
      });

      if (response.ok) {
        const authHeader = response.headers.get('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.replace('Bearer ', '');
          login(token);
        }
      } else {
        setError('Неверный логин или пароль');
      }
    } catch {
      setError('Ошибка соединения с сервером');
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