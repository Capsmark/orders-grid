import { ReactNode } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

import palette from './palette';
import breakpoints from './breakpoints';

interface Props {
  children: ReactNode;
}

const ThemeComponent = (props: Props) => {
  // ** Props
  const { children } = props;

  const theme = createTheme({
    palette: palette('light'),
    typography: {},
    breakpoints: breakpoints(),
    components: {},
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default ThemeComponent;
