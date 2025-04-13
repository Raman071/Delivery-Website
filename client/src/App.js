import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import HomePage from './pages/HomePage';
import RestaurantPage from './pages/RestaurantPage';
import CheckoutPage from './pages/CheckoutPage';
import Header from './components/Header';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ff5722',
    },
    secondary: {
      main: '#ff9800',
    },
  },
  typography: {
    fontWeightBold: 700,
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/restaurant/:id" component={RestaurantPage} />
          <Route path="/checkout" component={CheckoutPage} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
};

export default App;  // This is the crucial line