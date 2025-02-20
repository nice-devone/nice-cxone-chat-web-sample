import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { createTheme, CssBaseline } from '@mui/material';
import { Root } from './Root';

const root = document.getElementById('root') as HTMLElement;
const theme = createTheme({});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Root />
  </ThemeProvider>,
  root,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
