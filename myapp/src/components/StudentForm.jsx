import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';

function StudentForm() {
  const [student, setStudent] = useState({ name: '', email: '' });
  const queryClient = useQueryClient();

  // Использование useMutation (Глава 10)
  const mutation = useMutation({
    mutationFn: (newStudent) => api.post('/api/students', newStudent),
    onSuccess: () => {
      setStudent({ name: '', email: '' });
      // Инвалидация кэша: список студентов заново запрашивается с сервера
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: () => {
      alert('Ошибка добавления студента');
    },
  });

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(student);
  };

  return (
    <div className="card">
      <h3>Добавить нового студента</h3>
      <form onSubmit={handleSubmit} className="aligned-form">
        <div className="form-group">
          <label htmlFor="student-name">ФИО студента:</label>
          <input
            id="student-name"
            type="text"
            name="name"
            placeholder="Иван Иванов"
            value={student.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="student-email">Email:</label>
          <input
            id="student-email"
            type="email"
            name="email"
            placeholder="ivan@example.com"
            value={student.email}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={mutation.isLoading}>
          {mutation.isLoading ? 'Сохранение...' : 'Сохранить'}
        </button>
      </form>
    </div>
  );
}

export default StudentForm;