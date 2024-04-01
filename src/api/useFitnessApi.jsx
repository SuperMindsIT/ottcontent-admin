import { useEffect, useState } from "react";
import { appsApi } from "./api";

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
      console.log("Fitness posted successfully:", response.data);
      fetchData(); // Refresh data after posting
    } catch (error) {
      console.error("Error posting fitness:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const putData = async (id, fitnessData) => {
    try {
      setIsLoading(true);
      const response = await appsApi.put(`/fitness/${id}`, fitnessData);
      console.log("Fitness updated successfully:", response.data);
      fetchData(); // Refresh data after updating
    } catch (error) {
      console.error("Error updating fitness:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteData = async (id) => {
    try {
      setIsLoading(true);
      const response = await appsApi.delete(`/fitness/${id}`);
      console.log("Fitness deleted successfully:", response.data);
      fetchData(); // Refresh data after posting
    } catch (error) {
      console.error("Error deleting fitness:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDataById = async (id) => {
    try {
      setIsLoading(true);
      const response = await appsApi.get(`/fitness/${id}`);
      console.log("Fitness data by id:", response.data);
      setFitnessById(response?.data);
      fetchData(); // Refresh data after posting
    } catch (error) {
      console.error("Error getting fitness by id:", error);
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
  };
};

export default useFitnessApi;
