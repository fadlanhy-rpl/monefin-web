import { fetchAPI } from "../lib/api";

export const getCategories = async (type = "") => {
  let url = "/categories";
  if (type) {
    url += "?type=" + type;
  }
  const data = await fetchAPI(url);
  return data;
};
export const createCategory = async (categoryData) => {
  return await fetchAPI("/categories", {
    method: "POST",
    body: categoryData,
  });
};

export const updateCategory = async (id, categoryData) => {
  return await fetchAPI(`/categories/${id}`, {
    method: "PUT",
    body: categoryData,
  });
};

export const deleteCategory = async (id) => {
  return await fetchAPI(`/categories/${id}`, {
    method: "DELETE",
  });
};
