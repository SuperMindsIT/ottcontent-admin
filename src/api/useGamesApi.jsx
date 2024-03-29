import { useEffect, useState } from "react";
import { appsApi } from "./api";

const useGamesApi = () => {
  const [data, setData] = useState([]);
  const [gameById, setGameById] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data } = await appsApi.get("/games");
      // console.log(data, "games data");
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const postData = async (gameData, thumbnailData) => {
    try {
      setIsLoading(true);
      let response;
      response = await appsApi.post("/games", gameData);
      response = await appsApi.post(
        `/games/${response.data.id}/thumbnail`,
        thumbnailData
      );
      console.log("Game posted successfully:", response.data);
      fetchData(); // Refresh data after posting
    } catch (error) {
      console.error("Error posting game:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const putData = async (id, gameData, thumbnailData) => {
    try {
      setIsLoading(true);
      const response = await appsApi.put(`/games/${id}`, gameData);
      console.log("Game updated successfully:", response.data);
      // await appsApi.put(`/games/${id}/thumbnail`, thumbnailData);
      // console.log("Thumbnail updated successfully");
      fetchData(); // Refresh data after updating
    } catch (error) {
      console.error("Error updating game:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteData = async (id) => {
    try {
      setIsLoading(true);
      const response = await appsApi.delete(`/games/${id}`);
      console.log("Game deleted successfully:", response.data);
      fetchData(); // Refresh data after posting
    } catch (error) {
      console.error("Error posting game:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDataById = async (id) => {
    try {
      setIsLoading(true);
      const response = await appsApi.get(`/games/${id}`);
      console.log("Game data by id:", response.data);
      setGameById(response?.data);
      fetchData(); // Refresh data after posting
    } catch (error) {
      console.error("Error posting game:", error);
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
    gameById,
    postData,
    deleteData,
    getDataById,
    putData,
  };
};

export default useGamesApi;
