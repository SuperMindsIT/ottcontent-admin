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
      clearError("fetchData"); // Clear error on success
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, fetchData: error }));
      console.error(error);
    }
  };

  const postThumbnail = async (gameId, thumbnailData) => {
    const intId = parseInt(gameId);
    let response;
    clearError("postThumbnail");
    clearError("deleteImageById");
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
      setErrors((prevErrors) => ({ ...prevErrors, postThumbnail: error }));
      // console.log(error.response.data.message, "status is not 409");
      throw error;
    }
  };

  const postData = async (gameData, thumbnailData) => {
    try {
      setIsLoading(true);
      let response;
      if (thumbnailData) {
        response = await appsApi.post("/games", gameData);
        const intid = parseInt(response?.data?.id);
        await postThumbnail(intid, thumbnailData);
        clearError("postData"); // Clear error on success
        clearError("postThumbnail");
      }
      toast.success("Game Created Successfully", "success");
      toast.success(response.data.message, "success");
      fetchData();
      // getDataById(intid);
    } catch (error) {
      // console.log(error?.response?.status);
      if (error?.response?.status !== 409) {
        setErrors((prevErrors) => ({ ...prevErrors, postData: error }));
        toast.error(error.response?.data?.message || error.message, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const putData = async (id, gameData, thumbnailData) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      let response;
      if (thumbnailData) {
        response = await appsApi.put(`/games/${intid}`, gameData);
        await postThumbnail(intid, thumbnailData);
        clearError("putData"); // Clear error on success
        clearError("postThumbnail");
      }
      toast.success("Game Updated Successfully", "success");
      toast.success(response.data.message, "success");
      fetchData(); // Refresh data after updating
      getDataById(intid);
    } catch (error) {
      console.log(error?.response?.status);
      if (error?.response?.status !== 409) {
        setErrors((prevErrors) => ({ ...prevErrors, putData: error }));
        toast.error(error.response.data.message, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteData = async (id) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      await appsApi.delete(`/games/${intid}`);
      clearError("deleteData"); // Clear error on success
      toast.success("Game Deleted Successfully", "success");
      fetchData(); // Refresh data after posting
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, deleteData: error }));
      if (error?.response?.status !== 404) {
        toast.error(error.response.data.message, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getDataById = async (id) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      const response = await appsApi.get(`/games/${intid}`);
      clearError("getDataById"); // Clear error on success
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
      clearError("deleteImageById"); // Clear error on success
      toast.success(response.data.message, "success");
      getDataById(intid);
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, deleteImageById: error }));
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // const clearError = (key) => {
  //   setErrors((prevErrors) => {
  //     const newErrors = { ...prevErrors };
  //     delete newErrors[key]; // Remove the error for the key if it exists
  //     return newErrors;
  //   });
  // };

  const clearError = (key) => {
    console.log(`Clearing error for key: ${key}`);
    setErrors((prevErrors) => {
      if (key in prevErrors) {
        const { [key]: removedError, ...newErrors } = prevErrors;
        console.log(`Error cleared. New errors:`, newErrors);
        return newErrors;
      }
      // console.log(`No change in errors as key ${key} did not exist.`);
      return prevErrors;
    });
  };

  const hasApiErrors = useCallback(() => {
    console.log(errors);
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
    errors,
    hasApiErrors,
    postData,
    deleteData,
    getDataById,
    putData,
    deleteImageById,
  };
};

export default useGamesApi;
