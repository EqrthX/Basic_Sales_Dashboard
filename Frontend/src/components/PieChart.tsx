/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'
import {Pie} from 'react-chartjs-2'
import { callApi } from '../helper/api'

ChartJS.register(ArcElement, Tooltip, Legend)


const PieChart = () => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [chartData, setChartData] = useState<any>(null)
    const [screenWidth, setScreenWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024)

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth)
            // Auto close sidebar on larger screens
            if (window.innerWidth >= 768) {
                setOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data: any = await callApi('/ship-mode', "GET")

                if(!data || data.length === 0) {
                    throw new Error("No data recevied from API")
                }

                const labels: string = data.map((item: any) => item.ShipMode)
                const count: number = data.map((item: number) => item.ShipCount)

                setChartData({
                    labels,
                    datasets: [{
                        label: "Ship count",
                        data: count,
                        backgroundColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                            'rgba(75, 192, 192, 0.5)',
                        ]
                    }],
                    borderWidth: 1,
                })

                setLoading(false)
            } catch (error) {
                console.error("Error loading pie chart data:", error);
                setError(error instanceof Error ? error.message : "Unknown error occurred")
                setLoading(false)
            }
        }

        fetchData()
    },[])
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
        <>
            <div className="flex flex-col md:flex-row bg-gray-100 rounded-lg shadow-xl p-3 sm:p-6 md:p-8 w-full gap-4">
                {/* Pie Chart */}
                <div className="w-full md:w-2/3 flex justify-center">
                    <div className="w-full max-w-[500px] h-64 sm:h-80 md:h-96 lg:h-[440px]">
                        <Pie
                            data={chartData}
                            options={{
                            plugins: {
                                legend: { display: false },
                                title: {
                                display: true,
                                text: "Count Ship Mode",
                                font: { size: 20, weight: "bold" },
                                padding: { top: 10, bottom: 20 },
                                },
                            },
                            maintainAspectRatio: false,
                            responsive: true,
                            }}
                        />
                    </div>
                </div>

                {/* Custom Legend */}
                <div className="w-full md:w-1/3 flex flex-wrap md:flex-col justify-center gap-3">
                    {chartData.labels.map((label: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 flex-1 min-w-[120px]">
                        <div 
                            className="w-6 h-6 rounded" 
                            style={{ backgroundColor: chartData.datasets[0].backgroundColor[idx] }}
                        />
                        <span className="text-gray-700 font-medium">
                            {label}: {chartData.datasets[0].data[idx]}
                        </span>
                    </div>
                    ))}
                </div>
            </div>
        </>

    )
}

export default PieChart
