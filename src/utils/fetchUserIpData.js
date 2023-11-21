const fetchUserIpData = async () => {
    const TOKEN = import.meta.env.VITE_IPINFO_TOKEN;

    const url = `https://ipinfo.io?token=${TOKEN}`;

    try {
        const data = await fetch(url);
        const result = await data.json();

        return result;
    } catch (err) {
        console.log(err);
    }
};

export default fetchUserIpData;
