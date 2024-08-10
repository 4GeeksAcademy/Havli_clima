import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = 'your_api_key_here'; // Make sure this is correct

  useEffect(() => {
    console.log("Attempting to get geolocation...");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          console.log("Geolocation success:", position.coords);
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        function(error) {
          console.error("Geolocation error:", error);
          setError("Geolocation error: " + error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (coordinates) {
      console.log("Coordinates set, fetching weather for:", coordinates);
      fetchWeather(coordinates.latitude, coordinates.longitude);
    }
  }, [coordinates]);

  const fetchWeather = (lat, lon) => {
    setLoading(true);
    setError(null);
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    console.log("Fetching weather from:", url);
    fetch(url)
      .then(response => {
        console.log("Weather API response status:", response.status);
        if (!response.ok) {
          throw new Error(`Weather data not available. Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Weather data received:", data);
        setWeather(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching weather:", err);
        setError("Error fetching weather data: " + err.message);
        setLoading(false);
      });
  };

  const searchLocation = (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;
    console.log("Searching location:", url);
    fetch(url)
      .then(response => {
        console.log("Location search response status:", response.status);
        if (!response.ok) {
          throw new Error(`Location not found. Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Location data received:", data);
        setWeather(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching location:", err);
        setError("Error fetching weather data: " + err.message);
        setLoading(false);
      });
  };

  return (
    <div className="App">
      <h1>Weather App</h1>
      <form onSubmit={searchLocation}>
        <input 
          type="text" 
          value={location} 
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {coordinates && (
        <p>Your coordinates: {coordinates.latitude}, {coordinates.longitude}</p>
      )}
      {weather && (
        <div className="weather-info">
          <h2>Weather in {weather.name}</h2>
          <p>Temperature: {weather.main?.temp}°C</p>
          <p>Feels like: {weather.main?.feels_like}°C</p>
          <p>Condition: {weather.weather?.[0]?.main}</p>
          <p>Description: {weather.weather?.[0]?.description}</p>
        </div>
      )}
    </div>
  );
}

export default App;