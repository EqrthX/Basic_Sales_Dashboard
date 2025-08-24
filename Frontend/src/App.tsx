import React from "react"
import Sidebar from "./components/Sidebar"
import { Route, Routes } from "react-router-dom"
import Overview from "./pages/Overview"
import Product from "./pages/Product"

function App() {
  
  return (
      <div 
        className="flex min-h-screen"
      >
        <Sidebar/>

        {/** Main Content */}
        <div className={`
            flex-1 p-4 md:p-6 lg:p-8
            pt-16 md:pt-6
            transition-all duration-300
          `}>
          <Routes>
            <Route path="/" element={<Overview/>}/>
            <Route path="/products" element={<Product/>}/>
            <Route path="/categories" element={<Product/>}/>
            <Route path="/sales" element={<Product/>}/>
            <Route path="/orders" element={<Product/>}/>
            <Route path="/reports" element={<Product/>}/>
            <Route path="/settings" element={<Product/>}/>
          </Routes>
        </div>
      </div>
  )
}

export default App
