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
import AddPrescription from "./AddPrescription";
import DoctorAppointmentList from "./DoctorAppointmentList";
import BillingHistory from "./BillingHistory";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsAndConditions from "./TermsAndConditions";
import Support from "./Support";
import PatientPayment from "./PatientPayment";
import DoctorPatientHistory from "./DoctorPatientHistory";
import DoctorSchedule from "./DoctorSchedule";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/support" element={<Support />} />


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
          path="/billing"
          element={
            <PrivateRoute>
              <BillingHistory />
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
          path="/doctor-add-prescription"
          element={
            <PrivateRoute>
              <AddPrescription />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor-appointment-dashboard"
          element={
            <PrivateRoute>
              <DoctorAppointmentList />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor-patient-history"
          element={
            <PrivateRoute>
              <DoctorPatientHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor-schedule"
          element={
            <PrivateRoute>
              <DoctorSchedule />
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
        <Route
          path="/patient-payment-processing"
          element={
            <PrivateRoute>
              <PatientPayment />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
