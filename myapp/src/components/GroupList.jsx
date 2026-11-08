import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';

function GroupList() {
  const queryClient = useQueryClient();

  const {
    data: groups = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await api.get('/api/groups');
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/groups/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: () => alert('Ошибка при удалении группы'),
  });

  const handleDelete = (id) => {
    if (confirm('Удалить группу?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="card"><p>Загрузка групп...</p></div>;
  if (isError) return <div className="card"><p>Ошибка при загрузке групп</p></div>;

  return (
    <div className="card">
      <h3>Учебные группы</h3>
      {groups.length === 0 ? (
        <p>Группы не найдены</p>
      ) : (
        <div className="groups-list">
          {groups.map((group) => (
            <div key={group.id} className="group-card">
              <div className="group-header">
                <h4>{group.name} (ID: {group.id})</h4>
                <button onClick={() => handleDelete(group.id)}>Удалить группу</button>
              </div>

              <div className="group-students">
                <strong>Студенты в группе ({group.students?.length || 0}):</strong>
                {group.students && group.students.length > 0 ? (
                  <ul>
                    {group.students.map((st) => (
                      <li key={st.id}>
                        {st.name} — <small>{st.email}</small>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-text">В этой группе пока нет студентов</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GroupList;