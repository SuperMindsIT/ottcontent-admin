import { useEffect, useState } from "react";
import { appsApi } from "./api";

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
      console.log("Wallpaper posted successfully:", response.data);
      fetchData(); // Refresh data after posting
    } catch (error) {
      console.error("Error posting wallpaper:", error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const putData = async (id, wallpaperData, thumbnailData) => {
    try {
      setIsLoading(true);
      const response = await appsApi.put(`/wallpapers/${id}`, wallpaperData);
      console.log("Wallpaper updated successfully:", response.data);
      // await appsApi.put(`/games/${id}/thumbnail`, thumbnailData);
      // console.log("Thumbnail updated successfully");
      fetchData(); // Refresh data after updating
    } catch (error) {
      console.error("Error updating wallpaper:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteData = async (id) => {
    try {
      setIsLoading(true);
      const response = await appsApi.delete(`/wallpapers/${id}`);
      console.log("Wallpaper deleted successfully:", response.data);
      fetchData(); // Refresh data after posting
    } catch (error) {
      console.error("Error posting wallpaper:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDataById = async (id) => {
    try {
      setIsLoading(true);
      const response = await appsApi.get(`/wallpapers/${id}`);
      console.log("Wallpaper data by id:", response.data);
      setWallpaperById(response?.data);
      fetchData(); // Refresh data after posting
    } catch (error) {
      console.error("Error posting wallpaper:", error);
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
  };
};

export default useWallpapersApi;
