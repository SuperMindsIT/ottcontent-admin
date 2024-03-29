import { useEffect, useState } from "react";
import { appsApi } from "./api";

const useTonesApi = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data } = await appsApi.get("/tones");
      console.log(data, "tones data");
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const postData = async (gameData) => {
    try {
      setIsLoading(true);
      const response = await appsApi.post("/tones", gameData);
      console.log("Tone posted successfully:", response.data);
      fetchData(); // Refresh data after posting
    } catch (error) {
      console.error("Error posting Tone:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    isLoading,
    postData,
  };
};

export default useTonesApi;
