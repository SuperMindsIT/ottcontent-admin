import { useEffect, useState } from "react";
import { appsApi } from "./api";
import { toast } from "react-toastify";

const useTonesApi = () => {
  const [data, setData] = useState([]);
  const [toneById, setToneById] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data } = await appsApi.get("/tones");
      //   console.log(data, "tones data");
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const postData = async (toneData, audioData) => {
    try {
      setIsLoading(true);
      let response;
      response = await appsApi.post("/tones", toneData);
      response = await appsApi.post(
        `/tones/${response.data.id}/audio`,
        audioData
      );
      toast.success("Tone Created Successfully", "success");
      toast.success(response.data.message, "success");
      fetchData(); // Refresh data after posting
    } catch (error) {
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const putData = async (id, toneData, audioData) => {
    try {
      setIsLoading(true);
      let response;
      response = await appsApi.put(`/tones/${id}`, toneData);
      response = await appsApi.post(`/tones/${id}/audio`, audioData);
      toast.success("Tone Updated Successfully", "success");
      toast.success(response.data.message, "success");
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
      const response = await appsApi.delete(`/tones/${id}`);
      toast.success("Tone Deleted Successfully", "success");
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
      const response = await appsApi.get(`/tones/${id}`);
      // console.log("Tone data by id:", response.data);
      setToneById(response?.data);
      fetchData(); // Refresh data after posting
    } catch (error) {
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteToneById = async (id) => {
    try {
      setIsLoading(true);
      const response = await appsApi.delete(`/tones/${id}/audio`);
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
    toneById,
    postData,
    deleteData,
    putData,
    getDataById,
    deleteToneById,
  };
};

export default useTonesApi;
