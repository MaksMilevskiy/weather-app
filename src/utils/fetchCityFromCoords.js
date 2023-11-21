const fetchCityFromCoords = async (lat, lon, locale) => {
    const API_KEY = import.meta.env.VITE_WEATHER_APP_KEY;
    const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=${locale}`;

    try {
        const data = await fetch(url);
        const result = await data.json();

        return result[0];
    } catch (err) {
        console.log(err);
    }
};

export default fetchCityFromCoords;
