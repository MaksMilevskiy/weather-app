const fetchCitiesAutocomplete = async (name, state, country) => {
    const API_KEY = import.meta.env.VITE_WEATHER_APP_KEY;
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${name}${state ? ',' + state : ''}${country ? ',' + country : ''}&limit=5&appid=${API_KEY}`;

    try {
        const data = await fetch(url);
        const result = await data.json();

        return result;
    } catch (err) {
        console.log(err);
    }
};

export default fetchCitiesAutocomplete;
