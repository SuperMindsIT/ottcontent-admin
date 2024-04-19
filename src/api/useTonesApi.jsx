import { useCallback, useEffect, useState } from "react";
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
  const [deleteToneByIdError, setDeleteToneByIdError] = useState(null);

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

  const postAudio = async (id, audioData) => {
    const intId = parseInt(id);
    let response;
    try {
      response = await appsApi.post(`/tones/${intId}/audio`, audioData);
      toast.success("Audio posted successfully", "success");
      return response;
    } catch (error) {
      console.log(error?.response?.status);
      if (error?.response?.status === 409) {
        console.log("audio conflict");
        return;
      }
      toast.error(error.response.data.message, "error");
      console.log(error.response.data.message, "status is not 409");
      setErrors((prevErrors) => ({ ...prevErrors, postAudio: error }));
      // console.log(error.response.data.message, "status is not 409");
      throw error;
    }
  };

  const postData = async (toneData, audioData) => {
    try {
      setIsLoading(true);
      let response;
      response = await appsApi.post("/tones", toneData);
      const intid = parseInt(response?.data?.id);
      await postAudio(intid, audioData);
      toast.success("Tone Created Successfully", "success");
      toast.success(response.data.message, "success");
      fetchData(); // Refresh data after posting
      getDataById(intid);
    } catch (error) {
      if (error?.response?.status === 409) {
        console.log("file conflict");
      }
      // setErrors((prevErrors) => ({ ...prevErrors, postData: error }));
      setPostDataError(error);
      toast.error(error.response?.data?.message || error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const putData = async (id, toneData, audioData, selectedFileBackend) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      let response;
      response = await appsApi.put(`/tones/${intid}`, toneData);
      if (
        selectedFileBackend !== null &&
        selectedFileBackend !== "Not available"
      ) {
        await postAudio(intid, audioData);
      }
      toast.success("Tone Updated Successfully", "success");
      toast.success(response.data.message, "success");
      fetchData(); // Refresh data after updating
      getDataById(intid);
    } catch (error) {
      if (error?.response?.status === 409) {
        console.log("image/file conflict");
        return;
      }
      // setErrors((prevErrors) => ({ ...prevErrors, putData: error }));
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
      await appsApi.delete(`/tones/${intid}`);
      toast.success("Tone Deleted Successfully", "success");
      fetchData(); // Refresh data after posting
    } catch (error) {
      // setErrors((prevErrors) => ({ ...prevErrors, deleteData: error }));
      setDeleteDataError(error);
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
      setToneById(response?.data);
      fetchData();
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
      setDeleteToneByIdError(error);
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

  // const hasApiErrors = useCallback(() => {
  //   console.log(errors);
  //   return Object.values(errors).some((error) => error != null);
  // }, [errors]);

  const hasApiErrors = () => {
    const errors = [
      fetchDataError,
      postDataError,
      putDataError,
      deleteDataError,
      deleteToneByIdError,
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
