import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Divider,
  Rating,
  Avatar,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { getRestaurantDetails } from '../../services/restaurantService';

const RestaurantPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);

  const placeholderImage = "https://via.placeholder.com/800x400?text=Restaurant+Image"; // Online placeholder image

  useEffect(() => {
    getRestaurantDetails(id)
      .then((response) => {
        console.log('API Response:', response);
        if (response?.name) {
          setRestaurant(response);
          setReviews(response.reviews || []);
        } else {
          setRestaurant(null);
        }
      })
      .catch((error) => {
        console.error('Error fetching restaurant details:', error);
        setRestaurant(null);
      });
  }, [id]);

  if (!restaurant) {
    return <Typography variant="h6">Invalid restaurant data.</Typography>;
  }

  const {
    name,
    businessStatus,
    rating,
    userRatingsTotal,
    vicinity,
    details,
    categories,
    operatingHours,
    iconUrl,
  } = restaurant;

  return (
    <Box sx={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '40px',
        }}
      >
        <Avatar src={iconUrl} alt={name} sx={{ width: 80, height: 80, marginRight: '20px' }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {businessStatus} - {vicinity}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ marginBottom: '40px' }} />

      {/* Details Section */}
      <Grid container spacing={4} sx={{ marginBottom: '40px' }}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              padding: '20px',
              borderRadius: '16px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              height: '100%',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
              Details
            </Typography>
            <Typography>Cuisine: {details?.cuisineType || 'N/A'}</Typography>
            <Typography>Phone: {details?.phoneNumber || 'N/A'}</Typography>
            <Typography>
              Website:{' '}
              <Button
                variant="text"
                color="primary"
                href={details?.website}
                sx={{ textTransform: 'none', padding: '0' }}
              >
                Visit
              </Button>
            </Typography>
            <Typography>
              Vegetarian Options: {details?.isVegetarian ? 'Yes' : 'No'}
            </Typography>
            <Typography>Vegan Options: {details?.isVegan ? 'Yes' : 'No'}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              padding: '20px',
              borderRadius: '16px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              height: '100%',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
              Operating Hours
            </Typography>
            {operatingHours.map((hours) => (
              <Typography key={hours.id}>
                Day {hours.dayOfWeek}: {hours.openTime} - {hours.closeTime}
              </Typography>
            ))}
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ marginBottom: '40px' }} />

      {/* Categories Section */}
      <Box sx={{ marginBottom: '40px' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
          Categories
        </Typography>
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            sx={{
              marginRight: '10px',
              marginBottom: '10px',
              borderRadius: '8px',
              padding: '4px 8px',
            }}
          />
        ))}
      </Box>

      <Divider sx={{ marginBottom: '40px' }} />

      {/* Reviews Section */}
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
          Reviews
        </Typography>
        <Grid container spacing={4}>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    display: 'flex',
                    padding: '20px',
                    alignItems: 'center',
                    borderRadius: '16px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Avatar sx={{ width: 56, height: 56, marginRight: '20px' }}>
                    {review.userName ? review.userName.charAt(0) : '?'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {review.userName || 'Anonymous'}
                    </Typography>
                    <Rating value={review.rating} readOnly />
                    <Typography variant="body2">{review.reviewText}</Typography>
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>No reviews yet.</Typography>
          )}
        </Grid>
      </Box>

      <Divider sx={{ marginTop: '40px', marginBottom: '40px' }} />

      {/* Online Placeholder Image Section */}
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
          Explore the Ambiance
        </Typography>
        <Card
          sx={{
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <CardMedia
            component="img"
            image={placeholderImage}
            alt="Restaurant Placeholder"
            height="400"
          />
        </Card>
      </Box>
    </Box>
  );
};

export default RestaurantPage;
