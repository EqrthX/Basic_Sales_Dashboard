import React, { useEffect, useState } from 'react'
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { callApi } from '../helper/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SaleMonth {
  order_year: number;
  order_month: number;
  sales: number;
}

const LineChart: React.FC = () => {
    const [chartData, setChartData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async() => {
            try {
                const data: SaleMonth[] = await callApi("/getSalesMonth", "GET")
    
                if (!data || data.length === 0) {
                    throw new Error("No data received from API")
                }
    
                const labels = data.map(d => `${d.order_year}-${String(d.order_month).padStart(2, "0")}`)
                const salesData = data.map(d => d.sales || 0)
            
                setChartData({
                    labels,
                    datasets: [
                        {
                            label: "Monthy Sales",
                            data: salesData,
                            borderColor: "#8884d8",
                            backgroundColor: "rgba(136, 132, 216, 0.2)",
                            tension: 0.3, // ทำเส้น smooth
                        }
                    ]
                })        
                setLoading(false)
            } catch (error) {
                console.error("Error loading bar chart data:", error);
                setError(error instanceof Error ? error.message : "Unknown error occurred")
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        return context.raw.toLocaleString();
                    }
                }
            },
            title: {
                display: true,
                text: "Monthly Sales Chart"
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full h-64 sm:h-80 md:h-96 flex items-center justify-center">
                <p className="text-lg sm:text-xl text-amber-600 animate-bounce">Loading chart...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full h-64 sm:h-80 md:h-96 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg sm:text-xl text-red-600">Error loading chart</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2">{error}</p>
                </div>
            </div>
        )
    } 

    if(!chartData) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full h-64 sm:h-80 md:h-96 flex items-center justify-center">
                <p className="text-lg sm:text-xl text-gray-600">No data available</p>
            </div>
        )
    }
    
    return (
        <div className="bg-gray-100 rounded-lg shadow-xl p-3 sm:p-6 md:p-8 w-full">
            <div className="w-full" style={{ minHeight: "440px" }}>
                <Line 
                    data={chartData}
                    options={{
                        ...options,
                        responsive: true,            // chart ขยายตาม parent
                        maintainAspectRatio: false,  // ปรับเต็มความสูงของ parent
                    }}
                />
            </div>
        </div>
    )
}

export default LineChart
