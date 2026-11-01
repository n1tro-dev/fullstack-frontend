import { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import GroupForm from './components/GroupForm';
import GroupList from './components/GroupList';
import './App.css';

function MainContent() {
  const { token, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);

  const fetchData = useCallback(async () => {
    if (!token) return;

    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [resStudents, resGroups] = await Promise.all([
        fetch('http://localhost:8080/api/students', { headers }),
        fetch('http://localhost:8080/api/groups', { headers }),
      ]);

      if (resStudents.ok) setStudents(await resStudents.json());
      if (resGroups.ok) setGroups(await resGroups.json());
    } catch (err) {
      console.error('Ошибка при загрузке данных:', err);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      void Promise.resolve().then(fetchData);
    }
  }, [token, fetchData]);

  if (!token) {
    return <LoginForm />;
  }

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Панель управления Университетом</h2>
        <button onClick={logout}>Выйти</button>
      </header>

      <main>
        <div className="forms-grid">
          <StudentForm onStudentAdded={fetchData} />
          <GroupForm onGroupAdded={fetchData} />
        </div>

        <StudentList students={students} groups={groups} onRefresh={fetchData} />
        <GroupList groups={groups} onRefresh={fetchData} />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}