// Weather API service - Business logic layer
export interface WeatherData {
    location: string;
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    feelsLike: number;
    pressure: number;
    icon: string;
    date: string;
}

export interface ForecastData {
    date: string;
    highTemp: number;
    lowTemp: number;
    condition: string;
    icon: string;
}

export interface WeatherResponse {
    current: WeatherData;
    forecast: ForecastData[];
}

export class WeatherAPIError extends Error {
    constructor(message: string, public code?: string) {
        super(message);
        this.name = 'WeatherAPIError';
    }
}

export class WeatherService {
    private readonly API_KEY = 'demo_key'; // In a real app, this would be from environment variables
    private readonly BASE_URL = 'https://api.openweathermap.org/data/2.5';

    async getCurrentWeather(location: string): Promise<WeatherResponse> {
        try {
            // For demo purposes, we'll simulate API calls with mock data
            // In a real implementation, these would be actual API calls
            if (this.API_KEY === 'demo_key') {
                return this.getMockWeatherData(location);
            }

            const [currentResponse, forecastResponse] = await Promise.all([
                this.fetchCurrentWeather(location),
                this.fetchForecast(location)
            ]);

            return {
                current: this.parseCurrentWeather(currentResponse),
                forecast: this.parseForecast(forecastResponse)
            };
        } catch (error) {
            if (error instanceof WeatherAPIError) {
                throw error;
            }
            throw new WeatherAPIError('Failed to fetch weather data. Please try again.');
        }
    }

    private async fetchCurrentWeather(location: string): Promise<any> {
        const url = `${this.BASE_URL}/weather?q=${encodeURIComponent(location)}&appid=${this.API_KEY}&units=metric`;
        const response = await fetch(url);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new WeatherAPIError('Location not found. Please check the spelling and try again.');
            }
            if (response.status === 401) {
                throw new WeatherAPIError('API key is invalid.');
            }
            throw new WeatherAPIError(`Weather service error: ${response.status}`);
        }
        
        return response.json();
    }

    private async fetchForecast(location: string): Promise<any> {
        const url = `${this.BASE_URL}/forecast?q=${encodeURIComponent(location)}&appid=${this.API_KEY}&units=metric`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new WeatherAPIError(`Forecast service error: ${response.status}`);
        }
        
        return response.json();
    }

    private parseCurrentWeather(data: any): WeatherData {
        return {
            location: `${data.name}, ${data.sys.country}`,
            temperature: Math.round(data.main.temp),
            condition: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
            feelsLike: Math.round(data.main.feels_like),
            pressure: data.main.pressure,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            date: new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };
    }

    private parseForecast(data: any): ForecastData[] {
        // Group forecast data by day (API returns 3-hour intervals)
        const dailyData = new Map<string, any[]>();
        
        data.list.forEach((item: any) => {
            const date = new Date(item.dt * 1000).toDateString();
            if (!dailyData.has(date)) {
                dailyData.set(date, []);
            }
            dailyData.get(date)!.push(item);
        });

        // Take first 5 days and create daily summaries
        const days = Array.from(dailyData.entries()).slice(0, 5);
        
        return days.map(([date, dayData]) => {
            const temps = dayData.map(item => item.main.temp);
            const highTemp = Math.round(Math.max(...temps));
            const lowTemp = Math.round(Math.min(...temps));
            
            // Use the most common weather condition for the day
            const conditions = dayData.map(item => item.weather[0]);
            const mainCondition = conditions[Math.floor(conditions.length / 2)];
            
            return {
                date: new Date(date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                }),
                highTemp,
                lowTemp,
                condition: mainCondition.description,
                icon: `https://openweathermap.org/img/wn/${mainCondition.icon}@2x.png`
            };
        });
    }

    private getMockWeatherData(location: string): Promise<WeatherResponse> {
        // Simulate API delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate location not found error for demo
                if (location.toLowerCase().includes('invalid')) {
                    reject(new WeatherAPIError('Location not found. Please check the spelling and try again.'));
                    return;
                }

                const mockCurrent: WeatherData = {
                    location: location || 'Demo City, US',
                    temperature: 22,
                    condition: 'partly cloudy',
                    humidity: 65,
                    windSpeed: 15,
                    feelsLike: 24,
                    pressure: 1013,
                    icon: 'https://openweathermap.org/img/wn/02d@2x.png',
                    date: new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })
                };

                const mockForecast: ForecastData[] = [
                    { date: 'Today', highTemp: 25, lowTemp: 18, condition: 'sunny', icon: 'https://openweathermap.org/img/wn/01d@2x.png' },
                    { date: 'Tomorrow', highTemp: 23, lowTemp: 16, condition: 'partly cloudy', icon: 'https://openweathermap.org/img/wn/02d@2x.png' },
                    { date: 'Thu, Jan 10', highTemp: 20, lowTemp: 12, condition: 'light rain', icon: 'https://openweathermap.org/img/wn/10d@2x.png' },
                    { date: 'Fri, Jan 11', highTemp: 18, lowTemp: 10, condition: 'cloudy', icon: 'https://openweathermap.org/img/wn/04d@2x.png' },
                    { date: 'Sat, Jan 12', highTemp: 24, lowTemp: 15, condition: 'sunny', icon: 'https://openweathermap.org/img/wn/01d@2x.png' }
                ];

                resolve({
                    current: mockCurrent,
                    forecast: mockForecast
                });
            }, 1000); // 1 second delay to simulate network request
        });
    }
}