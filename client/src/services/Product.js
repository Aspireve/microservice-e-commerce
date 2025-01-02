import config from "../config";
import http from "../utils/http";
import { interpolate } from "../utils/string";

export const fetchProducts = async (filters) => {
  const { data } = await http.get(
    config.apiEndPoint.product.fetchProducts,
    {
      params: {
        ...filters,
      },
    },
    "product"
  );
  return data.data;
};
export const fetchProduct = async (id) => {
  const url = interpolate(config.apiEndPoint.product.fetchProduct, { id: id });

  const { data } = await http.get(url, {}, "product");

  return data.data;
};

export const fetchProductReviews = async (id) => {
  const url = interpolate(config.apiEndPoint.product.fetchProductReviews, {
    id: id,
  });
  const { data } = await http.get(url, {}, "review");

  return data;
};

export const createReview = async (id, body) => {
  const url = interpolate(config.apiEndPoint.product.createReview, {
    id: id,
  });
  const { data } = await http.post(
    url,
    {
      body,
      accessToken: true,
    },
    "review"
  );

  return data;
};

export const deleteProduct = async (id) => {
  const url = interpolate(config.apiEndPoint.product.deleteProduct, {
    id: id,
  });
  const { data } = await http.remove(
    url,
    {
      accessToken: true,
    },
    "product"
  );

  return data;
};

export const createProduct = async (body) => {
  const { data } = await http.post(
    config.apiEndPoint.product.createProduct,
    {
      body,
      accessToken: true,
    },
    "product"
  );

  return data;
};

export const updateProduct = async (id, body) => {
  const url = interpolate(config.apiEndPoint.product.updateProduct, {
    id: id,
  });
  const { data } = await http.put(
    url,
    {
      body,
      accessToken: true,
    },
    "product"
  );

  return data;
};

export const filterParams = (filters) => {
  Object.keys(filters).forEach((key) => {
    if (filters.hasOwnProperty(key)) {
      if (filters[key] === "") {
        delete filters[key];
      }
    }
  });
};
