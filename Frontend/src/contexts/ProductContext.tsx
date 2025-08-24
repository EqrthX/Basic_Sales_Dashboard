/* eslint-disable react-refresh/only-export-components */
import React, {createContext, useState, useEffect, ReactNode} from "react";
import { callApi } from "../helper/api";

export const ProductContext = createContext(undefined);

export const ProductProvider = ({children}) => {
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const data = await callApi("/products")            
            setProducts(data)
        } catch (error) {
            console.error("Failed to fetch product:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <ProductContext.Provider 
            value={{
                products,
                fetchProducts,
                loading
            }}
        >
            {children}
        </ProductContext.Provider>
    )
}