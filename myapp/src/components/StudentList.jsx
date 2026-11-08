import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import ProfileForm from './ProfileForm';

function StudentList() {
  const queryClient = useQueryClient();
  const [selectedGroups, setSelectedGroups] = useState({});
  const [activeStudentForProfile, setActiveStudentForProfile] = useState(null);

  // 1. useQuery (Глава 10): получение списка студентов
  const {
    data: students = [],
    isLoading: isLoadingStudents,
    isError: isErrorStudents,
  } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const res = await api.get('/api/students');
      return res.data;
    },
  });

  // Получение списка групп для drop-down
  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await api.get('/api/groups');
      return res.data;
    },
  });

  // 2. useMutation: удаление студента
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/students/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });

  // 3. useMutation: привязка студента к группе
  const assignGroupMutation = useMutation({
    mutationFn: ({ studentId, groupId }) =>
      api.put(`/api/students/${studentId}/group/${groupId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
    onError: () => alert('Ошибка при привязке к группе'),
  });

  const handleDelete = (id) => {
    if (confirm('Удалить студента?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleAssignGroup = (studentId) => {
    const groupId = selectedGroups[studentId];
    if (!groupId) {
      alert('Выберите группу из списка!');
      return;
    }
    assignGroupMutation.mutate({ studentId, groupId });
  };

  if (isLoadingStudents) return <div className="card"><p>Загрузка студентов...</p></div>;
  if (isErrorStudents) return <div className="card"><p>Ошибка при загрузке студентов</p></div>;

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
          onCancel={() => setActiveStudentForProfile(null)}
        />
      )}
    </div>
  );
}

export default StudentList;