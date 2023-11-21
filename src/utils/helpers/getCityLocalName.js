const getCityLocalName = (city, locale) => {
    return city.local_names?.[locale] || city.name;
};

export default getCityLocalName