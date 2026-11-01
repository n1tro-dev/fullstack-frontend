import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProfileForm from './ProfileForm';

function StudentList({ students, groups, onRefresh }) {
  const { token } = useAuth();
  const [selectedGroups, setSelectedGroups] = useState({});
  const [activeStudentForProfile, setActiveStudentForProfile] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('Удалить студента?')) return;

    const response = await fetch(`http://localhost:8080/api/students/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      onRefresh();
    }
  };

  const handleAssignGroup = async (studentId) => {
    const groupId = selectedGroups[studentId];
    if (!groupId) {
      alert('Выберите группу из списка!');
      return;
    }

    const response = await fetch(
      `http://localhost:8080/api/students/${studentId}/group/${groupId}`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.ok) {
      onRefresh();
    } else {
      alert('Ошибка при привязке к группе');
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
              <th>Группа</th>
              <th>Профиль</th>
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
                  {student.group ? (
                    <strong>{student.group.name}</strong>
                  ) : (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <select
                        value={selectedGroups[student.id] || ''}
                        onChange={(e) =>
                          setSelectedGroups({ ...selectedGroups, [student.id]: e.target.value })
                        }
                      >
                        <option value="">-- Группа --</option>
                        {groups.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                      <button onClick={() => handleAssignGroup(student.id)}>OK</button>
                    </div>
                  )}
                </td>
                <td>
                  {student.profile ? (
                    <small>
                      {student.profile.bio} (
                      <a href={student.profile.githubUrl} target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                      )
                    </small>
                  ) : (
                    <button onClick={() => setActiveStudentForProfile(student)}>
                      + Профиль
                    </button>
                  )}
                </td>
                <td>
                  <button onClick={() => handleDelete(student.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeStudentForProfile && (
        <ProfileForm
          student={activeStudentForProfile}
          onProfileCreated={() => {
            setActiveStudentForProfile(null);
            onRefresh();
          }}
          onCancel={() => setActiveStudentForProfile(null)}
        />
      )}
    </div>
  );
}

export default StudentList;