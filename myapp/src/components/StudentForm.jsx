import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function StudentForm({ onStudentAdded }) {
  const [student, setStudent] = useState({ name: '', email: '' });
  const { token } = useAuth();

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8080/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(student),
    });

    if (response.ok) {
      setStudent({ name: '', email: '' });
      onStudentAdded(); // Обновляем список студентов в родителе
    } else {
      alert('Ошибка добавления студента');
    }
  };

  return (
    <div className="card">
      <h3>Добавить нового студента</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="ФИО студента"
          value={student.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={student.email}
          onChange={handleChange}
          required
        />
        <button type="submit">Сохранить</button>
      </form>
    </div>
  );
}

export default StudentForm;