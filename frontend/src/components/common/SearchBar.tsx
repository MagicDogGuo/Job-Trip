import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  InputBase, 
  IconButton, 
  Box 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  debounceTime?: number;
}

/**
 * 通用搜索栏组件
 */
const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = '搜索...',
  initialValue = '',
  debounceTime = 500,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const debouncedSearchQuery = useDebounce<string>(searchQuery, debounceTime);

  // 搜索内容变化时触发搜索
  useEffect(() => {
    onSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Paper
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <IconButton sx={{ p: '10px' }} aria-label="搜索图标">
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearchChange}
          inputProps={{ 'aria-label': '搜索栏' }}
        />
        {searchQuery && (
          <IconButton 
            sx={{ p: '10px' }} 
            aria-label="清除" 
            onClick={handleClearSearch}
          >
            <ClearIcon />
          </IconButton>
        )}
      </Paper>
    </Box>
  );
};

export default SearchBar; 