import { useCallback, useEffect, useState } from "react";
import { appsApi } from "./api";
import { toast } from "react-toastify";

const useRecipesApi = () => {
  const [data, setData] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState([]);
  const [dataById, setDataById] = useState([]);
  const [dataDetailsById, setDataDetailsById] = useState([]);
  const [recipeCategory, setRecipeCategoryById] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [fetchDataError, setFetchDataError] = useState(null);
  // const [postDataError, setPostDataError] = useState(null);
  // const [putDataError, setPutDataError] = useState(null);
  // const [deleteDataError, setDeleteDataError] = useState(null);
  // const [getDataByIdError, setGetDataByIdError] = useState(null);
  // const [deleteCoverByIdError, setDeleteCoverByIdError] = useState(null);
  // const [deleteThumbnailByIdError, setDeleteThumbnailByIdError] =
  //   useState(null);
  // const [getDataDetailsByIdError, setGetDataDetailsByIdError] = useState(null);

  const [errors, setErrors] = useState({});

  // get recipes data (all the categories)
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data } = await appsApi.get("/recipes/categories");
      setData(data);
    } catch (error) {
      setFetchDataError(error);
      console.error("Error fetching data:", error);
      setErrors((prevErrors) => ({ ...prevErrors, fetchData: error }));
    }
    setIsLoading(false);
  };

  // get the category detail by id
  const fetchCategoryData = async (id) => {
    const intid = parseInt(id);
    setIsLoading(true);
    try {
      const { data } = await appsApi.get(`/recipes/categories/${intid}`);
      setCategoryDetails(data);
    } catch (error) {
      setFetchDataError(error);
      console.error("Error fetching data:", error);
      setErrors((prevErrors) => ({ ...prevErrors, fetchCategoryData: error }));
    }
    setIsLoading(false);
  };

  // add recipe category
  const postData = async (recipesData, coverData, thumbnailData) => {
    try {
      setIsLoading(true);
      let response;
      if (thumbnailData && coverData && !hasApiErrors()) {
        response = await appsApi.post("/recipes/categories", recipesData);
      }
      const intid = parseInt(response?.data?.id);
      response = await appsApi.post(
        `/recipes/categories/${intid}/cover`,
        coverData
      );
      response = await appsApi.post(
        `/recipes/categories/${intid}/thumbnail`,
        thumbnailData
      );
      toast.success("Fitness Workout Created Successfully", "success");
      toast.success(response.data.message, "success");
      getDataById(intid);
      fetchData(); // Refresh data after posting
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, postData: error }));
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  //   // Add recipe category
  // const postData = async (recipesData, coverData, thumbnailData) => {
  //   setIsLoading(true);
  //   try {
  //     const formData = new FormData();

  //     // Append text fields to formData
  //     Object.keys(recipesData).forEach(key => {
  //       formData.append(key, recipesData[key]);
  //     });

  //     // Append files to formData
  //     if (coverFile) {
  //       formData.append("cover", coverFile);
  //     }
  //     if (thumbnailFile) {
  //       formData.append("thumbnail", thumbnailFile);
  //     }

  //     const response = await appsApi.post("/recipes/categories", formData);
  //     toast.success("Recipe Created Successfully");
  //     fetchData(); // Refresh data after posting

  //     return response; // Return the response for further processing
  //   } catch (error) {
  //     console.error("Error posting data:", error);
  //     setPostDataError(error);
  //     toast.error("Error creating recipe");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // edit recipe category
  const putData = async (id, recipesData, coverData, thumbnailData) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      let response;
      if (thumbnailData && coverData && !hasApiErrors()) {
        response = await appsApi.put(
          `/recipes/categories/${intid}`,
          recipesData
        );
      }
      response = await appsApi.post(
        `/recipes/categories/${intid}/cover`,
        coverData
      );
      response = await appsApi.post(
        `/recipes/categories/${intid}/thumbnail`,
        thumbnailData
      );
      toast.success("Fitness Workout Updated Successfully", "success");
      toast.success(response.data.message, "success");
      getDataById(intid);
      fetchData(); // Refresh data after updating
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, putData: error }));
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // delete recipe category
  const deleteData = async (id) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      const response = await appsApi.delete(`/recipes/categories/${intid}`);
      toast.success("Recipe category Deleted Successfully", "success");
      fetchData(); // Refresh data after posting
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, deleteData: error }));
      console.error("Error deleting recipe category:", error);
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // fetch recipes from category
  const getDataById = async (id) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      const response = await appsApi.get(
        `/recipes/categories/${intid}/subcategories`
      );
      setRecipeCategoryById(response?.data);
      fetchData(); // Refresh data after posting
      setDataById(response?.data);
      // return response?.data;
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, getDataById: error }));
      console.error("Error getting recipe category by id:", error);
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // fetch recipe category by id e.g. dinner/ breakfast etc
  const getDataDetailsById = async (id) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      const response = await appsApi.get(`/recipes/categories/${intid}`);
      // setRecipeCategoryDetailsById(response?.data);
      fetchData(); // Refresh data after posting
      setDataDetailsById(response?.data);
      // return response?.data;
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, getDataDetailsById: error }));
      console.error("Error getting recipe category by id:", error);
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCoverById = async (id) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      const response = await appsApi.delete(
        `/recipes/categories/${intid}/cover`
      );
      toast.success(response.data.message, "success");
      getDataById(intid);
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, deleteCoverById: error }));
      console.error("Error posting game:", error);
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteThumbnailById = async (id) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      const response = await appsApi.delete(
        `/recipes/categories/${intid}/thumbnail`
      );
      toast.success(response.data.message, "success");
      getDataById(intid);
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        deleteThumbnailById: error,
      }));
      console.error("Error posting thumbnail:", error);
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // const hasApiErrors = () => {
  //   const errors = [
  //     fetchDataError,
  //     postDataError,
  //     putDataError,
  //     deleteDataError,
  //     deleteCoverByIdError,
  //     deleteThumbnailByIdError,
  //     getDataByIdError,
  //     getDataDetailsByIdError,
  //   ];

  //   return errors.some((error) => error && error.length > 0);
  // };

  const hasApiErrors = useCallback(() => {
    return Object.values(errors).some((error) => error != null);
  }, [errors]);

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    categoryDetails,
    dataById,
    dataDetailsById,
    isLoading,
    recipeCategory,
    hasApiErrors,
    postData,
    deleteData,
    getDataById,
    getDataDetailsById,
    putData,
    deleteCoverById,
    deleteThumbnailById,
    fetchCategoryData,
  };
};

export default useRecipesApi;