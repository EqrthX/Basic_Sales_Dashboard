import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import BarChart from '../components/BarChart';
import PieChart from '../components/PieChart';
import LineChart from '../components/LineChart';
import CardTotal from '../components/CardTotal';
ChartJS.register(ArcElement, Tooltip, Legend)

const Overview: React.FC = () => {

    return (
        <>
            <h1 className="text-5xl font-black uppercase text-center">Overview</h1>
            
            <CardTotal/>

            <div className="bg-blue-100 p-4 rounded-2xl shadow-xl">
                <BarChart />
            </div>
            
            <div className="bg-blue-100 mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg shadow-lg">
                <div className="p-4 rounded-2xl shadow ">
                    <PieChart />
                </div>
                <div className="p-4 rounded-2xl shadow ">
                    <LineChart />
                </div>
            </div>
        </>
    )
}

export default Overview