import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  media: {
    height: 300,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    marginBottom: theme.spacing(2),
  },
  section: {
    marginBottom: theme.spacing(4),
  },
  menuItem: {
    marginBottom: theme.spacing(2),
  },
  price: {
    fontWeight: 600,
    color: theme.palette.primary.main,
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepper: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function RestaurantPage({ cart, setCart }) {
  const classes = useStyles();
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const [restaurantRes, menuRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/restaurants/${id}`),
          axios.get(`http://localhost:5000/api/restaurants/${id}/menu`),
        ]);

        const menuWithNumericPrices = menuRes.data.map(item => ({
          ...item,
          price: Number(item.price),
        }));

        setRestaurant(restaurantRes.data);
        setMenuItems(menuWithNumericPrices);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id]);

  const handleOpenDialog = (item) => {
    setSelectedItem(item);
    setQuantity(1); // Reset quantity to 1 each time a new item is selected
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleAddToCart = () => {
    if (selectedItem) {
      const updatedItem = {
        ...selectedItem,
        quantity: Number(quantity), // Ensure quantity is treated as a number
        totalPrice: selectedItem.price * Number(quantity), // Ensure correct calculation
      };

      setCart((prevCart) => [...prevCart, updatedItem]);
      handleCloseDialog();
    }
  };

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const formatPrice = (price) => {
    const numericPrice = Number(price);
    return isNaN(numericPrice) ? 'Price unavailable' : `$${numericPrice.toFixed(2)}`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  return (
    <Container className={classes.root}>
      <div
        className={classes.media}
        style={{ backgroundImage: `url(${restaurant.image_url || 'https://source.unsplash.com/random/800x400/?restaurant'})` }}
      />

      <Typography variant="h3" gutterBottom>
        {restaurant.name}
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        {restaurant.cuisine_type} • {restaurant.location} • ⭐ {restaurant.rating} • {restaurant.delivery_time}
      </Typography>

      <Divider className={classes.section} />

      <Typography variant="h4" gutterBottom>
        Menu
      </Typography>

      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid item xs={12} sm={6} key={item.id}>
            <Card className={classes.menuItem} elevation={2}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {item.name}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="textSecondary">
                    {item.description}
                  </Typography>
                  <Typography variant="h6" className={classes.price}>
                    {formatPrice(item.price)}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginTop: '10px' }}
                  fullWidth
                  onClick={() => handleOpenDialog(item)}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quantity Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Select Quantity</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h6">{selectedItem?.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {formatPrice(selectedItem?.price)} per item
            </Typography>
            <Box className={classes.quantityControls} mt={2}>
              <IconButton onClick={handleDecrement} color="primary">
                <Remove />
              </IconButton>
              <Typography variant="h6" style={{ margin: '0 15px' }}>
                {quantity}
              </Typography>
              <IconButton onClick={handleIncrement} color="primary">
                <Add />
              </IconButton>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddToCart} color="primary">
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
