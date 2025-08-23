import React, { useEffect, useState } from 'react'
import dollar from '../asset/2150062.png'
import { GrOverview } from "react-icons/gr";
import { FaDollarSign, FaBars, FaChartBar, FaCog, FaBoxOpen, FaThList, FaTachometerAlt, FaShoppingCart  } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { IoCloseOutline, IoPersonCircle  } from "react-icons/io5";
import { TiArrowSortedUp } from "react-icons/ti";

const Sidebar: React.FC = () => {
    const [open, setOpen] = useState(false)
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
        const handleClickOutside = (event: MouseEvent) => {
            const sidebar = document.getElementById('sidebar')
            const toggleButton = document.getElementById('sidebar-toggle')
            
            if (open && sidebar && !sidebar.contains(event.target as Node) && 
                toggleButton && !toggleButton.contains(event.target as Node) && 
                screenWidth < 768) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [open, screenWidth])

    const menuItems = [
        { icon: <GrOverview />, label: 'Overview', to: '/' },
        { icon: <FaBoxOpen />, label: 'Products', to: '/products' },
        { icon: <FaThList />, label: 'Categories', to: '/categories' },
        { icon: <FaDollarSign />, label: 'Sales', to: '/sales' },
        { icon: <FaShoppingCart />, label: 'Orders', to: '/reports' },
        { icon: <FaChartBar />, label: 'Reports', to: '/reports' },
        { icon: <FaCog />, label: 'Settings', to: '/settings' }
    ]

    return (
        <>
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between bg-blue-600 text-white px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                    <FaDollarSign size={24}/>
                    <span className="font-bold text-lg">Dashboard</span>
                </div>
                <button 
                    id="sidebar-toggle"
                    onClick={() => setOpen(!open)}
                    className="relative p-2 rounded-md hover:bg-blue-700 transition-colors w-10 h-10 flex items-center justify-center"
                >
                    <FaBars
                        className={`absolute transition-all duration-300 ease-in-out ${
                            open ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
                        }`}
                        size={24}
                    />

                    {/* Close Icon (X) */}
                    <IoCloseOutline
                        className={`absolute transition-all duration-300 ease-in-out ${
                        open ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
                        }`}
                        size={24}
                    />
                </button>
            </div>

            {/* Overlay for mobile */}
            {open && (
                <div 
                    className="md:hidden fixed inset-0 opacity-30 z-40"
                    onClick={() => setOpen(false)}
                />
            )}
            
            <div
                id='sidebar'
                className={`
                    fixed md:static top-0 left-0 z-50
                    bg-blue-500 min-h-screen flex flex-col shadow-lg
                    transition-transform duration-300 ease-in-out
                    h-auto xs:h-auto
                    /* Mobile: slide from left, full height */
                    w-64 
                    ${open ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0
                    
                    /* Tablet & Desktop: always visible, different widths */
                    md:w-48 lg:w-56 xl:w-64
                    
                    /* Mobile spacing for header */
                    pt-16 md:pt-0    
                `}
            >
                <div className="hidden md:flex items-center justify-center py-6 px-4">
                    <FaDollarSign color="white" size={screenWidth >= 1024 ? 48 : 40} />
                    <span className="text-white font-bold text-xl ml-3 hidden lg:block">
                        Dashboard
                    </span>
                </div>

                <nav className="flex-1 px-3 md:px-4 py-4">
                    <ul className="space-y-2">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <Link 
                                    to={item.to}
                                    onClick={() => setOpen(false)}
                                    className="
                                        flex items-center gap-3 md:gap-4
                                        text-white text-base md:text-sm lg:text-base
                                        px-3 py-3 md:py-2.5
                                        rounded-lg
                                        transition-all duration-200 
                                        hover:bg-blue-600 hover:shadow-md
                                        active:scale-95
                                        group
                                    "
                                >
                                    <span className="text-lg md:text-base lg:text-lg group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </span>
                                    <span className="font-medium group-hover:translate-x-1 transition-transform">
                                        {item.label}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="mt-auto p-4 bg-blue-600 border-t border-blue-400">
                    <div className="flex items-center gap-3">
                        <IoPersonCircle size={32} color="white" className="flex-shrink-0"/>
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate">Admin User</p>
                            <p className="text-blue-200 text-xs">Administrator</p>
                        </div>
                        <button className="text-white hover:text-blue-200 transition-colors">
                            <TiArrowSortedUp size={20} className="transform rotate-180"/>
                        </button>
                    </div>
                </div>

                <div className="md:hidden h-16"></div>

            </div>
        </>
    )
}

export default Sidebar