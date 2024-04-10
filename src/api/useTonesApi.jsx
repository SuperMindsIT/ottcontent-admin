import { useEffect, useState } from "react";
import { appsApi } from "./api";
import { toast } from "react-toastify";

const useTonesApi = () => {
  const [data, setData] = useState([]);
  const [toneById, setToneById] = useState([]);
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
      const { data } = await appsApi.get("/tones");
      setData(data);
      setIsLoading(false);
    } catch (error) {
      setFetchDataError(error);
      console.error(error);
    }
  };

  const postData = async (toneData, audioData) => {
    try {
      setIsLoading(true);
      let response;
      response = await appsApi.post("/tones", toneData);
      const intid = parseInt(response?.data?.id);
      response = await appsApi.post(`/tones/${intid}/audio`, audioData);
      toast.success("Tone Created Successfully", "success");
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

  const putData = async (id, toneData, audioData) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      let response;
      response = await appsApi.put(`/tones/${intid}`, toneData);
      response = await appsApi.post(`/tones/${intid}/audio`, audioData);
      toast.success("Tone Updated Successfully", "success");
      toast.success(response.data.message, "success");
      fetchData(); // Refresh data after updating
      getDataById(intid);
    } catch (error) {
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteData = async (id) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      const response = await appsApi.delete(`/tones/${intid}`);
      toast.success("Tone Deleted Successfully", "success");
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
      const response = await appsApi.get(`/tones/${intid}`);
      setToneById(response?.data);
      fetchData(); // Refresh data after posting
    } catch (error) {
      setGetDataByIdError(error);
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteToneById = async (id) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      const response = await appsApi.delete(`/tones/${intid}/audio`);
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
    toneById,
    hasApiErrors,
    postData,
    deleteData,
    putData,
    getDataById,
    deleteToneById,
  };
};

export default useTonesApi;
