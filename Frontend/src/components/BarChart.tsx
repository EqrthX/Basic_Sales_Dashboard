/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react'
import { Chart as ChartJS, LineElement, CategoryScale, BarElement, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { callApi } from '../helper/api';

ChartJS.register(LineElement, CategoryScale, BarElement, LinearScale, PointElement, Tooltip, Legend);

interface ProductSales {
    ProductName: string;
    TotalSales: number;
}

const BarChart: React.FC = () => {
    const [chartData, setChartData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [screenWidth, setScreenWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024)

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                setError(null)

                const data: ProductSales[] = await callApi("/topProduct", "GET")

                if(!data || data.length === 0) {
                    throw new Error("No data received from API")
                }

                const labels = data.map(item => {
                    const name = item.ProductName
                    return name.length > 15 ? name.substring(0, 15) + '...' : name
                })
                const sales = data.map(item => item.TotalSales)
                
                setChartData({
                    labels,
                    datasets: [
                        {
                            label: "Top 10 Product",
                            data: sales,
                            borderColor: [
                                'rgba(255, 99, 132, 0.5)',
                                'rgba(54, 162, 235, 0.5)',
                                'rgba(255, 205, 86, 0.5)',
                                'rgba(75, 192, 192, 0.5)',
                                'rgba(153, 102, 255, 0.5)',
                                'rgba(255, 159, 64, 0.5)',
                                'rgba(199, 199, 199, 0.5)',
                                'rgba(83, 102, 255, 0.5)',
                                'rgba(255, 99, 255, 0.5)',
                                'rgba(99, 255, 132, 0.5)'
                            ],
                            backgroundColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 205, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                                'rgba(199, 199, 199, 1)',
                                'rgba(83, 102, 255, 1)',
                                'rgba(255, 99, 255, 1)',
                                'rgba(99, 255, 132, 1)'
                            ],
                            borderWidth: 1,
                            fill: true,
                            tension: 0.3,
                            pointBackgroundColor: "rgba(75,192,192,1)"
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

    // ย้าย useCallback มาก่อน conditional returns
    const getResponsiveOptions = useCallback(() => ({
        responsive: true, // แก้ไข typo จาก "reponsive"
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
                labels: {
                    font: {
                        size: screenWidth < 640 ? 10 : 12 // ใช้ screenWidth แทน window.innerWidth
                    }
                }
            },
            title: {
                display: true,
                text: "Top 10 Products By Sales",
                font: {
                    size: screenWidth < 640 ? 16 : screenWidth < 768 ? 20 : 24
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    minRotation: screenWidth < 640 ? 45 : 0,
                    maxRotation: screenWidth < 640 ? 45 : 0,
                    maxTicksLimit: screenWidth < 640 ? 6 : 10,
                    font: {
                        size: screenWidth < 640 ? 10 : 12
                    },
                    callback: function(value: any, index: number) {
                        const label = this.getLabelForValue(value)
                        if (typeof label === "string") {
                            const maxLength = screenWidth < 640 ? 8 : 12
                            if (label.length > maxLength) {
                                return label.substring(0, maxLength) + '...'
                            }
                        }
                        return label
                    }
                },
                grid: {
                    display: true,
                    color: "rgba(0, 0, 0, 0.1)"
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    font: {
                        size: screenWidth < 640 ? 10 : 12
                    }
                }
            }
        }
    }), [screenWidth])

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
            <div className="h-64 sm:h-80 md:h-96 lg:h-[440px]">
                <Bar 
                    data={chartData} 
                    options={getResponsiveOptions()}
                />
            </div>
        </div>
    )
}

export default BarChart