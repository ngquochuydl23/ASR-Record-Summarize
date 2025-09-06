import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import { Autocomplete, TextField, CircularProgress, Paper, ListItem } from '@mui/material';
import { useAsyncFn } from 'react-use';
import { colors } from '@/theme/theme.global';

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
  return (
    <BaseAutocomplete
      id={id}
      name={name}
      multiple={multiple}
      freeSolo={freeSolo}
      options={options}
      value={value}
      getOptionLabel={getOptionLabel}
      getOptionKey={getOptionKey}
      loading={loading}
      sx={sx}
      onChange={onChange}
      PaperComponent={({ children }) => (
        <Paper
          elevation={0}
          sx={{ borderColor: colors.borderColor, borderWidth: '1px' }}>
          {children}
        </Paper>
      )}
      renderOption={(props, option) => {
        const { key, className, ...optionProps } = props;
        return (
          <ListItem {...optionProps} key={option.id}>{option.label}</ListItem>
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