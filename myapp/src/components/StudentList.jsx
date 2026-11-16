import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Snackbar, Button, Select, MenuItem } from '@mui/material';
import api from '../api';
import ProfileForm from './ProfileForm';
import StudentForm from './StudentForm'; // Теперь это модальное окно

function StudentList() {
  const queryClient = useQueryClient();
  const [activeStudentForProfile, setActiveStudentForProfile] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { data: students = [], isLoading, isError } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const res = await api.get('/api/students');
      return res.data;
    },
  });

  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await api.get('/api/groups');
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/students/${id}`),
    onSuccess: () => {
      setOpenSnackbar(true);
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });

  const assignGroupMutation = useMutation({
    mutationFn: ({ studentId, groupId }) =>
      api.put(`/api/students/${studentId}/group/${groupId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'ФИО', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'group',
      headerName: 'Группа',
      width: 200,
      renderCell: (params) => {
        const student = params.row;
        if (student.group) return <strong>{student.group.name}</strong>;
        
        return (
          <Select
            size="small"
            displayEmpty
            value=""
            onChange={(e) => assignGroupMutation.mutate({ studentId: student.id, groupId: e.target.value })}
          >
            <MenuItem value="" disabled>-- Выбрать --</MenuItem>
            {groups.map((g) => (
              <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
            ))}
          </Select>
        );
      },
    },
    {
      field: 'profile',
      headerName: 'Профиль',
      width: 250,
      renderCell: (params) => {
        const student = params.row;
        if (student.profile) {
          return (
            <span style={{ fontSize: '0.85rem' }}>
              {student.profile.bio} (<a href={student.profile.githubUrl} target="_blank" rel="noreferrer">GitHub</a>)
            </span>
          );
        }
        return <Button size="small" onClick={() => setActiveStudentForProfile(student)}>+ Профиль</Button>;
      },
    },
    {
      field: 'actions',
      headerName: 'Действия',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button 
          color="error" 
          onClick={() => {
            if (window.confirm(`Удалить студента ${params.row.name}?`)) {
              deleteMutation.mutate(params.row.id);
            }
          }}
        >
          Удалить
        </Button>
      ),
    },
  ];

  if (isLoading) return <div>Загрузка...</div>;
  if (isError) return <div>Ошибка загрузки данных</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2>Список студентов</h2>
        <StudentForm />
      </div>

      <div style={{ height: 600, width: '100%', backgroundColor: '#fff' }}>
        <DataGrid
          rows={students}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
        />
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Студент успешно удален"
      />

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