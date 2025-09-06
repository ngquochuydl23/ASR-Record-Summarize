import {
  createTheme,
  filledInputClasses,
  inputLabelClasses,
  outlinedInputClasses,
  paperClasses,
  tableCellClasses
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { pxToRem } from '@/utils/getFontValue';
import { colors } from './theme.global';

const muiTheme = createTheme();

export function createComponents(config) {
  const { palette } = config;

  return {
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '4px', // Bo góc cho ListItem
          fontSize: '14px',
          padding: '4px 10px', // Tăng khoảng cách trong ListItem
          '&:hover': {
            backgroundColor: palette.action.hover, // Hiệu ứng hover
          },
          '&.Mui-selected': {
            backgroundColor: colors.trans05Primary, // Màu khi được chọn
          }
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paperClasses: {
          borderRadius: '30px'
        }
      }
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 0
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '15px',
        },
      }
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: '10px',
        },
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '30px',
          padding: '4px 8px',
          textTransform: 'none',
          boxShadow: 'none'
        },
        sizeSmall: {
          borderRadius: '30px',
          padding: '4px 8px',
          fontSize: pxToRem(12)
        },
        sizeMedium: {
          borderRadius: '30px',
          padding: '6px 12px',
          fontSize: pxToRem(14),
          height: '40px'
        },
        sizeLarge: {
          height: '50px',
          borderRadius: '30px',
          padding: '8px 16px'
        },
        textSizeSmall: {
          borderRadius: '30px',
          padding: '7px 12px'
        },
        textSizeMedium: {
          padding: '9px 16px'
        },
        textSizeLarge: {
          padding: '12px 16px'
        },
        outlined: {
          borderWidth: '1px',
          fontWeight: '600',
          color: colors.textPrimaryColor,
          borderColor: colors.borderColor,
          '&:hover': {
            borderColor: colors.borderColor
          },
        },
        contained: {
          backgroundColor: colors.primaryColor,
          boxShadow: 'none',
          '&:hover': {
            borderColor: colors.primaryColor
          },
        }
      }
    },
    MuiSelect: {
      defaultProps: {
        IconComponent: ExpandMoreIcon,
      },
      styleOverrides: {
        select: ({ ownerState }) => ({
          backgroundColor: "white",
          borderColor: "#E0E3E7",
        }),
        variants: [
          {
            props: { size: 'small' },
            style: {
              padding: '2px 2px',
              fontSize: '10px'
            },
          },
        ],
        root: {
          '.MuiSvgIcon-root': {
            color: '#d0d0d0',
            borderRadius: '30px',
          },
          borderRadius: '30px',
          marginRight: '10px',

        },
      },
    },


    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          [`&.${paperClasses.elevation1}`]: {
            boxShadow: '0px 5px 22px rgba(0, 0, 0, 0.04), 0px 0px 0px 0.5px rgba(0, 0, 0, 0.03)'
          }
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '32px 24px',
          '&:last-child': {
            paddingBottom: '32px'
          }
        }
      }
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: {
          variant: 'h6'
        },
        subheaderTypographyProps: {
          variant: 'body2'
        }
      },
      styleOverrides: {
        root: {
          padding: '32px 24px 16px'
        }
      }
    },
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box'
        },
        html: {
          MozOsxFontSmoothing: 'grayscale',
          WebkitFontSmoothing: 'antialiased',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100%',
          width: '100%'
        },
        body: {
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          minHeight: '100%',
          width: '100%'
        },
        '#__next': {
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          height: '100%',
          width: '100%'
        },
        '#nprogress': {
          pointerEvents: 'none'
        },
        '#nprogress .bar': {
          backgroundColor: palette.primary,
          height: 3,
          left: 0,
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 2000
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&::placeholder': {
            opacity: 1
          }
        }
      }
    },
    MuiInput: {
      styleOverrides: {
        input: {
          fontSize: 14,
          fontWeight: 500,
          lineHeight: '24px',
          '&::placeholder': {
            color: palette.text.secondary
          }
        }
      }
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          borderRadius: 8,
          borderStyle: 'solid',
          borderWidth: '1px',
          overflow: 'hidden',
          borderColor: palette.neutral[200],
          '&:hover': {
            backgroundColor: palette.action.hover
          },
          '&:before': {
            display: 'none'
          },
          '&:after': {
            display: 'none'
          },
          [`&.${filledInputClasses.disabled}`]: {
            backgroundColor: 'transparent'
          },
          [`&.${filledInputClasses.focused}`]: {
            backgroundColor: 'transparent',
            borderColor: palette.primary.main,
            borderWidth: '1px',
            boxShadow: `${palette.primary.main} 0 0 0 2px`
          },
          [`&.${filledInputClasses.error}`]: {
            borderColor: palette.error.main,
            boxShadow: `${palette.error.main} 0 0 0 2px`
          }
        },
        input: {
          fontSize: 14,
          fontWeight: 500,
          lineHeight: '24px'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '30px',
          // '&:hover': {
          //   backgroundColor: palette.action.hover,
          //   [`& .${outlinedInputClasses.notchedOutline}`]: {
          //     borderColor: palette.neutral[200]
          //   }
          // },
          // [`& .${outlinedInputClasses.focused}`]: {
          //   borderRadius: '30px',
          //   backgroundColor: 'transparent',
          //   [`& .${outlinedInputClasses.notchedOutline}`]: {
          //     borderColor: palette.primary.main,
          //     boxShadow: `${palette.primary.main} 0 0 0 2px`
          //   }
          // },
          // [`&.${filledInputClasses.error}`]: {
          //   [`& .${outlinedInputClasses.notchedOutline}`]: {
          //     borderColor: palette.error.main,
          //     boxShadow: `${palette.error.main} 0 0 0 2px`
          //   }
          // }
        },
        input: {
          fontSize: 14,
          fontWeight: 500,
          lineHeight: '24px',
        },
        notchedOutline: {
          borderColor: palette.neutral[200],
          transition: muiTheme.transitions.create([
            'border-color',
            'box-shadow'
          ])
        }
      }
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: 500,
          [`&.${inputLabelClasses.filled}`]: {
            transform: 'translate(12px, 18px) scale(1)'
          },
          [`&.${inputLabelClasses.shrink}`]: {
            [`&.${inputLabelClasses.standard}`]: {
              transform: 'translate(0, -1.5px) scale(0.85)'
            },
            [`&.${inputLabelClasses.filled}`]: {
              transform: 'translate(12px, 6px) scale(0.85)'
            },
            [`&.${inputLabelClasses.outlined}`]: {
              transform: 'translate(14px, -9px) scale(0.85)'
            }
          }
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: 14,
          fontWeight: 500,
          lineHeight: 1.71,
          minWidth: 'auto',
          paddingLeft: 0,
          paddingRight: 0,
          textTransform: 'none',
          '& + &': {
            marginLeft: 24
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: palette.divider,
          padding: '15px 16px'
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          borderBottom: 'none',
          [`& .${tableCellClasses.root}`]: {
            borderBottom: 'none',
            backgroundColor: palette.neutral[50],
            color: palette.neutral[700],
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: 0.5,
            textTransform: 'uppercase'
          },
          [`& .${tableCellClasses.paddingCheckbox}`]: {
            paddingTop: 4,
            paddingBottom: 4
          }
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'filled'
      }
    }
  };
}
