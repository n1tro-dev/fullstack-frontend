import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';

function ProfileForm({ student, onCancel }) {
  const [bio, setBio] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (profileData) =>
      api.post(`/api/profiles/student/${student.id}`, profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      onCancel();
    },
    onError: () => {
      alert('Ошибка при создании профиля');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ bio, githubUrl });
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
          <button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button type="button" onClick={onCancel}>Отмена</button>
        </div>
      </form>
    </div>
  );
}

export default ProfileForm;