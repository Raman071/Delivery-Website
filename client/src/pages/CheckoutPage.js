import React, { useState } from 'react';

export default function CheckoutPage({ cart, setCart }) {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    setCart([]); // Clear the cart
    setOrderPlaced(true);

    // Show snackbar after a brief delay
    setTimeout(() => {
      setOpenSnackbar(true);
    }, 300);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Checkout</h3>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <h5>Your Items</h5>
          {cart.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <p>{item.name}</p>
              <p>{`Quantity: ${item.quantity}`}</p>
              <p>{`$${(item.price * item.quantity).toFixed(2)}`}</p>
            </div>
          ))}

          <hr style={{ margin: '20px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <h6>Total Price</h6>
            <h6>{`$${totalPrice.toFixed(2)}`}</h6>
          </div>

          <button onClick={handlePlaceOrder}>Place Order</button>
        </>
      )}

      {orderPlaced && openSnackbar && (
        <div style={{ marginTop: '20px', color: 'green' }}>
          <strong>Order placed successfully!</strong>
        </div>
      )}
    </div>
  );
}
