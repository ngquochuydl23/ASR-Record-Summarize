
import { alpha, styled } from '@mui/material/styles';
import { Autocomplete, TextField, CircularProgress, Paper, ListItem } from '@mui/material';
import { useAsyncFn } from 'react-use';
import { colors } from '@/theme/theme.global';
import { useCallback, useEffect, useRef, useState } from 'react';

const BaseAutocomplete = styled(Autocomplete)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
    fontSize: '14px'
  },
  '& .MuiAutocomplete-root': {
    border: '0px solid',
    borderColor: '#E0E3E7',

  },
  '& .MuiAutocomplete-inputRoot': {
    padding: '4px',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '30px',
    border: '1px solid',
    borderColor: '#E0E3E7',
    backgroundColor: 'white',
    overflow: 'hidden',
    '&.Mui-focused': {
      borderRadius: '30px',
      borderWidth: 0
    },
    '&.MuiAutocomplete-input': {
      padding: 0,
    }
  }
}));


export const BootstrapAutocomplete = ({
  id,
  name,
  multiple = false,
  loading = false,
  options = [],
  onInputChange,
  getOptionLabel,
  getOptionKey,
  onChange,
  placeholder,
  value,
  freeSolo = false,
  sx
}) => {
  const ref = useRef();
  const [borderRadius, setBorderRadius] = useState('15px');
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { height } = entry.contentRect;
        setBorderRadius(height > 50 ? '15px' : '30px');
      }
    });

    resizeObserver.observe(node);
    return () => resizeObserver.disconnect();
  }, []);
  return (
    <BaseAutocomplete ref={ref}
      id={id}
      name={name}
      multiple={multiple}
      freeSolo={freeSolo}
      options={options}
      value={value}
      getOptionLabel={getOptionLabel}
      getOptionKey={getOptionKey}
      loading={loading}
      sx={{
        padding: 0,
        width: '100%',
        ...sx,
        ['& .MuiOutlinedInput-root']: {
          borderRadius: borderRadius,
          '&.Mui-focused': {
            borderRadius: borderRadius,
            borderWidth: 0
          },
        },

      }}
      onChange={onChange}
      PaperComponent={({ children }) => (
        <Paper
          elevation={0}
          sx={{ borderColor: colors.borderColor, borderWidth: '1px' }}>
          {children}
        </Paper>
      )}
      renderOption={(props, option) => {
        const isDisabled = multiple ? (value || []).map(x => x.id).some((x) => x.id === option.id) : false;
        return (
          <ListItem {...props}
            key={option.id}
            sx={{
              ['&.Mui-selected']: {
                backgroundColor: '#d3d3d3'
              }
            }}
            disabled={isDisabled}>
            {option.label}
          </ListItem>
        );
      }}
      onInputChange={onInputChange}
      renderInput={(params) => (
        <TextField
          {...params}
          hiddenLabel
          placeholder={placeholder}
          sx={{
            '& .MuiOutlinedInput-root': {
              paddingLeft: multiple ? '5px' : '10px'
            }
          }}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}