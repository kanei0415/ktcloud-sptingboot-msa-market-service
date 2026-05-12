import ProductService from "@services/rest-api/product-service"
import Product from "../Product"
import { useMemo } from "react"

const ProductContainer = () => {
  const { data } = ProductService.useFetchAllProducts()

  const products = useMemo(() => data ? data.products : [], [])

  return <Product products={products} />
}

export default ProductContainer