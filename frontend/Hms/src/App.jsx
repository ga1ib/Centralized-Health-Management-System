// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home";       // Dashboard/Home
import Login from "./login";
import Signup from "./signup";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
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
