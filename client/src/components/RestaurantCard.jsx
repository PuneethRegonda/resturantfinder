import React, { useEffect, useState } from 'react';
import { getPlacePhotos } from '../services/restaurantService';
import { Card, Box, Typography, Chip, Button, Rating } from '@mui/material';
import { Link } from 'react-router-dom';
const RestaurantCard = ({ restaurant, showCheckbox, onCheckboxChange, isChecked }) => {
  const [photoUrls, setPhotoUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Current image index
  const [imageList, setImageList] = useState([]); // Images from images.json
  useEffect(() => {
    // Fetch the images.json file
    fetch('../../images.json') // Update the path based on your file location
      .then((response) => response.json())
      .then((data) => {
        setImageList(data.images.map((img) => img.image_url));
      })
      .catch((err) => console.error('Error fetching images.json:', err));
  }, []);

  useEffect(() => {
    if (restaurant.id && imageList.length > 0) {
      // Assign an image to the restaurant based on its index (or other logic)
      const imgIndex = restaurant.id % imageList.length; // Example: Modulo to cycle through images
      restaurant.img = imageList[imgIndex];
    }
  }, [restaurant, imageList]);

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
      {showCheckbox && (
        <Checkbox
          checked={isChecked}
          onChange={() => onCheckboxChange(restaurant.id)}
        />
      )}
      
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
          <img
            src={restaurant.img}
            alt={restaurant.name}
            style={{
              width: '200px',
              height: '200px',
              objectFit: 'cover',
            }}
          />

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
      <Typography 
          variant="h6" 
          sx={{ fontWeight: 'bold', marginBottom: 1 }}
          component={Link}
          to={`/restaurant/${restaurant.id}/${encodeURIComponent(restaurant.name)}`}
          state={{ id: restaurant.id, name: restaurant.name }}
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
          />
          <Typography
            variant="body2"
            sx={{ marginLeft: 1, color: '#757575', fontSize: '0.875rem' }}
          >
            {restaurant.rating} ({restaurant.user_ratings_total} reviews)
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
          sx={{ color: 'green', fontWeight: 'bold', marginBottom: 1 }}
        >
          Opens in 33 min
        </Typography>
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
