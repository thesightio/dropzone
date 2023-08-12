type CityData = {
    city: string;
}

export const fetchCity = async (): Promise<CityData> => {
    const res = await fetch("/api/city");
    return res.json();
}

export const fetchFile = async (): Promise<FormData> => {
    const res = await fetch("/api/upload");
    return res.json()
}