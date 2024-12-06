import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import BusinessOwnerHeader from "../../components/BusinessOwnerHeader";
import Footer from "../../components/Footer";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useNavigate } from "react-router-dom";

const BusinessHome = () => {
  const navigate = useNavigate();
  const [restaurantDetails, setRestaurantDetails] = useState({
    name: "",
    address: {
      streetAddress: "",
      aptSuiteOther: "",
      city: "",
      state: "",
      country: "",
      zipcode: "",
    },
    contact: "",
    hours: {
      Monday: { open: null, close: null },
      Tuesday: { open: null, close: null },
      Wednesday: { open: null, close: null },
      Thursday: { open: null, close: null },
      Friday: { open: null, close: null },
      Saturday: { open: null, close: null },
      Sunday: { open: null, close: null },
    },
    description: "",
    photos: [],
    cuisine: [],
    price: "",
    foodType: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in restaurantDetails.address) {
      setRestaurantDetails((prevState) => ({
        ...prevState,
        address: {
          ...prevState.address,
          [name]: value,
        },
      }));
    } else {
      setRestaurantDetails((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleHoursChange = (day, field, newValue) => {
    if (!newValue) return;

    const timeString = newValue.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    setRestaurantDetails((prevState) => ({
      ...prevState,
      hours: {
        ...prevState.hours,
        [day]: {
          ...prevState.hours[day],
          [field]: timeString,
        },
      },
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = e.target.files;
    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append("file", file);
    });

    fetch("/api/photos/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setRestaurantDetails((prevState) => ({
          ...prevState,
          photos: [...prevState.photos, data.photoUrl],
        }));
      })
      .catch((error) => console.error("Error uploading photos:", error));
  };

  const handleSubmit = () => {
    const {
      name,
      address: { streetAddress, aptSuiteOther, city, state, country, zipcode },
      contact,
      hours,
      description,
      cuisine,
      price,
      foodType,
    } = restaurantDetails;

    // Combine address fields into `vicinity`
    const vicinity = `${streetAddress}, ${aptSuiteOther ? aptSuiteOther + ", " : ""}${city}, ${state} ${zipcode}, ${country}`;

    // Transform hours into `operatingHours`
    const dayMap = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 7,
    };

    const operatingHours = Object.entries(hours).reduce((acc, [day, times]) => {
      if (times.open && times.close) {
        acc.push({
          dayOfWeek: dayMap[day],
          openTime: times.open,
          closeTime: times.close,
        });
      }
      return acc;
    }, []);

    // Map price to priceLevel
    const priceLevelMap = { Low: 1, Medium: 2, High: 3 };
    const priceLevel = priceLevelMap[price] || 1;

    // Generate categories
    const categories = [...cuisine, ...foodType];

    // Backend payload
    const payload = {
      name,
      businessStatus: "OPERATIONAL", // Default value
      iconUrl: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png", // Default icon
      priceLevel,
      vicinity,
      description,
      phoneNumber: contact,
      website: restaurantDetails.website,
      cuisineType: cuisine[0] || "General",
      isVegetarian: foodType.includes("Vegetarian"),
      isVegan: foodType.includes("Vegan"),
      categories,
      operatingHours,
      zipcode: restaurantDetails.address.zipcode
    };

    console.log("Payload sent to backend:", payload);

    // Submit to backend
    fetch("/api/restaurants/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((response) => response.json())
      .then((data) => {
        alert("Restaurant added successfully!");
        navigate("/views");
      })
      .catch((error) => {
        console.error("Error adding restaurant:", error);
        alert("Failed to add restaurant.");
      });
  };

  const handleViewRestaurantClick = () => {
    navigate("/views");
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <>
      <BusinessOwnerHeader
        buttonText="View Restaurants"
        onClick={handleViewRestaurantClick}
        onLogout={handleLogout}
      />
      <Box sx={{ display: "flex", flexDirection: "row", gap: "16px", padding: "16px" }}>
        <Box sx={{ flex: 1, padding: "16px", border: "1px solid #e0e0e0", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "16px" }}>
            Add Your Restaurant
          </Typography>
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <TextField label="Restaurant Name" name="name" value={restaurantDetails.name} onChange={handleInputChange} fullWidth required />
            <Typography variant="h6">Address Details</Typography>
            <TextField label="Street Address" name="streetAddress" value={restaurantDetails.address.streetAddress} onChange={handleInputChange} fullWidth required />
            <TextField label="Apt/Suite/Other (optional)" name="aptSuiteOther" value={restaurantDetails.address.aptSuiteOther} onChange={handleInputChange} fullWidth />
            <TextField label="City" name="city" value={restaurantDetails.address.city} onChange={handleInputChange} fullWidth required />
            <TextField label="State" name="state" value={restaurantDetails.address.state} onChange={handleInputChange} fullWidth required />
            <TextField label="Country" name="country" value={restaurantDetails.address.country} onChange={handleInputChange} fullWidth required />
            <TextField label="Zipcode" name="zipcode" value={restaurantDetails.address.zipcode} onChange={handleInputChange} fullWidth required helperText="Enter a valid 5-digit or 9-digit zipcode." />
            <TextField label="Contact Info" name="contact" value={restaurantDetails.contact} onChange={handleInputChange} fullWidth required />
            <TextField  label="Website" name="website"   type="url" value={restaurantDetails.website} onChange={handleInputChange} fullWidth required helperText="Enter the website URL (e.g., https://www.restaurant.com)."/>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Typography variant="h6">Hours of Operation</Typography>
              {Object.keys(restaurantDetails.hours).map((day) => (
                <Box key={day} sx={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                  <Typography variant="body1" sx={{ minWidth: "100px" }}>{day}:</Typography>
                  <TimePicker
                    label="Open"
                    value={restaurantDetails.hours[day].open ? new Date(`1970-01-01T${restaurantDetails.hours[day].open}:00`) : null}
                    onChange={(newValue) => handleHoursChange(day, "open", newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <TimePicker
                    label="Close"
                    value={restaurantDetails.hours[day].close ? new Date(`1970-01-01T${restaurantDetails.hours[day].close}:00`) : null}
                    onChange={(newValue) => handleHoursChange(day, "close", newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Box>
              ))}
            </LocalizationProvider>
            <TextField label="Description" name="description" value={restaurantDetails.description} onChange={handleInputChange} multiline rows={3} fullWidth />
            <Box>
              <Typography variant="body1" sx={{ marginBottom: "8px" }}>Upload Photos</Typography>
              <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} />
              <Box sx={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
                {restaurantDetails.photos.map((photo, index) => (
                  <img key={index} src={photo} alt={`Restaurant Photo ${index + 1}`} style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e0e0e0" }} />
                ))}
              </Box>
            </Box>
            <FormControl fullWidth>
              <InputLabel id="cuisine-label">Cuisine</InputLabel>
              <Select labelId="cuisine-label" name="cuisine" value={restaurantDetails.cuisine} onChange={handleInputChange} multiple renderValue={(selected) => selected.join(", ")}>
                <MenuItem value="Indian">Indian</MenuItem>
                <MenuItem value="Italian">Italian</MenuItem>
                <MenuItem value="Chinese">Chinese</MenuItem>
                <MenuItem value="Mexican">Mexican</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="foodType-label">Food Type</InputLabel>
              <Select labelId="foodType-label" name="foodType" value={restaurantDetails.foodType} onChange={handleInputChange} multiple renderValue={(selected) => selected.join(", ")}>
                <MenuItem value="Vegan">Vegan</MenuItem>
                <MenuItem value="Non-Veg">Non-Veg</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="price-label">Price Range</InputLabel>
              <Select labelId="price-label" name="price" value={restaurantDetails.price} onChange={handleInputChange}>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" sx={{ backgroundColor: "#d32323", color: "#ffffff", textTransform: "none", fontSize: 16, marginRight: 2, "&:hover": { backgroundColor: "#b81e1e" } }} onClick={handleSubmit}>
              Add Restaurant
            </Button>
          </Box>
        </Box>
        <Box sx={{ width: "30%", position: "sticky", top: "120px", height: "calc(100vh - 140px)", overflow: "hidden", border: "1px solid #e0e0e0", borderRadius: "8px", backgroundColor: "#ffffff", padding: "16px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "16px" }}>Tips for Adding Details</Typography>
          <Typography variant="body1">
            Ensure your restaurant's details are complete and accurate. Use high-quality photos and provide clear descriptions of hours, cuisine, and more.
          </Typography>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default BusinessHome;
