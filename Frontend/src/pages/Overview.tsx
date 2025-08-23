import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
ChartJS.register(ArcElement, Tooltip, Legend)

const Overview: React.FC = () => {

    return (
        <>
            <h1 className="text-5xl font-black uppercase text-center">Overview</h1>
            <div className="p-4 rounded-2xl shadow">
                <BarChart />
            </div>
            
            <div className="mt-3 grid grid-cols-3 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl shadow ">
                    <PieChart />
                </div>
                <div className="p-4 rounded-2xl shadow ">
                    <PieChart />
                </div>
            </div>
        </>
    )
}

export default Overview