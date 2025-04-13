import React from 'react';
import { Typography, Container, Button } from '@material-ui/core';

export default function CheckoutPage() {
  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Checkout
      </Typography>
      <Typography variant="body1">
        Body
      </Typography>
      <Button variant="contained" color="primary">
        Place Order
      </Button>
    </Container>
  );
}