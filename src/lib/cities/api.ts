type CityData = {
    city: string;
}

export const fetchCity = async (): Promise<CityData> => {
    const res = await fetch("/api/city");
    return res.json();
}
