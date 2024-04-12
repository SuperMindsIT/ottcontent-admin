import { useEffect, useState } from "react";
import { appsApi } from "./api";
import { toast } from "react-toastify";

const useFitnessApi = () => {
  const [data, setData] = useState([]);
  const [fitnessById, setFitnessById] = useState([]);
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
      const { data } = await appsApi.get("/fitness");
      setData(data);
      setIsLoading(false);
    } catch (error) {
      setFetchDataError(error);
      console.error("Error fetching fitness:", error);
    }
  };

  const postThumbnail = async (id, thumbnailData) => {
    const intId = parseInt(id);
    try {
      const response = await appsApi.post(
        `/fitness/${intId}/image`,
        thumbnailData
      );
      toast.success("Thumbnail posted successfully", "success");
      return response;
    } catch (error) {
      if (error?.response?.status === 409) {
        console.log("image conflict");
        return;
      }
      toast.error(error.response.data.message, "error");
      console.log(error.response.data.message, "status is not 409");
      setErrors((prevErrors) => ({ ...prevErrors, postThumbnail: error }));

      // setErrors((prevErrors) => ({ ...prevErrors, postThumbnail: error }));
      // toast.error(error.response?.data?.message || error.message, "error");
      throw error; // rethrow the error to handle it in the calling function
    }
  };

  const postData = async (fitnessData, thumbnailData) => {
    try {
      setIsLoading(true);
      let response;
      response = await appsApi.post("/fitness", fitnessData);
      const intid = parseInt(response?.data?.id);
      await postThumbnail(intid, thumbnailData);
      toast.success("Fitness Workout Created Successfully", "success");
      toast.success(response.data.message, "success");
      getDataById(intid);
      fetchData(); // Refresh data after posting
    } catch (error) {
      setPostDataError(error);
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const putData = async (
    id,
    fitnessData,
    thumbnailData,
    selectedFileBackend
  ) => {
    const intid = parseInt(id);
    console.log(selectedFileBackend, "selected file backend in put data");
    try {
      setIsLoading(true);
      let response;
      console.log(thumbnailData, "thumbnail in putData");
      response = await appsApi.put(`/fitness/${intid}`, fitnessData);
      if (
        selectedFileBackend !== null &&
        selectedFileBackend !== "Not available"
      ) {
        await postThumbnail(intid, thumbnailData);
      }
      toast.success("Fitness Workout Updated Successfully", "success");
      toast.success(response.data.message, "success");
      getDataById(intid);
      fetchData(); // Refresh data after updating
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
      const response = await appsApi.delete(`/fitness/${intid}`);
      toast.success("Fitness Deleted Successfully", "success");
      fetchData(); // Refresh data after posting
    } catch (error) {
      setDeleteDataError(error);
      console.error("Error deleting fitness:", error);
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getDataById = async (id) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      const response = await appsApi.get(`/fitness/${intid}`);
      setFitnessById(response?.data);
      fetchData(); // Refresh data after posting
    } catch (error) {
      setGetDataByIdError(error);
      console.error("Error getting fitness by id:", error);
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteImageById = async (id) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      const response = await appsApi.delete(`/fitness/${intid}/image`);
      toast.success(response.data.message, "success");
      getDataById(intid);
    } catch (error) {
      setDeleteImageByIdError(error);
      console.error("Error posting Image:", error);
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
    fitnessById,
    hasApiErrors,
    postData,
    deleteData,
    getDataById,
    putData,
    deleteImageById,
  };
};

export default useFitnessApi;
