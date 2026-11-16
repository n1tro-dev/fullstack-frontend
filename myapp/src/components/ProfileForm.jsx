import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import api from '../api';

function ProfileForm({ student, onCancel }) {
  // Компонент монтируется только когда student передан, поэтому Dialog сразу открыт
  const [bio, setBio] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (profileData) => api.post(`/api/profiles/student/${student.id}`, profileData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      onCancel(); // Закрываем модальное окно через родительский компонент
    },
  });

  const handleSubmit = () => {
    mutation.mutate({ bio, githubUrl });
  };

  return (
    <Dialog open={true} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Профиль студента: {student.name}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Краткая биография (Bio)"
          type="text"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          sx={{ mb: 2, mt: 1 }}
        />
        <TextField
          margin="dense"
          label="Ссылка на GitHub"
          type="url"
          fullWidth
          variant="outlined"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={mutation.isPending}>
          {mutation.isPending ? 'Сохранение...' : 'Создать профиль'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProfileForm;