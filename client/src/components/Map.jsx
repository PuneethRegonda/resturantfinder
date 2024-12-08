import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const MapContainer = ({ zipCode }) => {
  const [userLocation, setUserLocation] = useState({ lat: 37.3304795, lng: -121.905282 });
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);

  const fetchRestaurants = (lat, lng) => {
    setLoading(true);
    const map = mapRef.current;

    if (map) {
      const service = new window.google.maps.places.PlacesService(map);
      const request = {
        location: new window.google.maps.LatLng(lat, lng),
        radius: 3000,
        type: 'restaurant',
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPlaces(results);
        } else {
          setError('Failed to fetch places.');
          console.error('PlacesService error:', status);
        }
        setLoading(false);
      });
    }
  };

  const fetchLocationForZip = async (zip) => {
    setLoading(true);
    try {
      if (!zip) zip = '95126';
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=AIzaSyD3fqwSWp1IuXJesIHBUf1GEhWRVT_LJP4`
      );
      const data = await response.json();
      if (response.ok && data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setUserLocation({ lat: location.lat, lng: location.lng });

        // Only fetch restaurants if the map has loaded
        if (mapRef.current) {
          fetchRestaurants(location.lat, location.lng);
        }
      } else {
        setError('Invalid ZIP code. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching location for ZIP code:', error);
      setError('Failed to fetch location. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocationForZip(zipCode);
  }, [zipCode]); // Trigger fetch whenever the zipCode changes

  return (
    <LoadScript googleMapsApiKey="AIzaSyD3fqwSWp1IuXJesIHBUf1GEhWRVT_LJP4" libraries={['places']}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation}
        zoom={12}
        onLoad={(map) => {
          mapRef.current = map;
          // Fetch restaurants if userLocation is already set
          fetchRestaurants(userLocation.lat, userLocation.lng);
        }} // Reference the map object
        options={{ disableDefaultUI: true, zoomControl: true }}
      >
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {places.map((place) => (
          <Marker
            key={place.place_id}
            position={{
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }}
            title={place.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapContainer;
