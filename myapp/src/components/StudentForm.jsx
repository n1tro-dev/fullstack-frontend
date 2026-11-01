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
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(student),
    });

    if (response.ok) {
      setStudent({ name: '', email: '' });
      onStudentAdded();
    } else {
      alert('Ошибка добавления студента');
    }
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

        <button type="submit" className="submit-btn">
          Сохранить
        </button>
      </form>
    </div>
  );
}

export default StudentForm;