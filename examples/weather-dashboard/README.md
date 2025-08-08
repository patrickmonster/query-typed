# Weather Dashboard

A responsive weather dashboard that displays current weather and 5-day forecast for any location.

## Features

- **Current Weather Display**: Temperature, conditions, humidity, wind speed, feels like temperature, and pressure
- **5-Day Forecast**: Daily weather summaries with high/low temperatures
- **Location Search**: Search by city name or ZIP code
- **Error Handling**: User-friendly error messages for invalid locations or network issues
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Data**: Weather data from OpenWeatherMap API (demo mode included)

## Architecture

### Business Logic (`weather-service.ts`)
- `WeatherService` class handles all API interactions
- Separates data fetching from UI concerns
- Includes error handling and data transformation
- Supports both real API calls and demo mode

### UI Components (`ui-components.ts`)
- `WeatherUI` class manages all DOM interactions
- Provides methods for showing/hiding different UI states
- Handles user input validation and display formatting
- Responsive design with mobile-first approach

### Application Controller (`app.ts`)
- `WeatherApp` class coordinates between service and UI
- Manages application state and user interactions
- Implements proper error handling and user feedback
- Initializes the application and event listeners

## Usage

### For Demo (using mock data):
1. Open `index.html` in a web browser
2. The app will load with sample weather data
3. Try searching for different locations (use "invalid" in the location name to test error handling)

### For Production (with real API):
1. Get an API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Replace `demo_key` in `weather-service.ts` with your actual API key
3. Build the TypeScript files: `tsc`
4. Serve the files through a web server

## Building

```bash
# Compile TypeScript files
tsc

# The compiled JavaScript files will be in the dist/ directory
```

## Files

- `index.html` - Main HTML structure
- `styles.css` - Responsive CSS styling
- `app.ts` - Main application controller
- `weather-service.ts` - Weather API service (business logic)
- `ui-components.ts` - UI component management
- `tsconfig.json` - TypeScript configuration

## Dependencies

- No runtime dependencies (vanilla TypeScript/JavaScript)
- Uses modern ES2020 features
- Responsive CSS with Flexbox and CSS Grid
- OpenWeatherMap API for weather data (when not in demo mode)