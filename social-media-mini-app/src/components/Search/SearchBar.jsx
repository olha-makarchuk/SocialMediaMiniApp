import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { TextField, InputAdornment, Box, ClickAwayListener } from '@mui/material';
import { Search } from '@mui/icons-material';
import { searchAsync } from '../../features/search/searchApi';
import { setQuery, addToHistory } from '../../features/search/searchSlice';
import SearchHistory from './SearchHistory';
import SearchResults from '../../pages/Search/SearchResults';

function SearchBar() {
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (value.trim().length >= 2) {
        dispatch(searchAsync(value));
        dispatch(setQuery(value));
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [value, dispatch]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && value.trim()) {
      dispatch(addToHistory(value.trim()));
      setIsOpen(false); 
    }
  };

  const handleSelectFromHistory = (item) => {
    setValue(item);
    dispatch(searchAsync(item));
    setIsOpen(true); 
  };

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <Box sx={{ width: '100%', maxWidth: 400, position: 'relative' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Пошук людей та постів..."
          value={value}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setValue(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
              sx: { borderRadius: 20, bgcolor: '#d7e9fa' }
            }
          }}
        />

        {isOpen && (
          <Box sx={{ 
            position: 'absolute', 
            top: '100%', 
            left: 0, 
            right: 0, 
            zIndex: 1300, 
            minWidth: 300 
          }}>
            {value.trim().length < 2 ? (
              <SearchHistory onSelect={handleSelectFromHistory} />
            ) : (
              <SearchResults />
            )}
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
}

export default SearchBar;