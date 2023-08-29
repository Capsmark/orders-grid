// ** Type Imports
import { PaletteMode } from '@mui/material'

const DefaultPalette = (mode: PaletteMode) => {

  return {
    primary: {
      main: '#191919',
      contrastText: '#FFF'
    },
    error: {
      light: '#ED6F70',
      main: '#EA5455',
      dark: '#CE4A4B',
      contrastText: '#FFF'
    },
  }

}

export default DefaultPalette