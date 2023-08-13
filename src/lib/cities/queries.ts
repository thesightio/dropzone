import { useQuery } from "react-query";
import { fetchCity } from "./api";

export const useCityQuery = (defaultCity: string = "Подольск") => useQuery(
    ["city"],
    fetchCity,
    { initialData: { city: defaultCity } },
)