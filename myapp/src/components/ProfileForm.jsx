import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function ProfileForm({ student, onProfileCreated, onCancel }) {
  const [bio, setBio] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:8080/api/profiles/student/${student.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bio, githubUrl }),
    });

    if (response.ok) {
      onProfileCreated();
    } else {
      alert('Ошибка при создании профиля');
    }
  };

  return (
    <div className="modal-box">
      <h4>Создание профиля для: {student.name}</h4>
      <form onSubmit={handleSubmit} className="login-form">
        <div>
          <label>О себе (Bio):</label>
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
        </div>
        <div>
          <label>GitHub URL:</label>
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            required
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="submit">Сохранить</button>
          <button type="button" onClick={onCancel}>Отмена</button>
        </div>
      </form>
    </div>
  );
}

export default ProfileForm;