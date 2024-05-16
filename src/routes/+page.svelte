<script>
	import { onMount } from 'svelte';
	import {
		currentWeather,
		forecastWeather,
		fetchCurrentWeather,
		fetchWeatherForecast,
		fetchCurrentWeatherByCoords,
		fetchWeatherForecastByCoords
	} from '../lib/weatherService';
	import { get } from 'svelte/store';

	let city = '';
	let loading = false;

	onMount(() => {
		if (navigator.geolocation) {
			console.log('Geolocation is available');
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					console.log(`Geolocation success: ${latitude}, ${longitude}`);
					fetchWeatherByCoords(latitude, longitude);
				},
				(error) => {
					console.error('Geolocation error:', error);
					if (city) {
						fetchWeather(city);
					}
				}
			);
		} else {
			console.log('Geolocation is not available');
			if (city) {
				fetchWeather(city);
			}
		}
	});

	async function fetchWeather(city) {
		loading = true;
		console.log(`Fetching weather for city: ${city}`);
		await fetchCurrentWeather(city);
		await fetchWeatherForecast(city);
		loading = false;
	}

	async function fetchWeatherByCoords(lat, lon) {
		loading = true;
		console.log(`Fetching weather for coordinates: ${lat}, ${lon}`);
		await fetchCurrentWeatherByCoords(lat, lon);
		await fetchWeatherForecastByCoords(lat, lon);
		loading = false;
	}

	function updateWeather() {
		if (city) {
			fetchWeather(city);
		}
	}

	function getIconUrl(iconCode) {
		return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
	}
</script>

<main>
	<h1>Weather Dashboard</h1>
	<div class="input-container">
		<input type="text" bind:value={city} placeholder="Enter a city" />
		<button on:click={updateWeather}>Get Weather</button>
	</div>

	{#if loading}
		<p class="loading">Loading...</p>
	{:else if $currentWeather && $forecastWeather}
		{#if $currentWeather.error || $forecastWeather.error}
			<p class="error">Error: Failed to load weather data.</p>
		{:else}
			<div class="weather-container">
				<h2>Current Weather in {$currentWeather.name}</h2>
				<p>Temperature: {$currentWeather.main.temp} °C</p>
				<p>Weather: {$currentWeather.weather[0].main} ({$currentWeather.weather[0].description})</p>
				<img src={getIconUrl($currentWeather.weather[0].icon)} alt="Weather Icon" />
				<p>Humidity: {$currentWeather.main.humidity}%</p>
				<p>Wind Speed: {$currentWeather.wind.speed} m/s</p>
			</div>

			<h2>5-Day Forecast</h2>
			<div class="forecast-container">
				{#each $forecastWeather.list.slice(0, 5) as day (day.dt)}
					<div class="forecast-day" key={day.dt}>
						<p>{new Date(day.dt * 1000).toLocaleDateString()}</p>
						<p>Temp: {day.main.temp} °C</p>
						<p>Weather: {day.weather[0].main} ({day.weather[0].description})</p>
						<img src={getIconUrl(day.weather[0].icon)} alt="Weather Icon" />
					</div>
				{/each}
			</div>
		{/if}
	{:else}
		<p class="loading">Loading...</p>
	{/if}

	<footer>
		<p>Created by: Ahmad Alsafedi</p>
		<p>Neptun Code: I4JK4U</p>
	</footer>
</main>

<style>
	main {
		text-align: center;
		padding: 2rem;
		font-family: Arial, sans-serif;
		background-color: #f0f4f8;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	h1 {
		font-size: 2.5rem;
		color: #333;
		margin-bottom: 1rem;
	}

	.input-container {
		display: flex;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	input[type='text'] {
		padding: 0.5rem;
		font-size: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		margin-right: 0.5rem;
	}

	button {
		padding: 0.5rem 1rem;
		font-size: 1rem;
		color: #fff;
		background-color: #007bff;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:hover {
		background-color: #0056b3;
	}

	.loading {
		font-size: 1.2rem;
		color: #666;
	}

	.error {
		font-size: 1.2rem;
		color: red;
	}

	.weather-container {
		background-color: #fff;
		padding: 1rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		margin-bottom: 1.5rem;
	}

	.forecast-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.forecast-day {
		background-color: #fff;
		padding: 1rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		margin: 0.5rem;
		width: 150px;
		text-align: center;
	}

	footer {
		margin-top: 2rem;
		font-size: 1rem;
		color: #666;
	}
</style>
