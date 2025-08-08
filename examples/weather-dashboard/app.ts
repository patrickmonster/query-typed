// Main application controller
import { WeatherService, WeatherAPIError } from './weather-service.js';
import { WeatherUI } from './ui-components.js';

export class WeatherApp {
    private weatherService: WeatherService;
    private ui: WeatherUI;

    constructor() {
        this.weatherService = new WeatherService();
        this.ui = new WeatherUI();
        this.initializeEventListeners();
        this.initializeApp();
    }

    private initializeEventListeners(): void {
        // Search button click
        this.ui.onSearchClick(() => {
            this.handleSearch();
        });

        // Enter key in location input
        this.ui.onLocationInputEnter(() => {
            this.handleSearch();
        });

        // Input change to hide errors
        this.ui.onLocationInputChange(() => {
            // This is handled in the UI component
        });
    }

    private initializeApp(): void {
        // Focus on the location input when the app loads
        this.ui.focusLocationInput();
        
        // Load demo data if no location is provided
        this.loadDemoWeather();
    }

    private async loadDemoWeather(): Promise<void> {
        try {
            this.ui.showLoading();
            const weatherData = await this.weatherService.getCurrentWeather('New York');
            this.ui.displayCurrentWeather(weatherData.current);
            this.ui.displayForecast(weatherData.forecast);
        } catch (error) {
            // Silently fail for demo data - user can search for their own location
            this.ui.hideLoading();
        }
    }

    private async handleSearch(): Promise<void> {
        const location = this.ui.getLocationInput();

        // Validate input
        if (!location) {
            this.ui.showError('Please enter a city name or ZIP code.');
            this.ui.focusLocationInput();
            return;
        }

        // Validate location format (basic validation)
        if (!this.isValidLocation(location)) {
            this.ui.showError('Please enter a valid city name or ZIP code.');
            this.ui.focusLocationInput();
            return;
        }

        try {
            // Show loading state
            this.ui.showLoading();
            this.ui.disableSearch();

            // Fetch weather data
            const weatherData = await this.weatherService.getCurrentWeather(location);

            // Display the results
            this.ui.displayCurrentWeather(weatherData.current);
            this.ui.displayForecast(weatherData.forecast);

        } catch (error) {
            let errorMessage = 'An unexpected error occurred. Please try again.';

            if (error instanceof WeatherAPIError) {
                errorMessage = error.message;
            } else if (error instanceof Error) {
                // Network or other errors
                if (error.message.includes('fetch')) {
                    errorMessage = 'Network error. Please check your internet connection and try again.';
                } else {
                    errorMessage = error.message;
                }
            }

            this.ui.showError(errorMessage);
            this.ui.focusLocationInput();

        } finally {
            // Always re-enable the search functionality
            this.ui.enableSearch();
        }
    }

    private isValidLocation(location: string): boolean {
        // Basic validation for location input
        const trimmed = location.trim();
        
        // Check minimum length
        if (trimmed.length < 2) {
            return false;
        }

        // Check maximum length
        if (trimmed.length > 100) {
            return false;
        }

        // Allow letters, numbers, spaces, commas, hyphens, and periods
        const validPattern = /^[a-zA-Z0-9\s,.-]+$/;
        if (!validPattern.test(trimmed)) {
            return false;
        }

        // Prevent excessive special characters
        const specialCharCount = (trimmed.match(/[,.-]/g) || []).length;
        if (specialCharCount > trimmed.length / 3) {
            return false;
        }

        return true;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        new WeatherApp();
    } catch (error) {
        console.error('Failed to initialize Weather App:', error);
        
        // Show a basic error message if the app fails to initialize
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #e74c3c;
            color: white;
            padding: 2rem;
            border-radius: 8px;
            text-align: center;
            max-width: 400px;
            z-index: 1000;
        `;
        errorDiv.innerHTML = `
            <h3>App Initialization Error</h3>
            <p>The weather app failed to start. Please refresh the page and try again.</p>
        `;
        document.body.appendChild(errorDiv);
    }
});