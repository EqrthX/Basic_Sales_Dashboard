/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { callApi } from '../helper/api'

const CardTotal: React.FC = () => {

    const [cardInfo, setCardInfo] = useState([
        { title: "Total Orders", value: "..." },
        { title: "Total Sales", value: "..." },
        { title: "Total Shipments", value: "..." },
    ])

    useEffect(() => {
        const fetchData = async () => {
            try {

                const [totalOrders, totalSales] = await Promise.all([
                   callApi("/countOrder", "GET"), 
                   callApi("/sumSale", "GET"),
                ])

                setCardInfo([
                    {title: "Total Orders", value: totalOrders.order_id},
                    {title: "Total Sales", value: Number(totalSales.sales).toFixed(2)},
                    {title: "Average Sales", value: Number(totalSales.avg_sales).toFixed(2)},
                ])

            } catch (error) {
                console.error("Error loading data:", error);
            }
        }
        fetchData();
    }, [])

    return (
        <div className="w-full flex flex-wrap justify-around mt-4 mb-4 gap-4 ">
            {cardInfo.map((card: any, idx: number) => (
                <div
                    key={idx}
                    className="bg-emerald-300 
                        rounded-lg 
                        flex flex-col items-center justify-center 
                        shadow-lg
                        w-11/12     /* มือถือ full width */
                        sm:w-5/12   /* tablet ครึ่งหนึ่ง */
                        md:w-1/4    /* desktop 1/4 ของ row */
                        h-40"
                >
                    <p className="text-center font-bold text-lg">{card.title}</p>
                    <p className="text-center text-2xl font-extrabold mt-2">{card.value}</p>
                </div>
            ))}
        </div>
    )
}

export default CardTotal
