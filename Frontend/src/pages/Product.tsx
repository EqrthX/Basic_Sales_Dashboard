import React, { lazy, useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useProducts } from '../hooks/useProduct';

const Product: React.FC = () => {
    
    const {products, fetchProducts} = useProducts();
    const [first, setFirst] = useState(0)

    useEffect(() => {
        fetchProducts();
    }, [])
    useEffect(() => {
        setFirst(0)
    }, [products])

    const columns = [
        {field: "Order_ID", header: "Order_ID"},
        {field: "Order_Date", header: "Order_Date"},
        {field: "Customer_Name", header: "Customer_Name"},
        {field: "Segment", header: "Segment"},
        {field: "City", header: "City"},
        {field: "Product_Name", header: "Product_Name"},
        {field: "Sales", header: "Sales"},
    ]    
    
    return (
        <div className="p-4 md:p-ุ6">
            <h1 className="text-5xl font-black uppercase text-center mb-5">Products</h1>
            <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200 bg-white">
                <DataTable 
                    value={products}
                    paginator
                    rows={10}
                    stripedRows
                    first={first}
                    onPage={(e) => setFirst(e.first)}
                    className="min-w-[600px] w-full text-sm md:text-base"
                    rowClassName={() => "hover:bg-gray-50"}
                    paginatorTemplate={{
                        layout: "PrevPageLink CurrentPageReport NextPageLink",
                        PrevPageLink: (options) => (
                            <button
                                className={`px-3 py-1 mx-1 rounded-lg ${
                                    options.disabled ? "bg-gray-200 text-gray-400" : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                                onClick={options.onClick}
                                disabled={options.disabled}
                            >
                                Prev
                            </button>
                        ),
                        NextPageLink: (options) => (
                            <button
                                className={`px-3 py-1 mx-1 rounded-lg ${
                                    options.disabled ? "bg-gray-200 text-gray-400" : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                                onClick={options.onClick}
                                disabled={options.disabled}
                            >
                                Next
                            </button>
                        ),
                        CurrentPageReport: (options) => (
                            <span className="text-sm text-gray-600 mx-2">
                                Page <span className="font-bold">{options.currentPage + 1}</span> of{" "}
                                <span className="font-bold">{options.totalPages}</span>
                            </span>
                        ),
                        
                    }}
                >
                    {columns.map(col => (
                        <Column 
                            key={col.field} 
                            field={col.field} 
                            header={col.header} 
                            headerClassName="bg-gray-100 text-gray-700 font-bold text-xs md:text-sm"
                            bodyClassName="px-4 py-2 text-gray-800 text-xs md:text-sm"
                        />
                    ))}
                </DataTable>
            </div>
        </div>
    )
}

export default Product
