import { useCallback, useEffect, useState } from "react";
import { appsApi } from "./api";
import { toast } from "react-toastify";

const useWallpapersApi = () => {
  const [data, setData] = useState([]);
  const [wallpaperById, setWallpaperById] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [fetchDataError, setFetchDataError] = useState(null);
  // const [postDataError, setPostDataError] = useState(null);
  // const [putDataError, setPutDataError] = useState(null);
  // const [deleteDataError, setDeleteDataError] = useState(null);
  // const [getDataByIdError, setGetDataByIdError] = useState(null);
  // const [deleteImageByIdError, setDeleteImageByIdError] = useState(null);
  const [errors, setErrors] = useState({});

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data } = await appsApi.get("/wallpapers");
      setData(data);
      setIsLoading(false);
      clearError("fetchData"); // Clear error on success
    } catch (error) {
      // setFetchDataError(error);
      setErrors((prevErrors) => ({ ...prevErrors, fetchData: error }));
      console.error(error);
    }
  };

  const postThumbnail = async (id, thumbnailData) => {
    const intId = parseInt(id);
    let response;
    try {
      response = await appsApi.post(
        `/wallpapers/${intId}/image`,
        thumbnailData
      );
      clearError("postThumbnail");
      clearError("deleteImageById");
      toast.success("Wallpaper posted successfully", "success");
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

  const postData = async (wallpaperData, thumbnailData) => {
    try {
      setIsLoading(true);
      let response;
      if (thumbnailData) {
        response = await appsApi.post("/wallpapers", wallpaperData);
        const intid = parseInt(response?.data?.id);
        await postThumbnail(intid, thumbnailData);
        clearError("postData"); // Clear error on success
      }
      toast.success("Wallpaper Created Successfully", "success");
      toast.success(response.data.message, "success");
      fetchData(); // Refresh data after posting
      getDataById(intid);
    } catch (error) {
      // setPostDataError(error);
      if (error?.response?.status !== 409) {
        setErrors((prevErrors) => ({ ...prevErrors, postData: error }));
        toast.error(error.response?.data?.message || error.message, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const putData = async (id, wallpaperData, thumbnailData) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      let response;
      if (thumbnailData) {
        response = await appsApi.put(`/wallpapers/${intid}`, wallpaperData);
        await postThumbnail(intid, thumbnailData);
        clearError("putData"); // Clear error on success
      }
      toast.success("Wallpaper Updated Successfully", "success");
      toast.success(response.data.message, "success");
      fetchData();
      getDataById(intid);
    } catch (error) {
      // setPutDataError(error);
      if (error?.response?.status !== 409) {
        setErrors((prevErrors) => ({ ...prevErrors, putData: error }));
        toast.error(error.response?.data?.message || error.message, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteData = async (id) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      await appsApi.delete(`/wallpapers/${intid}`);
      clearError("deleteData"); // Clear error on success
      toast.success("Wallpaper Deleted Successfully", "success");
      fetchData(); // Refresh data after posting
    } catch (error) {
      // setDeleteDataError(error);
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
      const response = await appsApi.get(`/wallpapers/${intid}`);
      clearError("getDataById"); // Clear error on success
      setWallpaperById(response?.data);
      fetchData(); // Refresh data after posting
    } catch (error) {
      // setGetDataByIdError(error);
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
      const response = await appsApi.delete(`/wallpapers/${intid}/image`);
      clearError("deleteImageById"); // Clear error on success
      toast.success(response.data.message, "success");
      getDataById(intid);
    } catch (error) {
      // setDeleteImageByIdError(error);
      setErrors((prevErrors) => ({ ...prevErrors, deleteImageById: error }));
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // const hasApiErrors = () => {
  //   const errors = [
  //     fetchDataError,
  //     postDataError,
  //     putDataError,
  //     deleteDataError,
  //     deleteImageByIdError,
  //     getDataByIdError,
  //   ];

  //   return errors.some((error) => error && error.length > 0);
  // };

  const clearError = (key) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[key]; // Remove the error for the key if it exists
      return newErrors;
    });
  };

  const hasApiErrors = useCallback(() => {
    console.log(errors);
    return Object.values(errors).some((error) => error != null);
  }, [errors]);

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    isLoading,
    wallpaperById,
    hasApiErrors,
    postData,
    deleteData,
    getDataById,
    putData,
    deleteImageById,
  };
};

export default useWallpapersApi;
