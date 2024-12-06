import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  Chip,
  Divider,
  Rating,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { getRestaurantDetails } from '../../services/restaurantService';

const RestaurantPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, text: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const placeholderImage = "https://via.placeholder.com/800x400?text=Restaurant+Image"; // Online placeholder image

  useEffect(() => {
    // Check login status on page load
    const token = localStorage.getItem('authToken');
    console.log('Token in localStorage:', token); // Debug token
    setIsLoggedIn(Boolean(token)); // Update login status based on token

    getRestaurantDetails(id)
      .then((response) => {
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

  const handleOpenReviewDialog = () => {
    if (isLoggedIn) {
      setIsReviewDialogOpen(true);
    }
  };

  const handleCloseReviewDialog = () => {
    setIsReviewDialogOpen(false);
    setNewReview({ rating: 0, text: '' });
  };

  const handleSubmitReview = () => {
    if (newReview.rating > 0 && newReview.text.trim()) {
      setReviews((prev) => [
        ...prev,
        { userName: 'You', rating: newReview.rating, reviewText: newReview.text },
      ]);
      handleCloseReviewDialog();
    } else {
      alert('Please provide a rating and review text!');
    }
  };

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
    <Box sx={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      {/* Write a Review Button */}
      <Button
        variant="contained"
        color="primary"
        disabled={!isLoggedIn} // Disable if user is not logged in
        sx={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          borderRadius: '20px',
          cursor: isLoggedIn ? 'pointer' : 'not-allowed',
          opacity: isLoggedIn ? 1 : 0.6,
        }}
        onClick={handleOpenReviewDialog}
      >
        Write a Review
      </Button>

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

      {/* Write a Review Dialog */}
      <Dialog open={isReviewDialogOpen} onClose={handleCloseReviewDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Rating
              value={newReview.rating}
              onChange={(e, newValue) => setNewReview((prev) => ({ ...prev, rating: newValue }))}
            />
            <TextField
              label="Write your review"
              multiline
              rows={4}
              value={newReview.text}
              onChange={(e) => setNewReview((prev) => ({ ...prev, text: e.target.value }))}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSubmitReview}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RestaurantPage;
