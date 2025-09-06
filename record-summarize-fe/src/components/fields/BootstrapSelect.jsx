import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export const BootstrapSelect = styled(Select)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
    fontSize: '14px',
  },

}));


export const BootstrapSelectOption = styled(MenuItem)(({ theme }) => ({
  fontSize: '14px',
  padding: '5px 20px',
  borderRadius: '2px',
  fontWeight: 500,
  fontFamily: ['Plus Jakarta Sans',].join(','),
}));
