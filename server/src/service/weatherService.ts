import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  description: string;
  tempF: number;
  humidity: number;
  windSpeed: number;

  constructor(city: string, date: string, icon: string, description: string, temp: number, humidity: number, windSpeed: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.description = description;
    this.tempF = temp;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }

  // TODO: Create fetchLocationData method
   private async fetchLocationData(query: string) {
    try {
      if (!this.baseURL || !this.apiKey) {
        throw new Error('API_BASE_URL and API_KEY environment variables must be set');
      }
     
      const response = await fetch(query);
      if (!response.ok) {
        throw new Error(`Error fetching location data: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
   }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=5&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    //https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData[0]);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const weatherData = await this.fetchLocationData(query);
    return weatherData;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
   const data = response;
   const date = new Date(data?.dt * 1000).toLocaleDateString();
   const icon = data?.weather[0].icon;
   const description = data?.weather[0].description;
   const temperature = data?.main.temp;
   const humidity = data?.main.humidity;
   const windSpeed = data?.wind.speed;
    return new Weather(this.cityName, date, icon, description, temperature, humidity, windSpeed);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray = [];
    for (let i = 1; i < 6; i++) {
      const forecast = this.parseCurrentWeather(weatherData[i]);
      forecastArray.push(forecast);
    }
    forecastArray.unshift(currentWeather);
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    try {
      this.cityName = city;
      const coordinates = await this.fetchAndDestructureLocationData();
      const weatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherData.list[0]);
      const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
      return forecastArray;
    } catch (error) {
      console.error(error);
      throw error;
      
    }
  }
}

export default new WeatherService();
