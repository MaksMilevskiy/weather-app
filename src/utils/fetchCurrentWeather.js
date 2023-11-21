const fetchCurrentWeather = async (lat, lon, locale) => {
    const API_KEY = import.meta.env.VITE_WEATHER_APP_KEY;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=${locale}`;

    try {
        const data = await fetch(url);
        const result = await data.json();

        return result;
    } catch (err) {
        console.log(err);
    }
};

export default fetchCurrentWeather;
