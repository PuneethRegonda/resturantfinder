
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
import BusinessOwnerHeader from "../../components/BusinessOwnerHeader"; // Updated header for business owners
import Footer from "../../components/Footer";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useNavigate } from "react-router-dom";
import { parseISO, format } from 'date-fns';
//import { format } from 'date-fns';



const EditRestaurant = () => {
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

  // const handlePhotoUpload = (e) => {
  //   const files = e.target.files;
  //   const photoArray = Array.from(files).map((file) =>
  //     URL.createObjectURL(file)
  //   );
  //   setRestaurantDetails((prevState) => ({
  //     ...prevState,
  //     photos: photoArray,
  //   }));
  // };

  // const handleHoursChange = (day, field, value) => {
  //   setRestaurantDetails((prevState) => ({
  //     ...prevState,
  //     hours: {
  //       ...prevState.hours,
  //       [day]: {
  //         ...prevState.hours[day],
  //         [field]: value,
  //       },
  //     },
  //   }));
  // };



  const handleHoursChange = (day, field, newValue) => {
    if (!newValue) return; // Handle case where no value is selected
  
    const timeString = newValue.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Save as 24-hour format for consistency
    });
  
    setRestaurantDetails((prevState) => ({
      ...prevState,
      hours: {
        ...prevState.hours,
        [day]: {
          ...prevState.hours[day],
          [field]: timeString, // Save formatted string
        },
      },
    }));
  };
  
  


  
  
  
  
  
  const handlePhotoUpload = (e) => {
    const files = e.target.files;
    const formData = new FormData();
    
    // Append the files to FormData
    Array.from(files).forEach((file) => {
      formData.append("file", file);  // 'file' is the key we will use in the backend to access the file
    });
  
    // Send the FormData to the backend (you can pass restaurantId or other necessary data)
    fetch("/api/photos/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Assuming the backend returns the URL of the stored image, update the frontend state
        setRestaurantDetails((prevState) => ({
          ...prevState,
          photos: [...prevState.photos, data.photoUrl],  // Append the URL to the photo array
        }));
      })
      .catch((error) => console.error("Error uploading photos:", error));
  };
  

  const handleSubmit = () => {
    const { streetAddress, city, state, country, zipcode } =
      restaurantDetails.address;

    // Validate required fields
    if (
      !restaurantDetails.name ||
      !streetAddress ||
      !city ||
      !state ||
      !country ||
      !zipcode ||
      !/^\d{5}(-\d{4})?$/.test(zipcode) // Regex for US zip codes (supports 5-digit and 9-digit formats)
    ) {
      alert("Please fill in all required fields with valid data.");
      return;
    }

    console.log("Restaurant Details:", restaurantDetails);
    // Add functionality to submit details to the backend
    // If all validations pass
    alert("Restaurant details updated successfully!");

    // Redirect to /views page
    navigate("/views");
  };

  const handleViewRestaurantClick = () => {
    console.log("Navigating to /business");  // Debugging line
    navigate("/views"); // Navigate to add restaurant page
  };


  const handleLogout = () => {
    // Clear user session or token
    console.log("Logging out...");
    localStorage.removeItem('authToken'); // Clear token on logout
    localStorage.removeItem('userRoles'); // Clear token on logout

    // Redirect to login page or perform other logout actions
    navigate("/");
  };

  return (
    <>
      {/* Business Owner Header */}
      {/* <BusinessOwnerHeader /> */}
      <BusinessOwnerHeader buttonText="View Restaurants" onClick={handleViewRestaurantClick} onLogout={handleLogout} />


      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "16px",
          padding: "16px",
        }}
      >
        {/* Form Section */}
        <Box
          sx={{
            flex: 1,
            padding: "16px",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", marginBottom: "16px" }}
          >
            Edit Restaurant
          </Typography>

          {/* Restaurant Details Form */}
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {/* Restaurant Name */}
            <TextField
              label="Restaurant Name"
              name="name"
              value={restaurantDetails.name}
              onChange={handleInputChange}
              fullWidth
              required
            />

            {/* Address */}
            <Typography variant="h6" sx={{ marginTop: "16px" }}>
              Address Details
            </Typography>

            {/* Street Address */}
            <TextField
              label="Street Address"
              name="streetAddress"
              value={restaurantDetails.address.streetAddress}
              onChange={handleInputChange}
              fullWidth
              required
            />

            {/* Apt/Suite/Other */}
            <TextField
              label="Apt/Suite/Other (optional)"
              name="aptSuiteOther"
              value={restaurantDetails.address.aptSuiteOther}
              onChange={handleInputChange}
              fullWidth
            />

            {/* City */}
            <TextField
              label="City"
              name="city"
              value={restaurantDetails.address.city}
              onChange={handleInputChange}
              fullWidth
              required
            />

            {/* State */}
            <TextField
              label="State"
              name="state"
              value={restaurantDetails.address.state}
              onChange={handleInputChange}
              fullWidth
              required
            />

            {/* Country */}
            <TextField
              label="Country"
              name="country"
              value={restaurantDetails.address.country}
              onChange={handleInputChange}
              fullWidth
              required
            />

            {/* Zipcode */}
            <TextField
              label="Zipcode"
              name="zipcode"
              value={restaurantDetails.address.zipcode}
              onChange={handleInputChange}
              fullWidth
              required
              helperText="Enter a valid 5-digit or 9-digit zipcode."
            />

            {/* Contact Info */}
            <TextField
              label="Contact Info"
              name="contact"
              value={restaurantDetails.contact}
              onChange={handleInputChange}
              fullWidth
              required
            />



          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Typography variant="h6" sx={{ marginTop: "16px" }}>
              Hours of Operation
            </Typography>
            {Object.keys(restaurantDetails.hours).map((day) => (
              <Box
                key={day}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  marginBottom: "16px",
                }}
              >
                <Typography variant="body1" sx={{ minWidth: "100px" }}>
                  {day}:
                </Typography>
                <TimePicker
                  label="Open"
                  value={
                    restaurantDetails.hours[day].open
                      ? new Date(`1970-01-01T${restaurantDetails.hours[day].open}:00`)
                      : null
                  }
                  onChange={(newValue) => handleHoursChange(day, "open", newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
                <TimePicker
                  label="Close"
                  value={
                    restaurantDetails.hours[day].close
                      ? new Date(`1970-01-01T${restaurantDetails.hours[day].close}:00`)
                      : null
                  }
                  onChange={(newValue) => handleHoursChange(day, "close", newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Box>
            ))}
          </LocalizationProvider>






            {/* Hours
            <TextField
              label="Hours (e.g., 9 AM - 9 PM)"
              name="hours"
              value={restaurantDetails.hours}
              onChange={handleInputChange}
              fullWidth
            /> */}

            {/* Description */}
            <TextField
              label="Description"
              name="description"
              value={restaurantDetails.description}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
            />

            {/* Photos */}
            <Box>
              <Typography variant="body1" sx={{ marginBottom: "8px" }}>
                Upload Photos
              </Typography>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
              />
              {/* Preview uploaded images */}
              <Box
                sx={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "16px",
                  flexWrap: "wrap",
                }}
              >
                {restaurantDetails.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Restaurant Photo ${index + 1}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Cuisine */}
            <FormControl fullWidth>
              <InputLabel id="cuisine-label">Cuisine</InputLabel>
              <Select
                labelId="cuisine-label"
                name="cuisine"
                value={restaurantDetails.cuisine}
                onChange={handleInputChange}
                multiple
                renderValue={(selected) => selected.join(", ")} // Display selected items
              >
                <MenuItem value="Indian">Indian</MenuItem>
                <MenuItem value="Italian">Italian</MenuItem>
                <MenuItem value="Chinese">Chinese</MenuItem>
                <MenuItem value="Mexican">Mexican</MenuItem>
              </Select>
            </FormControl>

            {/* Food Type */}
            <FormControl fullWidth>
              <InputLabel id="foodType-label">Food Type</InputLabel>
              <Select
                labelId="foodType-label"
                name="foodType"
                value={restaurantDetails.foodType}
                onChange={handleInputChange}
                multiple
                renderValue={(selected) => selected.join(", ")} // Display selected items
              >
                <MenuItem value="Vegan">Vegan</MenuItem>
                <MenuItem value="Non-Veg">Non-Veg</MenuItem>
              </Select>
            </FormControl>


            {/* Price Range */}
            <FormControl fullWidth>
              <InputLabel id="price-label">Price Range</InputLabel>
              <Select
                labelId="price-label"
                name="price"
                value={restaurantDetails.price}
                onChange={handleInputChange}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>

            {/* Food Type */}
            {/* <FormControl fullWidth>
              <InputLabel id="foodType-label">Food Type</InputLabel>
              <Select
                labelId="foodType-label"
                name="foodType"
                value={restaurantDetails.foodType}
                onChange={handleInputChange}
              >
                <MenuItem value="Vegan">Vegan</MenuItem>
                <MenuItem value="Non-Veg">Non-Veg</MenuItem>
              </Select>
            </FormControl> */}

            {/* Submit Button */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#d32323", // Red background
                color: "#ffffff", // White text color
                textTransform: "none",
                fontSize: 16,
                marginRight: 2,
                borderColor: "#d8d8d8",
                "&:hover": {
                  backgroundColor: "#b81e1e", // Darker red on hover
                  borderColor: "#000", // Optional, border color change on hover
                },
              }}
              onClick={handleSubmit}
            >
              Edit Restaurant
            </Button>
          </Box>
        </Box>

        {/* Optional Sidebar or Instructions */}
        <Box
          sx={{
            width: "30%",
            position: "sticky",
            top: "120px",
            height: "calc(100vh - 140px)",
            overflow: "hidden",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            backgroundColor: "#ffffff",
            padding: "16px",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", marginBottom: "16px" }}
          >
            Tips for editing Details
          </Typography>
          <Typography variant="body1">
            Ensure your restaurant's details are complete and accurate. Use
            high-quality photos and provide clear descriptions of hours,
            cuisine, and more.
          </Typography>
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default EditRestaurant;

