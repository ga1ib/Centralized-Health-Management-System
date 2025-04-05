import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home";       // Admin Dashboard
import Login from "./login";
import Signup from "./signup";
import PrivateRoute from "./PrivateRoute";
import DoctorDashboard from "./doctor";
import PatientDashboard from "./patient";
import ManageUsers from "./ManageUsers";
import Appointments from "./Appointments";
import Reports from "./Reports";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/patient" element={<PatientDashboard />} />
        
        {/* Protected route for Admin Dashboard */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* Admin Functionality Routes */}
        <Route 
          path="/manage-users" 
          element={
            <PrivateRoute>
              <ManageUsers />
            </PrivateRoute>
          }
        />
        <Route 
          path="/appointments" 
          element={
            <PrivateRoute>
              <Appointments />
            </PrivateRoute>
          }
        />
        <Route 
          path="/reports" 
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
