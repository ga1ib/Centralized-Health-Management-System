// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home";       // Dashboard/Home
import Login from "./login";
import Signup from "./signup";
import PrivateRoute from "./PrivateRoute";
import DoctorDashboard from "./doctor";
import PatientDashboard from "./patient";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/doctor" element={<DoctorDashboard/>} />
        <Route path="/patient" element={<PatientDashboard />} />
        {/* Protected route: only accessible if logged in */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
