import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Box, Typography, Rating } from '@mui/material';
import { Link } from 'react-router-dom';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const libraries = ['places'];

const MapContainer = ({ places, userLocation }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const mapRef = useRef(null);
  const infoWindowTimeout = useRef(null);

  const handleLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const handleMarkerMouseOver = (place) => {
    if (infoWindowTimeout.current) {
      clearTimeout(infoWindowTimeout.current);
    }
    setSelectedPlace(place);
  };

  const handleMarkerMouseOut = () => {
    infoWindowTimeout.current = setTimeout(() => {
      setSelectedPlace(null);
    }, 10000);
  };

  const getLocation = (location) => {
    return {
      lat: typeof location.lat === 'function' ? location.lat() : location.lat,
      lng: typeof location.lng === 'function' ? location.lng() : location.lng,
    };
  };

  return (
    <div
      style={{
        position: 'sticky',
        height: '100%',
      }}
      className="map-container"
    >
      <LoadScript googleMapsApiKey="AIzaSyDewJC5STCF9FQRfe1EAVnU8kJvfsRhLPU" libraries={libraries}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation}
          zoom={12}
          onLoad={handleLoad}
          options={{ disableDefaultUI: true, zoomControl: true }}
        >
          {places.map((place) => {
            const position = getLocation(place.geometry.location);
            if (position.lat && position.lng) {
              return (
                <Marker
                  key={place.place_id}
                  position={position}
                  onMouseOver={() => handleMarkerMouseOver(place)}
                  onMouseOut={handleMarkerMouseOut}
                />
              );
            }
            return null;
          })}

          {selectedPlace && (
            <InfoWindow
              position={getLocation(selectedPlace.geometry.location)}
              onCloseClick={() => setSelectedPlace(null)}
            >
              <Box sx={{ padding: '10px', maxWidth: '250px' }}>
                <img
                  src={
                    selectedPlace.photos && selectedPlace.photos.length > 0
                      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference=${selectedPlace.photos[0].photo_reference}&key=AIzaSyDewJC5STCF9FQRfe1EAVnU8kJvfsRhLPU`
                      : 'https://via.placeholder.com/100'
                  }
                  alt={selectedPlace.name}
                  width="100%"
                  height="auto"
                  style={{ borderRadius: 8 }}
                />
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 1 }}>
                  <Link
                    to={`/restaurant/${selectedPlace.name.replace(/\s+/g, '-')}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {selectedPlace.name}
                  </Link>
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 0.5 }}>
                  <Rating
                    name="read-only"
                    value={selectedPlace.rating}
                    readOnly
                    precision={0.1}
                    size="small"
                  />
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{ marginLeft: 1, fontSize: '0.875rem', color: '#555' }}
                  >
                    {selectedPlace.rating} ({selectedPlace.user_ratings_total} reviews)
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                  {selectedPlace.vicinity}
                </Typography>
              </Box>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapContainer;
