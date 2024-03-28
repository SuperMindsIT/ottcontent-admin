import { API_BASE_URL } from "../utils/config";
import Axios from "axios";

export const appsApi = Axios.create({
  baseURL: API_BASE_URL,
  // timeout: 10000,
});
