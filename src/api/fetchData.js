import { fetchDataFromApi } from "./data";

export async function handleFetchData() {
  const url = new URL(window.location.href);
  const fetchData = url.searchParams.get("fetchData");
  if (fetchData === "true") {
    const data = await fetchDataFromApi();
    return data;
  }
}
