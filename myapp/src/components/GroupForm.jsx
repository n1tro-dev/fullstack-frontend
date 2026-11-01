import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function GroupForm({ onGroupAdded }) {
  const [name, setName] = useState('');
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8080/api/groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      setName('');
      onGroupAdded();
    } else {
      alert('Ошибка при создании группы');
    }
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
        <button type="submit">Создать</button>
      </form>
    </div>
  );
}

export default GroupForm;