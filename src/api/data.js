export async function fetchDataFromApi() {
  try {
    const response = await fetch("http://localhost:3001/drive");
    if (!response.ok) {
      throw new Error("Error fetching data from API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data from API", error);
    return null;
  }
}
