import React, { useEffect, useState } from 'react';
import { getPhotoUrl } from '../services/restaurantService'; // This function will generate the full photo URL based on the reference
import { Card, CardContent, CardActions, Button, Typography, Rating, Box, Chip, Grid2 } from '@mui/material';
import { Link } from 'react-router-dom'; 
const RestaurantCard = ({ restaurant }) => {
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    // Construct the photo URL using the photoReference from the restaurant data
    if (restaurant.photos && restaurant.photos.length > 0) {
      const photoReference = restaurant.photos[0].photo_reference;
      const url = getPhotoUrl(photoReference);
      setPhotoUrl(url);
    } else {
      setPhotoUrl('https://via.placeholder.com/400'); // Set placeholder if no photo is available
    }
  }, [restaurant.photos]);

  return (
    <Card variant="outlined" sx={{ marginBottom: 2, borderRadius: 2, padding: 2 }}>
      <CardContent sx={{ paddingBottom: '8px !important' }}>
        <Grid2 container spacing={2}>
          {/* Image Section */}
          <Grid2 item xs={12} sm={4}>
            <img
              src={photoUrl}
              alt={restaurant.name}
              width="100%"
              height="auto"
              style={{ borderRadius: 8 }}
            />
          </Grid2>

          {/* Restaurant Details Section */}
          <Grid2 item xs={12} sm={8}>
            {/* Restaurant Name and Rating */}
            <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 1 }}>
            <Typography
              variant="h6"
              component={Link}  
              to={`/restaurant/${restaurant.name.replace(/\s+/g, '-')}`} 
              target='_blank_'
              sx={{ textDecoration: 'none', color: 'inherit' }}  
            >
              {restaurant.name}
            </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 0.5 }}>
                <Rating name="read-only" value={restaurant.rating} readOnly precision={0.1} size="small" />
                <Typography variant="body2" component="span" sx={{ marginLeft: 1, fontSize: '0.875rem', color: '#555' }}>
                  {restaurant.rating} ({restaurant.user_ratings_total} reviews)
                </Typography>
              </Box>
            </Box>

            {/* Tags (Types) */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, marginBottom: 1 }}>
              {restaurant.types && restaurant.types.slice(0, 3).map((type, index) => (
                <Chip key={index} label={type} variant="outlined" size="small" />
              ))}
            </Box>

            {/* Address */}
            <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
              {restaurant.vicinity}
            </Typography>

            {/* Description or Additional Info */}
            <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1, fontStyle: 'italic', fontSize: '0.875rem' }}>
              {/* Add a description if available, otherwise add any placeholder text */}
              {restaurant.description ? restaurant.description : "Great place to enjoy delicious food and cozy atmosphere."}
            </Typography>
          </Grid2>
        </Grid2>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', paddingTop: 0 }}>
        {/* Additional action button like 'Start Order' */}
        {restaurant.delivery && (
          <Button size="small" variant="contained" color="primary">
            Start Order
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default RestaurantCard;
