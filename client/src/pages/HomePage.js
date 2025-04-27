import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
  Grid, 
  Card, 
  CardActionArea, 
  CardContent, 
  CardMedia, 
  Typography, 
  Container,
  CircularProgress,
  Chip,
  Box,
  Button,
  TextField
} from '@material-ui/core';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Star, AccessTime, LocationOn } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  hero: {
    backgroundImage: 'url(https://t3.ftcdn.net/jpg/02/52/12/40/360_F_252124067_aCtp9ZD934RboKmjJzkXiwYDL7XkNjpn.jpg)',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: '70vh',
    minHeight: '450px',
    position: 'relative',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0 0 20px 20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
    marginBottom: theme.spacing(8),
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1,
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: theme.spacing(4),
    borderRadius: 12,
    backdropFilter: 'blur(5px)',
    maxWidth: 800,
  },
  heroButton: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(1.5, 5),
    fontSize: '1.1rem',
    borderRadius: '30px',
    textTransform: 'none',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  sectionTitle: {
    marginBottom: theme.spacing(5),
    fontWeight: 700,
    textAlign: 'center',
    color: '#333',
    position: 'relative',
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: -10,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80px',
      height: '4px',
      backgroundColor: theme.palette.primary.main,
      borderRadius: 2,
    },
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: '0 16px 32px rgba(0,0,0,0.15)',
    },
  },
  media: {
    height: 200,
  },
  restaurantName: {
    fontWeight: 600,
    fontSize: '1.1rem',
    color: '#333',
  },
  chip: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    fontWeight: 500,
    backgroundColor: theme.palette.primary.light,
    color: '#fff',
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    color: '#666',
  },
  infoIcon: {
    marginRight: theme.spacing(0.5),
    fontSize: '1.1rem',
    color: theme.palette.primary.main,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '300px',
  },
  filterContainer: {
    marginBottom: theme.spacing(4),
    textAlign: 'center',
  },
  filterButton: {
    margin: theme.spacing(0.5),
    borderRadius: 20,
    textTransform: 'none',
  },
}));

export default function HomePage() {
  const classes = useStyles();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/restaurants');
        setRestaurants(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          restaurant.cuisine_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? restaurant.cuisine_type === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Fast Food', 'Vegetarian', 'Desserts', 'Asian', 'Mexican', 'Healthy'];

  return (
    <div>
      {/* Hero Section */}
      <div className={classes.hero}>
        <div className={classes.overlay}></div>
        <div className={classes.heroContent}>
          <Typography variant="h2" component="h1" gutterBottom style={{ fontWeight: 700 }}>
            Discover the Best Food in Town
          </Typography>
          <Typography variant="h5" gutterBottom>
            Order from your favorite restaurants with just a few clicks
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            className={classes.heroButton}
            component={Link}
            to="/restaurant/1"
          >
            Order Now
          </Button>
        </div>
      </div>

      {/* Search and Category Filter Section */}
      <Container maxWidth="lg">
        <div className={classes.filterContainer}>
          <TextField
            label="Search restaurants"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Category Buttons */}
          {categories.map((category) => (
            <Button 
              key={category}
              variant={selectedCategory === category ? "contained" : "outlined"}
              color="primary"
              className={classes.filterButton}
              onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Restaurants Section */}
        <Typography variant="h4" className={classes.sectionTitle}>
          Popular Restaurants
        </Typography>

        {loading ? (
          <div className={classes.loadingContainer}>
            <CircularProgress color="primary" size={60} />
          </div>
        ) : (
          <Grid container spacing={4}>
            {filteredRestaurants.map((restaurant) => (
              <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
                <Card className={classes.card} elevation={3}>
                  <CardActionArea component={Link} to={`/restaurant/${restaurant.id}`}>
                    <CardMedia
                      className={classes.media}
                      image={restaurant.image_url || 'https://source.unsplash.com/random/300x200/?restaurant,food'}
                      title={restaurant.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="h2" className={classes.restaurantName}>
                        {restaurant.name}
                      </Typography>

                      <Chip 
                        label={restaurant.cuisine_type} 
                        size="small" 
                        color="secondary" 
                        className={classes.chip}
                      />

                      <Box className={classes.infoContainer}>
                        <Star color="primary" className={classes.infoIcon} />
                        <Typography variant="body2" color="textSecondary">
                          {restaurant.rating}
                        </Typography>
                      </Box>

                      <Box className={classes.infoContainer}>
                        <AccessTime className={classes.infoIcon} />
                        <Typography variant="body2" color="textSecondary">
                          {restaurant.delivery_time}
                        </Typography>
                      </Box>

                      <Box className={classes.infoContainer}>
                        <LocationOn className={classes.infoIcon} />
                        <Typography variant="body2" color="textSecondary">
                          {restaurant.location}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
}
