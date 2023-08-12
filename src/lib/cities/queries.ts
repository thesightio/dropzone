import { useQuery } from "react-query";
import { fetchCity, fetchFile } from "./api";

export const useCityQuery = (defaultCity: string = "Подольск") => useQuery(
    ["city"],
    fetchCity,
    { initialData: { city: defaultCity } },
)

export const useUploadFile = (data: FormData) => useQuery(
    ['file'],
    fetchFile,
    {
        initialData: data
    }

)