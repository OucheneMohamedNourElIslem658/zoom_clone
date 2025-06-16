import { BrowserRouter as Router } from "react-router-dom"
import { Routes, Route } from "react-router-dom";
import AuthPage from "./pages/auth";
import HomePage from "./pages/home";
import RoomPreparationPage from "./pages/preparation";
import MeetPage from "./pages/meet";
import { AppBar } from "./components/custom/app_bar";
import { useEffect } from "react";
import RecordingsPage from "./pages/recordings";


function App() {
  useEffect(() => {
    window.document.body.classList.add('dark');
  }, []);

  return (
    <Router>
      <AppBar/>
      <div className="App" data-theme="dark">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/meetings/:id/preparation" element={<RoomPreparationPage />} />
          <Route path="/meetings/:id/meet" element={<MeetPage />} />
          <Route path="/meetings/:id/recordings" element={<RecordingsPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
