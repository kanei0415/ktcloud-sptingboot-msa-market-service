import api from "../rest-config";
import type { FetchAllInventoriesResponse, FindByIdInventoryResponse } from "./response";

const INVENTORY_API_ENDPOINT = `/inventories`

const INVENTORY_API_RESOURCES = {
  fetchAll: `${INVENTORY_API_ENDPOINT}`,
  findById: (id: string) => `${INVENTORY_API_ENDPOINT}/${id}`,
}

async function fetchAll(): Promise<FetchAllInventoriesResponse> {
  const response = await api.get(INVENTORY_API_RESOURCES.fetchAll)

  return response.data
}

async function findById(id: string): Promise<FindByIdInventoryResponse> {
  const response = await api.get(INVENTORY_API_RESOURCES.findById(id))

  return response.data
}

const InventoryRestApi = { fetchAll, findById }

export default InventoryRestApi