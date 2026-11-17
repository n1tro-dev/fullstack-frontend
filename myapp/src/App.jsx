import { useMemo } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppBar, Toolbar, Typography, Container, Button, CssBaseline, useMediaQuery } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LoginForm from './components/LoginForm';
import StudentList from './components/StudentList';
import GroupList from './components/GroupList';
import './App.css';

function MainContent() {
  const { token, logout } = useAuth();

  if (!token) {
    return (
      <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <LoginForm />
      </Container>
    );
  }

  return (
    <BrowserRouter>
      <AppBar position="static" sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ flexGrow: 1, pt: 2, px: 3 }}>
          Университет
        </Typography>
        <Toolbar>
          <Button color="inherit" component={Link} to="/">Студенты</Button>
          <Button color="inherit" component={Link} to="/groups">Группы</Button>
          
          <Button color="inherit" onClick={logout}>Выйти</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl">
        <Routes>
          <Route path="/" element={<StudentList />} />
          <Route path="/groups" element={<GroupList />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </ThemeProvider>
  );
}