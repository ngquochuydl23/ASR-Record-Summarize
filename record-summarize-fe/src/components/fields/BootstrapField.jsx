import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { fontSize } from '@mui/system';
import { colors } from '@/theme/theme.global';

export const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
    fontSize: '14px',
    '&:focus': {
      color: colors.primaryColor,
    },
  },
  '& .MuiInputBase-input': {
    borderRadius: '30px',
    position: 'relative',
    backgroundColor: 'white',
    border: '1px solid',
    borderColor: '#E0E3E7',
    padding: '10px 12px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    // Use the system font instead of the default Roboto font.
    fontFamily: ['Plus Jakarta Sans',].join(','),
    '&:focus': {
      boxShadow: `${alpha(colors.primaryColor, 0.25)} 0 0 0 0.1rem`,
      borderColor: colors.primaryColor,
    },
    '&::placeholder': {
      color: '#696969',
      opacity: 1, // otherwise firefox shows a lighter color
    },
  },
}));


