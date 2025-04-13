import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
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

function App() {
  const [cart, setCart] = useState([]);

  return (
    <Router>
      <Header cart={cart} />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route
          path="/restaurant/:id"
          render={(props) => <RestaurantPage {...props} cart={cart} setCart={setCart} />}
        />
        <Route
          path="/checkout"
          render={() => <CheckoutPage cart={cart} setCart={setCart} />}
        />
      </Switch>
    </Router>
  );
}

export default App;
