import { useEffect, useState } from "react";
import { appsApi } from "./api";

const useTonesApi = () => {
  const [data, setData] = useState([]);
  const [toneById, setToneById] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data } = await appsApi.get("/tones");
      //   console.log(data, "tones data");
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  //   const postData = async (gameData) => {
  //     try {
  //       setIsLoading(true);
  //       const response = await appsApi.post("/tones", gameData);
  //       console.log("Tone posted successfully:", response.data);
  //       fetchData(); // Refresh data after posting
  //     } catch (error) {
  //       console.error("Error posting Tone:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  const postData = async (toneData, audioData) => {
    try {
      setIsLoading(true);
      let response;
      response = await appsApi.post("/tones", toneData);
      response = await appsApi.post(
        `/tones/${response.data.id}/audio`,
        audioData
      );
      // console.log("Tone posted successfully:", response.data);
      fetchData(); // Refresh data after posting
    } catch (error) {
      console.error("Error posting tone:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const putData = async (id, toneData, audioData) => {
    try {
      setIsLoading(true);
      const response = await appsApi.put(`/tones/${id}`, toneData);
      // console.log("Tone updated successfully:", response.data);
      // await appsApi.put(`/games/${id}/thumbnail`, thumbnailData);
      // console.log("Thumbnail updated successfully");
      fetchData(); // Refresh data after updating
    } catch (error) {
      console.error("Error updating tone:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteData = async (id) => {
    try {
      setIsLoading(true);
      const response = await appsApi.delete(`/tones/${id}`);
      // console.log("Tone deleted successfully:", response.data);
      fetchData(); // Refresh data after posting
    } catch (error) {
      console.error("Error posting tone:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDataById = async (id) => {
    try {
      setIsLoading(true);
      const response = await appsApi.get(`/tones/${id}`);
      // console.log("Tone data by id:", response.data);
      setToneById(response?.data);
      fetchData(); // Refresh data after posting
    } catch (error) {
      console.error("Error posting tone:", error);
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
    toneById,
    postData,
    deleteData,
    putData,
    getDataById,
  };
};

export default useTonesApi;
