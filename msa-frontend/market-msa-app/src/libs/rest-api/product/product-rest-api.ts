import api from "../rest-config";
import type { FetchAllProductsResponse, FindByIdProductResponse } from "./response";

const PRODUCT_API_ENDPOINT = `/products`

const PRODUCT_API_RESOURCES = {
  fetchAll: `${PRODUCT_API_ENDPOINT}`,
  findById: (id: string) => `${PRODUCT_API_ENDPOINT}/${id}`,
}

async function fetchAll(): Promise<FetchAllProductsResponse> {
  const response = await api.get(PRODUCT_API_RESOURCES.fetchAll)

  return response.data
}

async function findById(id: string): Promise<FindByIdProductResponse> {
  const response = await api.get(PRODUCT_API_RESOURCES.findById(id))

  return response.data
}

const ProductRestApi = { fetchAll, findById }

export default ProductRestApi