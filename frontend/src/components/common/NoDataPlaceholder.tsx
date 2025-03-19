import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface NoDataPlaceholderProps {
  title: string;
  message: string;
  actionText?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
}

/**
 * 空数据占位组件
 * 当列表或页面没有数据时，显示提示信息和可选的操作按钮
 */
const NoDataPlaceholder: React.FC<NoDataPlaceholderProps> = ({
  title,
  message,
  actionText,
  actionIcon = <AddIcon />,
  onAction
}) => {
  return (
    <Box sx={{ 
      py: 6, 
      px: 2, 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* 可选：添加一个图标或图片 */}
      <Box sx={{ 
        width: 80, 
        height: 80, 
        borderRadius: '50%', 
        backgroundColor: 'action.hover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 3
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 5H5v14h14V5zm-2 8h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" opacity="0.5" fill="currentColor"/>
        </svg>
      </Box>
      
      <Typography variant="h6" align="center" gutterBottom>
        {title}
      </Typography>
      
      <Typography 
        variant="body2" 
        align="center" 
        color="text.secondary"
        sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}
      >
        {message}
      </Typography>
      
      {actionText && onAction && (
        <Button 
          variant="contained" 
          color="primary"
          startIcon={actionIcon}
          onClick={onAction}
        >
          {actionText}
        </Button>
      )}
    </Box>
  );
};

export default NoDataPlaceholder; 