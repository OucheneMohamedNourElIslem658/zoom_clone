import { BrowserRouter as Router } from "react-router-dom"
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/auth";
import { useEffect } from "react";
import HomePage from "./pages/home";
import RoomPreparationPage from "./pages/preparation";
import MeetPage from "./pages/meet";


function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, [])
  
  return (
    <Router>
      <div className="App" data-theme="dark">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/preparation" element={<RoomPreparationPage />} />
          <Route path="/meet" element={<MeetPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
