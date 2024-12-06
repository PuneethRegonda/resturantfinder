import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit"; // Icon for edit button
import BusinessOwnerHeader from "../../components/BusinessOwnerHeader";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";

const restaurantData = [
  {
    name: "Restaurant 1",
    rating: 4.5,
    user_ratings_total: 120,
    formatted_address: "123 Main St, City, State, 12345",
    photos: ["https://via.placeholder.com/300"],
  },
  {
    name: "Restaurant 2",
    rating: 4.0,
    user_ratings_total: 100,
    formatted_address: "456 Oak St, City, State, 67890",
    photos: ["https://via.placeholder.com/300"],
  },
];

const RestaurantListPage = () => {
  const [restaurants] = useState(restaurantData);
  const navigate = useNavigate();

  const handleRestaurantClick = (restaurantName) => {
    navigate(`/restaurant`);
  };

  const handleEditClick = (restaurantName) => {
    navigate(`/edit`);
  };

  const handleAddRestaurantClick = () => {
    navigate("/business");
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear token on logout
    localStorage.removeItem('userRoles'); // Clear token on logout

    navigate("/");
  };

  return (
    <>
      <BusinessOwnerHeader
        buttonText="Add Restaurant"
        onClick={handleAddRestaurantClick}
        onLogout={handleLogout}
      />

      <Box sx={{ padding: "20px" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
          My Restaurants
        </Typography>

        <Grid container spacing={2}>
          {restaurants.map((restaurant, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  borderRadius: "8px",
                  boxShadow: 3,
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea onClick={() => handleRestaurantClick(restaurant.name)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={restaurant.photos[0] || "default_image.jpg"}
                    alt={restaurant.name}
                    sx={{
                      borderRadius: "8px 8px 0 0",
                    }}
                  />
                  <CardContent sx={{ padding: "16px" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {restaurant.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ marginBottom: "8px" }}>
                      Rating: {restaurant.rating} ({restaurant.user_ratings_total} reviews)
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {restaurant.formatted_address}
                    </Typography>
                  </CardContent>
                </CardActionArea>

                <Box sx={{ padding: "8px 16px", display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(restaurant.name);
                    }}
                    sx={{
                      textTransform: "none",
                      fontSize: 16,
                      padding: "6px 16px",
                      backgroundColor: "#d32323",
                      color: "#ffffff",
                      borderRadius: "4px",
                      "&:hover": {
                        backgroundColor: "#b81e1e",
                      },
                    }}
                  >
                    Edit
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Footer />
    </>
  );
};

export default RestaurantListPage;
