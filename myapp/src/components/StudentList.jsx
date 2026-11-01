import { useAuth } from '../context/AuthContext';

function StudentList({ students, onRefresh }) {
  const { token } = useAuth();

  const handleDelete = async (id) => {
    if (!confirm('Удалить студента?')) return;

    const response = await fetch(`http://localhost:8080/api/students/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      onRefresh();
    }
  };

  return (
    <div className="card">
      <h3>Список студентов</h3>
      {students.length === 0 ? (
        <p>Студенты не найдены</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>ID</th>
              <th>ФИО</th>
              <th>Email</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>
                  <button onClick={() => handleDelete(student.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentList;