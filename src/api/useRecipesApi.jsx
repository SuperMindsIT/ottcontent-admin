import { useCallback, useEffect, useState } from "react";
import { appsApi } from "./api";
import { toast } from "react-toastify";

const useRecipesApi = () => {
  const [data, setData] = useState([]);
  const [subCategoryDetails, setSubCategoryDetails] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState([]);
  const [dataById, setDataById] = useState([]);
  const [dataDetailsById, setDataDetailsById] = useState([]);
  const [recipeCategory, setRecipeCategoryById] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [errors, setErrors] = useState({});

  // get recipes data (all the categories)
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data } = await appsApi.get("/recipes/categories");
      setData(data);
    } catch (error) {
      toast.error(error.response.data.message, "error");
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
      toast.error(error.response.data.message, "error");
      console.error("Error fetching data:", error);
      setErrors((prevErrors) => ({ ...prevErrors, fetchCategoryData: error }));
    }
    setIsLoading(false);
  };

  const postCategoryThumbnail = async (id, thumbnailData) => {
    const intId = parseInt(id);
    let response;
    try {
      if (thumbnailData !== null || thumbnailData !== "Not available") {
        let thumbnailFormData = new FormData();
        thumbnailFormData.append("thumbnail", thumbnailData);
        response = await appsApi.post(
          `/recipes/categories/${intId}/thumbnail`,
          thumbnailFormData
        );
      }

      toast.success("Thumbnail posted successfully", "success");
      console.log(response, "in thumbnail");
      return response;
    } catch (error) {
      if (error?.response?.status === 409) {
        console.log("image conflict");
        return;
      }
      setErrors((prevErrors) => ({ ...prevErrors, postThumbnail: error }));
      toast.error(error.response.data.message, "error");
      console.log(error.response.data.message, "status is not 409");
    }
  };

  const postCategoryCover = async (id, coverData) => {
    const intId = parseInt(id);
    let response;
    try {
      if (coverData !== null || coverData !== "Not available") {
        let coverFormData = new FormData();
        coverFormData.append("cover", coverData);
        response = await appsApi.post(
          `/recipes/categories/${intId}/cover`,
          coverFormData
        );
      }
      toast.success("Cover posted successfully", "success");
      console.log(response, "in cover");
      return response;
    } catch (error) {
      if (error?.response?.status === 409) {
        console.log("image conflict");
        return;
      }
      setErrors((prevErrors) => ({ ...prevErrors, postThumbnail: error }));
      toast.error(error.response.data.message, "error");
      console.log(error.response.data.message, "status is not 409");
    }
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
      await postCategoryCover(intid, coverData);
      await postCategoryThumbnail(intid, thumbnailData);
      toast.success("Recipe Category Created Successfully", "success");
      toast.success(response.data.message, "success");
      // fetchData(); // Refresh data after posting
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, postData: error }));
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // edit recipe category
  const putData = async (
    id,
    recipesData,
    coverData,
    thumbnailData,
    selectedCoverBackend,
    selectedThumbnailBackend
  ) => {
    console.log(
      selectedCoverBackend,
      selectedThumbnailBackend,
      "cover and thumbnail in backend in put data"
    );
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
      if (
        selectedCoverBackend !== null &&
        selectedCoverBackend !== "Not available"
      ) {
        await postCategoryCover(intid, coverData);
      }

      if (
        selectedThumbnailBackend !== null &&
        selectedThumbnailBackend !== "Not available"
      ) {
        await postCategoryThumbnail(intid, thumbnailData);
      }
      toast.success("Fitness Workout Updated Successfully", "success");
      toast.success(response.data.message, "success");
      // fetchData(); // Refresh data after updating
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
      // getDataById(intid);
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, deleteCoverById: error }));
      console.error("Error posting cover:", error);
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
      // getDataById(intid);
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

  // for subcategories
  const fetchSubCategoryData = async (id) => {
    const intid = parseInt(id);
    setIsLoading(true);
    try {
      const { data } = await appsApi.get(`/recipes/sub-categories/${intid}`);
      setSubCategoryDetails(data);
    } catch (error) {
      toast.error(error.response.data.message, "error");
      console.error("Error fetching data:", error);
      setErrors((prevErrors) => ({ ...prevErrors, fetchCategoryData: error }));
    }
    setIsLoading(false);
  };

  // fetch recipes (subcategories) from category
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

  // get subcategoryDetails

  const postSubategoryCover = async (id, coverData) => {
    const intId = parseInt(id);
    let response;
    try {
      if (coverData !== null || coverData !== "Not available") {
        let coverFormData = new FormData();
        coverFormData.append("cover", coverData);
        response = await appsApi.post(
          `/recipes/sub-categories/${intId}/cover`,
          coverFormData
        );
      }
      toast.success("Subcategory Cover posted successfully", "success");
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

  // add recipe subcategory
  const postCategoryData = async (id, recipesData, coverData) => {
    const intId = parseInt(id);
    try {
      setIsLoading(true);
      let response;
      if (coverData && !hasApiErrors()) {
        response = await appsApi.post(
          `/recipes/categories/${intId}/subcategories`,
          recipesData
        );
      }
      const intid = parseInt(response?.data?.id);

      if (coverData !== null || coverData !== "Not available") {
        await postSubategoryCover(intid, coverData);
      }
      toast.success("Recipe Category Created Successfully", "success");
      toast.success(response.data.message, "success");
      fetchData(); // Refresh data after posting
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, postData: error }));
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // edit recipe subcategory
  const putCategoryData = async (
    id,
    recipesData,
    coverData,
    selectedCoverBackend
  ) => {
    const intId = parseInt(id);
    try {
      setIsLoading(true);
      let response;
      if (
        (coverData !== null || coverData !== "Not available") &&
        !hasApiErrors()
      ) {
        response = await appsApi.put(
          `/recipes/sub-categories/${intId}`,
          recipesData
        );
      }

      if (
        (coverData !== null || coverData !== "Not available") &&
        selectedCoverBackend !== null &&
        selectedCoverBackend !== "Not available"
      ) {
        await postSubategoryCover(intId, coverData);
      }

      toast.success("Recipe Category Updated Successfully", "success");
      toast.success(response.data.message, "success");
      fetchData(); // Refresh data after posting
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, postData: error }));
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // delete recipe subcategory
  const deleteSubcategoryData = async (id) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      const response = await appsApi.delete(`/recipes/sub-categories/${intid}`);
      toast.success("Recipe sub-category Deleted Successfully", "success");
      // getDataById(intid);
      fetchData(); // Refresh data after posting
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, deleteData: error }));
      console.error("Error deleting recipe category:", error);
      toast.error(error.response.data.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSubcategoryCoverById = async (id) => {
    const intid = parseInt(id);
    try {
      setIsLoading(true);
      const response = await appsApi.delete(
        `/recipes/sub-categories/${intid}/cover`
      );
      toast.success(response.data.message, "success");
    } catch (error) {
      setErrors((prevErrors) => ({ ...prevErrors, deleteCoverById: error }));
      console.error("Error posting cover:", error);
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
    console.log(errors, "errors in hasApi ");
    return Object.values(errors).some((error) => error != null);
  }, [errors]);

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    categoryDetails,
    subCategoryDetails,
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
    postCategoryData,
    deleteSubcategoryData,
    fetchSubCategoryData,
    putCategoryData,
    deleteSubcategoryCoverById,
  };
};

export default useRecipesApi;
