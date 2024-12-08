import React, { useEffect, useState } from "react";
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

const RestaurantListPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  // Fetch restaurants from API
  useEffect(() => {
    const authToken = localStorage.getItem("authToken"); // Retrieve token from localStorage

    fetch("/api/owner/restaurants", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`, // Use token dynamically
        "X-Request-ID": "unique_request_id", // Replace with a dynamically generated request ID if needed
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setRestaurants(data.data); // Set restaurants from API response
        } else {
          console.error("Failed to fetch restaurants:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
      });
  }, []);

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  const handleEditClick = (restaurantId) => {
    navigate(`/edit/${restaurantId}`);
  };

  const handleAddRestaurantClick = () => {
    navigate("/business");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear token on logout
    localStorage.removeItem("userRoles"); // Clear roles on logout
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
          {restaurants.map((restaurant) => (
            <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
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
                <CardActionArea
                  onClick={() => handleRestaurantClick(restaurant.id)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      restaurant.iconUrl
                    }
                    alt={restaurant.name}
                    sx={{
                      borderRadius: "8px 8px 0 0",
                    }}
                  />
                  <CardContent sx={{ padding: "16px" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {restaurant.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ marginBottom: "8px" }}
                    >
                      {restaurant.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Phone: {restaurant.phoneNumber || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Website:{" "}
                      <a
                        href={restaurant.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {restaurant.website}
                      </a>
                    </Typography>
                  </CardContent>
                </CardActionArea>

                <Box
                  sx={{
                    padding: "8px 16px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(restaurant.id);
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
