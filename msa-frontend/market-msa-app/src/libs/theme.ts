import { createTheme } from '@mui/material/styles';

export const palette = {
  navy: '#102a43',
  navyDark: '#061727',
  sky: '#38bdf8',
  skyDark: '#0ea5e9',
  surface: '#f8fafc',
  border: '#e2e8f0',
  muted: '#64748b',
} as const;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: palette.skyDark, dark: palette.navy, light: palette.sky },
    secondary: { main: palette.navy },
    background: { default: palette.surface, paper: '#ffffff' },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'sans-serif',
    ].join(','),
  },
  shape: { borderRadius: 8 },
});

export default theme;
