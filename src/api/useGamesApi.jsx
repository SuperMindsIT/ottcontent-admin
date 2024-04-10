import { useCallback, useEffect, useState } from "react";
import { appsApi } from "./api";
import { toast } from "react-toastify";

const useGamesApi = () => {
  const [data, setData] = useState([]);
  const [gameById, setGameById] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data } = await appsApi.get("/games");
      setData(data);
      setIsLoading(false);
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, fetchData: error }));
      console.error(error);
    }
  };

  const postThumbnail = async (gameId, thumbnailData) => {
    const intId = parseInt(gameId);
    try {
      const response = await appsApi.post(
        `/games/${intId}/thumbnail`,
        thumbnailData
      );

      toast.success("Thumbnail posted successfully", "success");
      return response;
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, postThumbnail: error }));
      toast.error(error.response?.data?.message || error.message, "error");
      // throw error; // rethrow the error to handle it in the calling function
    }
  };

  const postData = async (gameData, thumbnailData) => {
    try {
      setIsLoading(true);
      // Check if the thumbnail data is present

      if (thumbnailData === null || thumbnailData === "Not available") {
        throw new Error("Thumbnail image is required to create a game.");
      }
      let response;
      if (thumbnailData && !hasApiErrors()) {
        response = await appsApi.post("/games", gameData);
      }
      const intid = parseInt(response?.data?.id);
      await postThumbnail(intid, thumbnailData);
      toast.success("Game Created Successfully", "success");
      toast.success(response.data.message, "success");
      fetchData();
      getDataById(intid);
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, postData: error }));
      toast.error(error.response?.data?.message || error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const putData = async (id, gameData, thumbnailData) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      let response;
      if (
        (thumbnailData !== null || thumbnailData !== "Not available") &&
        !hasApiErrors()
      ) {
        response = await appsApi.put(`/games/${intid}`, gameData);
        await postThumbnail(intid, thumbnailData);
      }

      toast.success("Game Updated Successfully", "success");
      toast.success(response.data.message, "success");
      fetchData(); // Refresh data after updating
      getDataById(intid);
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, putData: error }));
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteData = async (id) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      await appsApi.delete(`/games/${intid}`);
      toast.success("Game Deleted Successfully", "success");
      fetchData(); // Refresh data after posting
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, deleteData: error }));
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getDataById = async (id) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      const response = await appsApi.get(`/games/${intid}`);
      setGameById(response?.data);
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, getDataById: error }));
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteImageById = async (id) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      const response = await appsApi.delete(`/games/${intid}/thumbnail`);
      toast.success(response.data.message, "success");
      getDataById(intid);
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, deleteImageById: error }));
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const hasApiErrors = useCallback(() => {
    return Object.values(errors).some((error) => error != null);
  }, [errors]);

  useEffect(() => {
    fetchData();
    // hasApiErrors();
  }, []);

  return {
    data,
    isLoading,
    gameById,
    hasApiErrors,
    postData,
    deleteData,
    getDataById,
    putData,
    deleteImageById,
  };
};

export default useGamesApi;
