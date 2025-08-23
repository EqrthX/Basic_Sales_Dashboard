import React from "react"
import Sidebar from "./components/Sidebar"
import { Route, Routes } from "react-router-dom"
import Overview from "./pages/Overview"

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
          </Routes>
        </div>
      </div>
  )
}

export default App
