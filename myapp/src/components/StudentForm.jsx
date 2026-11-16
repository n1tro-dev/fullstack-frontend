import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import api from '../api';

function StudentForm() {
  const [open, setOpen] = useState(false);
  const [student, setStudent] = useState({ name: '', email: '' });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newStudent) => api.post('/api/students', newStudent),
    onSuccess: () => {
      setStudent({ name: '', email: '' });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setOpen(false);
    },
  });

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Новый студент
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Добавить нового студента</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="ФИО студента"
            type="text"
            fullWidth
            variant="outlined"
            value={student.name}
            onChange={handleChange}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={student.email}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button onClick={() => mutation.mutate(student)} variant="contained" disabled={mutation.isPending}>
            {mutation.isPending ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default StudentForm;