function GroupList({ groups }) {
  return (
    <div className="card">
      <h3>Учебные группы</h3>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            <strong>{group.name}</strong> (ID: {group.id})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GroupList;