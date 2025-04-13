import React, { useEffect, useState } from 'react';
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
  Box
} from '@material-ui/core';
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
}));

export default function RestaurantPage() {
  const classes = useStyles();
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const [restaurantRes, menuRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/restaurants/${id}`),
          axios.get(`http://localhost:5000/api/restaurants/${id}/menu`),
        ]);
        
        // Ensure prices are numbers
        const menuWithNumericPrices = menuRes.data.map(item => ({
          ...item,
          price: Number(item.price)
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  const formatPrice = (price) => {
    // Handle cases where price might not be a number
    const numericPrice = Number(price);
    return isNaN(numericPrice) ? 'Price unavailable' : `$${numericPrice.toFixed(2)}`;
  };

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
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}