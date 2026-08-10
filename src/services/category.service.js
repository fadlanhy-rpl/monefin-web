import { fetchAPI } from "../lib/api";

export const getCategories = async (type = "") => {
  let url = "/categories";
  if (type) {
    url += "?type=" + type;
  }
  const data = await fetchAPI(url);
  return data;
};
