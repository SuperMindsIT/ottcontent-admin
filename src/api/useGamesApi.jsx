import { useEffect, useState } from "react";
import { appsApi } from "./api";
import { toast } from "react-toastify";

const useGamesApi = () => {
  const [data, setData] = useState([]);
  const [gameById, setGameById] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data } = await appsApi.get("/games");
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
      toast.success("Game Created Successfully", "success");
      toast.success(response.data.message, "success");
      fetchData();
    } catch (error) {
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const putData = async (id, gameData, thumbnailData) => {
    try {
      setIsLoading(true);
      let response;
      response = await appsApi.put(`/games/${id}`, gameData);
      response = await appsApi.post(`/games/${id}/thumbnail`, thumbnailData);
      toast.success("Game Updated Successfully", "success");
      toast.success(response.data.message, "success");
      fetchData(); // Refresh data after updating
    } catch (error) {
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteData = async (id) => {
    try {
      setIsLoading(true);
      const response = await appsApi.delete(`/games/${id}`);
      toast.success("Game Deleted Successfully", "success");
      fetchData(); // Refresh data after posting
    } catch (error) {
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getDataById = async (id) => {
    try {
      setIsLoading(true);
      const response = await appsApi.get(`/games/${id}`);
      setGameById(response?.data);
    } catch (error) {
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteImageById = async (id) => {
    try {
      setIsLoading(true);
      const response = await appsApi.delete(`/games/${id}/thumbnail`);
      toast.success(response.data.message, "success");
      getDataById(id);
    } catch (error) {
      toast.error(error.response.data.message, "error");
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
    deleteImageById,
  };
};

export default useGamesApi;
