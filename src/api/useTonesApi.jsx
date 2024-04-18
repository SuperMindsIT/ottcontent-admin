import { useCallback, useEffect, useState } from "react";
import { appsApi } from "./api";
import { toast } from "react-toastify";

const useTonesApi = () => {
  const [data, setData] = useState([]);
  const [toneById, setToneById] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data } = await appsApi.get("/tones");
      setData(data);
      setIsLoading(false);
      clearError("fetchData"); // Clear error on success
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, fetchData: error }));
      console.error(error);
    }
  };

  const postAudio = async (id, audioData) => {
    const intId = parseInt(id);
    let response;
    try {
      response = await appsApi.post(`/tones/${intId}/audio`, audioData);
      clearError("postAudio");
      clearError("deleteToneById");
      toast.success("Audio posted successfully", "success");
      return response;
    } catch (error) {
      console.log(error?.response?.status);
      if (error?.response?.status === 409) {
        console.log("audio conflict");
        return;
      }
      setErrors((prevErrors) => ({ ...prevErrors, postAudio: error }));
      // console.log(error.response.data.message, "status is not 409");
      throw error;
    }
  };

  const postData = async (toneData, audioData) => {
    try {
      setIsLoading(true);
      let response;
      if (audioData) {
        response = await appsApi.post("/tones", toneData);
        const intid = parseInt(response?.data?.id);
        await postAudio(intid, audioData);
        clearError("postData"); // Clear error on success
        // response = await appsApi.post(`/tones/${intid}/audio`, audioData);
      }
      toast.success("Tone Created Successfully", "success");
      toast.success(response.data.message, "success");
      fetchData(); // Refresh data after posting
      // getDataById(intid);
    } catch (error) {
      if (error?.response?.status !== 409) {
        setErrors((prevErrors) => ({ ...prevErrors, postData: error }));
        toast.error(error.response?.data?.message || error.message, "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const putData = async (id, toneData, audioData) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      let response;
      if (audioData) {
        response = await appsApi.put(`/tones/${intid}`, toneData);
        await postAudio(intid, thumbnailData);
        clearError("putData"); // Clear error on success
        clearError("deleteToneById");
      }
      toast.success("Tone Updated Successfully", "success");
      toast.success(response.data.message, "success");
      fetchData(); // Refresh data after updating
      getDataById(intid);
    } catch (error) {
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
      await appsApi.delete(`/tones/${intid}`);
      clearError("deleteData"); // Clear error on success
      toast.success("Tone Deleted Successfully", "success");
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
      const response = await appsApi.get(`/tones/${intid}`);
      clearError("getDataById"); // Clear error on success
      setToneById(response?.data);
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, getDataById: error }));
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
      clearError("deleteToneById"); // Clear error on success
      toast.success(response.data.message, "success");
      getDataById(intid);
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, deleteToneById: error }));
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

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
