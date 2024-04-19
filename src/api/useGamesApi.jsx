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

  const postThumbnail = async (gameId, thumbnailData) => {
    const intId = parseInt(gameId);
    let response;
    try {
      response = await appsApi.post(`/games/${intId}/thumbnail`, thumbnailData);
      toast.success("Thumbnail posted successfully", "success");
      return response;
    } catch (error) {
      console.log(error?.response?.status);
      if (error?.response?.status === 409) {
        console.log("image conflict");
        return;
      }
      toast.error(error.response.data.message, "error");
      console.log(error.response.data.message, "status is not 409");
      setErrors((prevErrors) => ({ ...prevErrors, postThumbnail: error }));

      // setErrors((prevErrors) => ({ ...prevErrors, postThumbnail: error }));
      // console.log(error.response.data.message, "status is not 409");
      throw error;
    }
  };

  const postData = async (gameData, thumbnailData) => {
    try {
      setIsLoading(true);
      let response;
      response = await appsApi.post("/games", gameData);
      const intid = parseInt(response?.data?.id);
      await postThumbnail(intid, thumbnailData);
      toast.success("Game Created Successfully", "success");
      toast.success(response.data.message, "success");
      getDataById(intid);
      fetchData();
    } catch (error) {
      if (error?.response?.status === 409) {
        console.log("image/file conflict");
      }
      setPostDataError(error);
      toast.error(error.response?.data?.message || error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const putData = async (id, gameData, thumbnailData, selectedFileBackend) => {
    const intid = parseInt(id);
    // console.log(selectedFileBackend, "selected file backend in put data");
    try {
      setIsLoading(true);
      let response;
      // console.log(thumbnailData, "thumbnail in putData");
      response = await appsApi.put(`/games/${intid}`, gameData);
      if (
        selectedFileBackend !== null &&
        selectedFileBackend !== "Not available"
      ) {
        await postThumbnail(intid, thumbnailData);
      }
      toast.success("Game Updated Successfully", "success");
      toast.success(response.data.message, "success");
      fetchData(); // Refresh data after updating
      getDataById(intid);
    } catch (error) {
      console.log(error?.response?.status);
      if (error?.response?.status === 409) {
        console.log("image/ file conflict");
        return;
      }
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
      await appsApi.delete(`/games/${intid}`);
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
      fetchData();
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
