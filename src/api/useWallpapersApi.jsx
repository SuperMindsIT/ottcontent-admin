import { useEffect, useState } from "react";
import { appsApi } from "./api";
import { toast } from "react-toastify";

const useWallpapersApi = () => {
  const [data, setData] = useState([]);
  const [wallpaperById, setWallpaperById] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data } = await appsApi.get("/wallpapers");
      // console.log(data, "games data");
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const postData = async (wallpaperData, thumbnailData) => {
    try {
      setIsLoading(true);
      let response;
      response = await appsApi.post("/wallpapers", wallpaperData);
      response = await appsApi.post(
        `/wallpapers/${response.data.id}/image`,
        thumbnailData
      );
      toast.success("Wallpaper Created Successfully", "success");
      toast.success(response.data.message, "success");
      fetchData(); // Refresh data after posting
      getDataById(response?.data?.id);
    } catch (error) {
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const putData = async (id, wallpaperData, thumbnailData) => {
    try {
      setIsLoading(true);
      let response;
      response = await appsApi.put(`/wallpapers/${id}`, wallpaperData);
      response = await appsApi.post(`/wallpapers/${id}/image`, thumbnailData);
      toast.success("Game Updated Successfully", "success");
      toast.success(response.data.message, "success");
      fetchData();
      getDataById(id);
    } catch (error) {
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteData = async (id) => {
    try {
      setIsLoading(true);
      const response = await appsApi.delete(`/wallpapers/${id}`);
      toast.success("Wallpaper Deleted Successfully", "success");
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
      const response = await appsApi.get(`/wallpapers/${id}`);
      // console.log("Wallpaper data by id:", response.data);
      setWallpaperById(response?.data);
      fetchData(); // Refresh data after posting
    } catch (error) {
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteImageById = async (id) => {
    try {
      setIsLoading(true);
      const response = await appsApi.delete(`/wallpapers/${id}/image`);
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
    wallpaperById,
    postData,
    deleteData,
    getDataById,
    putData,
    deleteImageById,
  };
};

export default useWallpapersApi;
