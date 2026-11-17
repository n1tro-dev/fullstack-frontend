import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Snackbar, Button } from '@mui/material';
import api from '../api';
import GroupForm from './GroupForm';

function GroupList() {
  const queryClient = useQueryClient();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { data: groups = [], isLoading, isError } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const res = await api.get('/api/groups');
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/groups/${id}`),
    onSuccess: () => {
      setOpenSnackbar(true);
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Название группы', width: 300 },
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
            if (window.confirm(`Удалить группу ${params.row.name}?`)) {
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
        <h2>Список групп</h2>
        <GroupForm />
      </div>

      <div style={{ height: 400, width: '100%', backgroundColor: '#fff' }}>
        <DataGrid
          rows={groups}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
        />
      </div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Группа успешно удалена"
      />
    </div>
  );
}

export default GroupList;