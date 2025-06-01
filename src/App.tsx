import { BrowserRouter as Router } from "react-router-dom"
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/auth";
import { useEffect } from "react";
import HomePage from "./pages/home";
import RoomPreparationPage from "./pages/preparation";
import MeetPage from "./pages/meet";
import { AppBar } from "./components/custom/app_bar";


function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, [])
  
  return (
    <Router>
      <AppBar 
        user={{
          id: "12345",
          name: "John Doe",
          image: "https://via.placeholder.com/150",
          email: "m_ouchene@estin.dz",
        }}
        onLogout={() => {}}
      />
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
