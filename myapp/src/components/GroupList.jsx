import { useAuth } from '../context/AuthContext';

function GroupList({ groups, onRefresh }) {
  const { token } = useAuth();

  const handleDelete = async (id) => {
    if (!confirm('Удалить группу?')) return;

    const response = await fetch(`http://localhost:8080/api/groups/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      onRefresh();
    } else {
      alert('Ошибка при удалении группы');
    }
  };

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