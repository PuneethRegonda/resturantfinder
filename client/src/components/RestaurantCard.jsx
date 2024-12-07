import React, { useEffect, useState } from 'react';
import { getPlacePhotos } from '../services/restaurantService';
import { Card, Box, Typography, Chip, Button, Rating } from '@mui/material';
import { Link } from 'react-router-dom';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
const RestaurantCard = ({ restaurant }) => {
  const [photoUrls, setPhotoUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Current image index

  useEffect(() => {
    if (restaurant.place_id) {
      getPlacePhotos(restaurant.place_id, 200)
        .then((urls) => setPhotoUrls(urls))
        .catch(() => setPhotoUrls(['https://via.placeholder.com/400']));
    }
  }, [restaurant.place_id]);

  // Handle showing the next image
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % photoUrls.length);
  };

  // Handle showing the previous image
  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? photoUrls.length - 1 : prevIndex - 1
    );
  };

  return (
    <Card
      sx={{
        display: 'flex',
        padding: 2,
        borderRadius: '8px',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        marginBottom: 2,
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: '8px',
          overflow: 'hidden',
          flexShrink: 0,
          marginRight: 2,
        }}
      >
        {/* Image */}
        {photoUrls.length > 0 && (
          <img
            src={photoUrls[currentImageIndex]}
            alt={`Restaurant ${currentImageIndex + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        {/* Previous and Next Buttons */}
        <Button
  onClick={handlePreviousImage}
  disabled={currentImageIndex === 0} // Disable button if at the first image
  size="small"
  sx={{
    position: 'absolute',
    top: '50%',
    left: '10px',
    transform: 'translateY(-50%)',
    backgroundColor: currentImageIndex === 0 ? '#f0f0f0' : 'white',
    color: currentImageIndex === 0 ? '#d0d0d0' : 'black',
    borderRadius: '50%',
    minWidth: '32px', // Oval width
    minHeight: '32px', // Oval height
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: currentImageIndex === 0 ? 'none' : '0 2px 4px rgba(0,0,0,0.2)',
    zIndex: 2,
    border: '1px solid #dcdcdc',
    '&:hover': {
      backgroundColor: currentImageIndex === 0 ? '#f0f0f0' : '#f7f7f7',
    },
  }}
>
  &lt;
</Button>

<Button
  onClick={handleNextImage}
  disabled={currentImageIndex === photoUrls.length - 1} // Disable button if at the last image
  size="small"
  sx={{
    position: 'absolute',
    top: '50%',
    right: '10px',
    transform: 'translateY(-50%)',
    backgroundColor: currentImageIndex === photoUrls.length - 1 ? '#f0f0f0' : 'white',
    color: currentImageIndex === photoUrls.length - 1 ? '#d0d0d0' : 'black',
    borderRadius: '50%',
    minWidth: '32px', // Oval width
    minHeight: '32px', // Oval height
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: currentImageIndex === photoUrls.length - 1 ? 'none' : '0 2px 4px rgba(0,0,0,0.2)',
    zIndex: 2,
    border: '1px solid #dcdcdc',
    '&:hover': {
      backgroundColor: currentImageIndex === photoUrls.length - 1 ? '#f0f0f0' : '#f7f7f7',
    },
  }}
>
  &gt;
</Button>
      </Box>

      {/* Content Section */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1, color:'Black',textDecoration: "none" ,'&:hover': {
      textDecoration: 'underline'
    }}}
         component={Link}
         to={`/restaurant/${restaurant.name.replace(/\s+/g, '-')}`}
         target="_blank"
        >
          {restaurant.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
          <Rating
            name="read-only"
            value={restaurant.rating}
            readOnly
            size="small"
            precision={0.5}
            bold
          />
           <Typography
    variant="body2"
    sx={{ marginLeft: 1, fontSize: '0.875rem' }}
  >
    <Box component="span" sx={{ fontWeight: 'bold' }}>
      {restaurant.rating}
    </Box>{' '}
    <Box component="span" sx={{ color: '#757575' }}>
      ({restaurant.user_ratings_total} reviews)
    </Box>
  </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
      {/* Location Icon and Vicinity */}
      <RoomOutlinedIcon sx={{ fontSize: '1rem' }} />
      <Typography variant="body2" sx={{ marginLeft: 0.5, color: '#333', fontSize: '0.875rem' }}>
        {restaurant.vicinity}
      </Typography>
      
      {/* Dot Separator */}
      <Typography variant="body2" sx={{ margin: '0 8px', color: '#333' }}>•</Typography>

      {/* Price Level */}
      <Typography variant="body2" sx={{ color: '#333', fontSize: '0.875rem' }}>
        {'$'.repeat(restaurant.price_level)}
      </Typography>

      {/* Dot Separator */}
      <Typography variant="body2" sx={{ margin: '0 8px', color: '#333' }}>•</Typography>

      {/* Opening Hours */}
      <Typography
        variant="body2"
        sx={{
          color: restaurant.opening_hours?.open_now ? 'green' : 'red',
          fontWeight: 'bold',
          fontSize: '0.875rem',
        }}
      >
        {restaurant.opening_hours?.open_now ? 'Open' : 'Closed'}
      </Typography>
    </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, marginBottom: 1 }}>
          {restaurant.types &&
            restaurant.types.slice(0, 2).map((type, index) => (
              <Chip
                key={index}
                label={type}
                variant="outlined"
                size="small"
                sx={{ fontSize: '0.75rem', color: '#757575' }}
              />
            ))}
          <Chip label="$$" variant="outlined" size="small" sx={{ fontSize: '0.75rem', color: '#757575' }} />
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: '#757575',
            fontSize: '0.875rem',
            marginBottom: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          “Pick up your favorite holiday menu item or try something new. Order
          on the Starbucks® app & pick up today.”
        </Typography>

        <Button
          variant="outlined"
          sx={{
            textTransform: 'none',
            fontWeight: 'bold',
            borderRadius: '8px',
          }}
        >
          Get Directions
        </Button>
      </Box>
    </Card>
  );
};

export default RestaurantCard;
