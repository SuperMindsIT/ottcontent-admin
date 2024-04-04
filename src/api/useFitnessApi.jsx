import { useEffect, useState } from "react";
import { appsApi } from "./api";
import { toast } from "react-toastify";

const useFitnessApi = () => {
  const [data, setData] = useState([]);
  const [fitnessById, setFitnessById] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data } = await appsApi.get("/fitness");
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching fitness:", error);
    }
  };

  const postData = async (fitnessData, imageData) => {
    try {
      setIsLoading(true);
      let response;
      response = await appsApi.post("/fitness", fitnessData);
      response = await appsApi.post(
        `/fitness/${response.data.id}/image`,
        imageData
      );
      toast.success("Fitness Workout Created Successfully", "success");
      toast.success(response.data.message, "success");
      getDataById(response?.data?.id);
      fetchData(); // Refresh data after posting
    } catch (error) {
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const putData = async (id, fitnessData, thumbnailData) => {
    try {
      setIsLoading(true);
      let response;
      response = await appsApi.put(`/fitness/${id}`, fitnessData);
      response = await appsApi.post(`/fitness/${id}/image`, thumbnailData);
      toast.success("Fitness Workout Updated Successfully", "success");
      toast.success(response.data.message, "success");
      getDataById(id);
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
      const response = await appsApi.delete(`/fitness/${id}`);
      toast.success("Game Deleted Successfully", "success");
      fetchData(); // Refresh data after posting
    } catch (error) {
      console.error("Error deleting fitness:", error);
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getDataById = async (id) => {
    try {
      setIsLoading(true);
      const response = await appsApi.get(`/fitness/${id}`);
      setFitnessById(response?.data);
      fetchData(); // Refresh data after posting
    } catch (error) {
      console.error("Error getting fitness by id:", error);
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteImageById = async (id) => {
    try {
      setIsLoading(true);
      const response = await appsApi.delete(`/fitness/${id}/image`);
      toast.success(response.data.message, "success");
      getDataById(id);
    } catch (error) {
      console.error("Error posting game:", error);
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
    fitnessById,
    postData,
    deleteData,
    getDataById,
    putData,
    deleteImageById,
  };
};

export default useFitnessApi;
