import { useEffect, useState } from "react";
import { appsApi } from "./api";
import { toast } from "react-toastify";

const useGamesApi = () => {
  const [data, setData] = useState([]);
  const [gameById, setGameById] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchDataError, setFetchDataError] = useState(null);
  const [postDataError, setPostDataError] = useState(null);
  const [putDataError, setPutDataError] = useState(null);
  const [deleteDataError, setDeleteDataError] = useState(null);
  const [getDataByIdError, setGetDataByIdError] = useState(null);
  const [deleteImageByIdError, setDeleteImageByIdError] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data } = await appsApi.get("/games");
      setData(data);
      setIsLoading(false);
    } catch (error) {
      setFetchDataError(error);
      console.error(error);
    }
  };

  const postData = async (gameData, thumbnailData) => {
    try {
      setIsLoading(true);
      // Check if the thumbnail data is present

      // if (thumbnailData === null) {
      //   throw new Error("Thumbnail image is required to create a game.");
      // }
      let response;
      if (thumbnailData && !hasApiErrors()) {
        response = await appsApi.post("/games", gameData);
      }
      const intid = parseInt(response?.data?.id);
      response = await appsApi.post(`/games/${intid}/thumbnail`, thumbnailData);
      // console.log(thumbnailData, "thumbnail data");
      toast.success("Game Created Successfully", "success");
      toast.success(response.data.message, "success");
      fetchData();
      getDataById(intid);
    } catch (error) {
      setPostDataError(error);
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
      if (thumbnailData && !hasApiErrors()) {
        response = await appsApi.put(`/games/${intid}`, gameData);
      }
      response = await appsApi.post(`/games/${intid}/thumbnail`, thumbnailData);
      toast.success("Game Updated Successfully", "success");
      toast.success(response.data.message, "success");
      fetchData(); // Refresh data after updating
      getDataById(intid);
    } catch (error) {
      setPutDataError(error);
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteData = async (id) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      const response = await appsApi.delete(`/games/${intid}`);
      toast.success("Game Deleted Successfully", "success");
      fetchData(); // Refresh data after posting
    } catch (error) {
      setDeleteDataError(error);
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
      setGetDataByIdError(error);
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
      setDeleteImageByIdError(error);
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const hasApiErrors = () => {
    const errors = [
      fetchDataError,
      postDataError,
      putDataError,
      deleteDataError,
      deleteImageByIdError,
      getDataByIdError,
    ];

    return errors.some((error) => error && error.length > 0);
  };

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
