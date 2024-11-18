import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Rating, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const WriteReviewForm = ({ restaurantName, onClose, onSubmitReview }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [ratingError, setRatingError] = useState("");
  const [reviewTextError, setReviewTextError] = useState("");

  const handleSubmit = () => {
    let isValid = true;

    // Validation for rating
    if (reviewText.trim().length > 0 && rating === 0) {
      setRatingError("Please add a star rating to complete your review.");
      isValid = false;
    } else {
      setRatingError("");
    }

    // Validation for review text
    if (reviewText.trim().length > 0 && reviewText.trim().length < 85) {
      setReviewTextError("Your review needs at least 85 characters. Add a few thoughts to post review.");
      isValid = false;
    } else {
      setReviewTextError("");
    }

    if (isValid) {
      onSubmitReview({ rating, reviewText });
      onClose(); // Close the dialog after posting the review
    }
  };

  return (
    <Box sx={{ padding: 6, maxWidth: 800, margin: '0 auto', position: 'relative' }}>
      <IconButton
        sx={{ position: 'absolute', top: 10, right: 10 }}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>

      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 4 }}>
        Your review for {restaurantName}
      </Typography>

      <Typography variant="body1" sx={{ fontSize: '1.2rem', marginBottom: 2 }}>
        How would you rate your experience?
      </Typography>
      <Rating
        name="experience-rating"
        value={rating}
        onChange={(e, newValue) => setRating(newValue)}
        sx={{ marginBottom: 1, fontSize: '2rem' }}
      />
      {ratingError && (
        <Typography variant="body2" color="error" sx={{ marginBottom: 3 }}>
          {ratingError}
        </Typography>
      )}

      <Typography variant="body1" sx={{ fontSize: '1.2rem', marginBottom: 2 }}>
        Tell us about your experience
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: 1, color: 'text.secondary' }}>
        A few things to consider in your review: Food, Service, Ambiance
      </Typography>
      <TextField
        placeholder="Start your review..."
        variant="outlined"
        fullWidth
        multiline
        rows={6}
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      {reviewTextError && (
        <Typography variant="body2" color="error" sx={{ marginBottom: 3 }}>
          {reviewTextError}
        </Typography>
      )}

      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        sx={{
          backgroundColor: '#d32323', // Red color to match the login button
          color: '#fff', // Text color should be white
          marginBottom: 2,
          paddingY: 1.5, // Increase button height
          fontSize: '1.1rem', // Make button text larger
          ':hover': {
            backgroundColor: '#b51e1e', // Darker shade on hover
          },
        }}
      >
        Post Review
      </Button>
    </Box>
  );
};

export default WriteReviewForm;
