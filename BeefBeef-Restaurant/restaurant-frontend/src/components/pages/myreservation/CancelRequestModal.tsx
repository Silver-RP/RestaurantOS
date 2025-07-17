import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { requestCancelReservationApi } from '@/api/ReservationApi';

interface Props {
  reservationId: string;
  open: boolean;
  onClose: () => void;
}

const CancelRequestModal: React.FC<Props> = ({
  reservationId,
  open,
  onClose,
}) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendRequest = async () => {
    if (!reason.trim()) {
      toast.warning('Vui lòng nhập lý do huỷ đơn');
      return;
    }

    try {
      setLoading(true);
      await requestCancelReservationApi(reservationId, reason);
      toast.success('Gửi yêu cầu huỷ đơn thành công');
      onClose();
    } catch (error) {
      toast.error('Không thể gửi yêu cầu huỷ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Gửi yêu cầu huỷ đơn đặt bàn</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Lý do huỷ"
          fullWidth
          multiline
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleSendRequest}
          variant="contained"
          disabled={loading}
        >
          Gửi yêu cầu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelRequestModal;
