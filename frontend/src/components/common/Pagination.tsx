import React from 'react';
import { Pagination as MuiPagination, Box, FormControl, MenuItem, Select, Typography, SelectChangeEvent } from '@mui/material';

interface PaginationProps {
  page: number;
  count: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  labelText?: string;
}

/**
 * 通用分页组件
 */
const Pagination: React.FC<PaginationProps> = ({
  page,
  count,
  limit,
  onPageChange,
  onLimitChange,
  labelText = '每页显示：',
}) => {
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    onLimitChange(Number(event.target.value));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: { xs: 'center', md: 'space-between' },
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        mt: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          {labelText}
        </Typography>
        <FormControl size="small">
          <Select
            value={limit}
            onChange={handleLimitChange}
            displayEmpty
            sx={{ minWidth: 80 }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <MuiPagination
        count={Math.ceil(count / limit)}
        page={page}
        onChange={handlePageChange}
        color="primary"
        showFirstButton
        showLastButton
        siblingCount={1}
      />
    </Box>
  );
};

export default Pagination; 