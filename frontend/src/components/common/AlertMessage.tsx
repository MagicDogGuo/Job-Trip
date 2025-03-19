import React from 'react';
import { Alert, Snackbar, AlertColor } from '@mui/material';

interface AlertMessageProps {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose: () => void;
  duration?: number;
}

/**
 * 通用提示消息组件
 */
const AlertMessage: React.FC<AlertMessageProps> = ({
  open,
  message,
  severity,
  onClose,
  duration = 6000,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={onClose} 
        severity={severity} 
        sx={{ width: '100%' }}
        variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertMessage; 