// UI Components and DOM manipulation
import { WeatherData, ForecastData } from './weather-service.js';

export class WeatherUI {
    private elements: { [key: string]: HTMLElement };

    constructor() {
        this.elements = this.getElements();
    }

    private getElements(): { [key: string]: HTMLElement } {
        const elementIds = [
            'locationInput', 'searchButton', 'errorMessage', 'loading',
            'currentWeather', 'forecast', 'forecastContainer',
            'currentTemp', 'currentLocation', 'currentCondition', 'currentDate',
            'currentIcon', 'currentHumidity', 'currentWindSpeed', 
            'currentFeelsLike', 'currentPressure'
        ];

        const elements: { [key: string]: HTMLElement } = {};
        
        elementIds.forEach(id => {
            const element = document.getElementById(id);
            if (!element) {
                throw new Error(`Element with id '${id}' not found`);
            }
            elements[id] = element;
        });

        return elements;
    }

    getLocationInput(): string {
        const input = this.elements.locationInput as HTMLInputElement;
        return input.value.trim();
    }

    clearLocationInput(): void {
        const input = this.elements.locationInput as HTMLInputElement;
        input.value = '';
    }

    showLoading(): void {
        this.hideError();
        this.hideWeatherData();
        this.elements.loading.classList.remove('hidden');
    }

    hideLoading(): void {
        this.elements.loading.classList.add('hidden');
    }

    showError(message: string): void {
        this.hideLoading();
        this.hideWeatherData();
        this.elements.errorMessage.textContent = message;
        this.elements.errorMessage.classList.remove('hidden');
    }

    hideError(): void {
        this.elements.errorMessage.classList.add('hidden');
    }

    hideWeatherData(): void {
        this.elements.currentWeather.classList.add('hidden');
        this.elements.forecast.classList.add('hidden');
    }

    displayCurrentWeather(weather: WeatherData): void {
        this.hideLoading();
        this.hideError();

        // Update current weather data
        this.updateTextContent('currentTemp', weather.temperature.toString());
        this.updateTextContent('currentLocation', weather.location);
        this.updateTextContent('currentCondition', this.capitalizeWords(weather.condition));
        this.updateTextContent('currentDate', weather.date);
        this.updateTextContent('currentHumidity', `${weather.humidity}%`);
        this.updateTextContent('currentWindSpeed', `${weather.windSpeed} km/h`);
        this.updateTextContent('currentFeelsLike', `${weather.feelsLike}°C`);
        this.updateTextContent('currentPressure', `${weather.pressure} hPa`);

        // Update weather icon
        const iconElement = this.elements.currentIcon as HTMLImageElement;
        iconElement.src = weather.icon;
        iconElement.alt = weather.condition;

        // Show current weather section
        this.elements.currentWeather.classList.remove('hidden');
    }

    displayForecast(forecast: ForecastData[]): void {
        // Clear existing forecast cards
        this.elements.forecastContainer.innerHTML = '';

        // Create forecast cards
        forecast.forEach(day => {
            const card = this.createForecastCard(day);
            this.elements.forecastContainer.appendChild(card);
        });

        // Show forecast section
        this.elements.forecast.classList.remove('hidden');
    }

    private createForecastCard(day: ForecastData): HTMLElement {
        const card = document.createElement('div');
        card.className = 'forecast-card';

        card.innerHTML = `
            <div class="forecast-date">${day.date}</div>
            <div class="forecast-icon">
                <img src="${day.icon}" alt="${day.condition}">
            </div>
            <div class="forecast-temps">
                <span class="forecast-high">${day.highTemp}°</span>
                <span class="forecast-low">${day.lowTemp}°</span>
            </div>
            <div class="forecast-condition">${this.capitalizeWords(day.condition)}</div>
        `;

        return card;
    }

    private updateTextContent(elementId: string, content: string): void {
        const element = this.elements[elementId];
        if (element) {
            element.textContent = content;
        }
    }

    private capitalizeWords(str: string): string {
        return str.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    // Event handling helpers
    onSearchClick(callback: () => void): void {
        this.elements.searchButton.addEventListener('click', callback);
    }

    onLocationInputEnter(callback: () => void): void {
        this.elements.locationInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                callback();
            }
        });
    }

    onLocationInputChange(callback: () => void): void {
        this.elements.locationInput.addEventListener('input', () => {
            // Hide error when user starts typing
            this.hideError();
        });
    }

    focusLocationInput(): void {
        const input = this.elements.locationInput as HTMLInputElement;
        input.focus();
    }

    disableSearch(): void {
        const button = this.elements.searchButton as HTMLButtonElement;
        const input = this.elements.locationInput as HTMLInputElement;
        button.disabled = true;
        input.disabled = true;
        button.textContent = 'Loading...';
    }

    enableSearch(): void {
        const button = this.elements.searchButton as HTMLButtonElement;
        const input = this.elements.locationInput as HTMLInputElement;
        button.disabled = false;
        input.disabled = false;
        button.textContent = 'Get Weather';
    }
}