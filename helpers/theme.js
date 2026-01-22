import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// https://colorhunt.co/palette/264401
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#88181B',
    },
    secondary: {
      main: '#FCC616',
    },
    default: {
      main: '#ffc93c',
    },
    error: {
      main: '#fb3640',
    },
    background: {
      default: '#fff',
    },
  },
  // typography: {
  //   fontFamily: [
  //     'Poppins'
  //   ].join(','),
  // },
});

export default theme;
