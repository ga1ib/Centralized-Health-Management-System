import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home";       // Admin Dashboard
import Login from "./login";
import Signup from "./signup";
import PrivateRoute from "./PrivateRoute";
import DoctorDashboard from "./DoctorDashboard";
import PatientDashboard from "./PatientDashboard";
import ManageUsers from "./ManageUsers";
import Appointments from "./Appointments";
import Reports from "./Reports";
import PatientAppointment from "./PatientAppointment";
import BookPatientAppointment from "./BookPatientAppointment";
import PatientMedicalHistory from "./PatientMedicalHistory";
import PatientPaymentHistory from "./PatientPaymentHistory";
import ViewPatientAppointment from "./ViewPatientAppointment";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
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
        <Route 
          path="/doctor" 
          element={
            <PrivateRoute>
              <DoctorDashboard />
            </PrivateRoute>
          }
        />
        <Route 
          path="/patient" 
          element={
            <PrivateRoute>
              <PatientDashboard />
            </PrivateRoute>
          }
        />
        <Route 
          path="/patient-appointments" 
          element={
            <PrivateRoute>
              <PatientAppointment />
            </PrivateRoute>
          }
        />
        <Route 
          path="/book-patient-appointment" 
          element={
            <PrivateRoute>
              <BookPatientAppointment />
            </PrivateRoute>
          }
        />
        <Route 
          path="/patient-medical-reports" 
          element={
            <PrivateRoute>
              <PatientMedicalHistory />
            </PrivateRoute>
          }
        />
        <Route 
          path="/patient-payment-history" 
          element={
            <PrivateRoute>
            <PatientPaymentHistory />
            </PrivateRoute>
          }
        />
        <Route 
          path="/patient-view-appointment" 
          element={
            <PrivateRoute>
            <ViewPatientAppointment />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
