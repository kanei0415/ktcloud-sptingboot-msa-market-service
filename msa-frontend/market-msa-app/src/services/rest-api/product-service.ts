import ProductRestApi from "@libs/rest-api/product/product-rest-api"
import { useQuery } from "@tanstack/react-query"

const useFetchAllProducts = () => {
  return useQuery({ queryKey: ['products'], queryFn: ProductRestApi.fetchAll })
}

const useFindByIdProduct = (id: string) => {
  return useQuery({ queryKey: ['product', id], queryFn: () => ProductRestApi.findById(id) })
}

const ProductService = { useFetchAllProducts, useFindByIdProduct }

export default ProductService