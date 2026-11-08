import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import GroupForm from './components/GroupForm';
import GroupList from './components/GroupList';
import './App.css';

function MainContent() {
  const { token, logout } = useAuth();

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
          <StudentForm />
          <GroupForm />
        </div>

        <StudentList />
        <GroupList />
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