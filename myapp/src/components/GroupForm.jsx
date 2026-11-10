import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';

function GroupForm() {
  const [name, setName] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newGroup) => api.post('/api/groups', newGroup),
    onSuccess: () => {
      setName('');
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
    onError: () => {
      alert('Ошибка при создании группы');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ name });
  };

  return (
    <div className="card">
      <h3>Добавить группу</h3>
      <form onSubmit={handleSubmit} className="inline-form">
        <input
          type="text"
          placeholder="Название группы (например, SE-2026)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? '...' : 'Создать'}
        </button>
      </form>
    </div>
  );
}

export default GroupForm;