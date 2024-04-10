import { useEffect, useState } from "react";
import { appsApi } from "./api";
import { toast } from "react-toastify";

const useWallpapersApi = () => {
  const [data, setData] = useState([]);
  const [wallpaperById, setWallpaperById] = useState([]);
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
      const { data } = await appsApi.get("/wallpapers");
      setData(data);
      setIsLoading(false);
    } catch (error) {
      setFetchDataError(error);
      console.error(error);
    }
  };

  const postData = async (wallpaperData, thumbnailData) => {
    try {
      setIsLoading(true);
      let response;
      response = await appsApi.post("/wallpapers", wallpaperData);
      const intid = parseInt(response?.data?.id);
      if (thumbnailData !== null || thumbnailData !== "Not available") {
        response = await appsApi.post(
          `/wallpapers/${intid}/image`,
          thumbnailData
        );
      }
      toast.success("Wallpaper Created Successfully", "success");
      toast.success(response.data.message, "success");
      fetchData(); // Refresh data after posting
      getDataById(intid);
    } catch (error) {
      setPostDataError(error);
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const putData = async (id, wallpaperData, thumbnailData) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      let response;
      response = await appsApi.put(`/wallpapers/${intid}`, wallpaperData);
      if (thumbnailData !== null || thumbnailData !== "Not available") {
        response = await appsApi.post(
          `/wallpapers/${intid}/image`,
          thumbnailData
        );
      }
      toast.success("Wallpaper Updated Successfully", "success");
      toast.success(response.data.message, "success");
      fetchData();
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
      const response = await appsApi.delete(`/wallpapers/${intid}`);
      toast.success("Wallpaper Deleted Successfully", "success");
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
      const response = await appsApi.get(`/wallpapers/${intid}`);
      setWallpaperById(response?.data);
      fetchData(); // Refresh data after posting
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
      const response = await appsApi.delete(`/wallpapers/${intid}/image`);
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
