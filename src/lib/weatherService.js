import { writable } from 'svelte/store';

export const currentWeather = writable(null);
export const forecastWeather = writable(null);

const API_KEY = '964209e82ca5f66f6ef773bb9eb119bb'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function fetchCurrentWeather(city) {
	try {
		const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
		const data = await response.json();
		if (response.ok) {
			currentWeather.set(data);
		} else {
			currentWeather.set({ error: data.message });
		}
	} catch (error) {
		currentWeather.set({ error: error.message });
	}
}

export async function fetchWeatherForecast(city) {
	try {
		const response = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);
		const data = await response.json();
		if (response.ok) {
			forecastWeather.set(data);
		} else {
			forecastWeather.set({ error: data.message });
		}
	} catch (error) {
		forecastWeather.set({ error: error.message });
	}
}

export async function fetchCurrentWeatherByCoords(lat, lon) {
	try {
		const response = await fetch(
			`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
		);
		const data = await response.json();
		if (response.ok) {
			currentWeather.set(data);
		} else {
			currentWeather.set({ error: data.message });
		}
	} catch (error) {
		currentWeather.set({ error: error.message });
	}
}

export async function fetchWeatherForecastByCoords(lat, lon) {
	try {
		const response = await fetch(
			`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
		);
		const data = await response.json();
		if (response.ok) {
			forecastWeather.set(data);
		} else {
			forecastWeather.set({ error: data.message });
		}
	} catch (error) {
		forecastWeather.set({ error: error.message });
	}
}
