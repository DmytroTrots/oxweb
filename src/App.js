import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminPage from "./admin/AdminPage"
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import UserPage from "./user/UserPage";
import Signup from "./components/Signup";

const App = () => {

  return (
          <AuthProvider>
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path="/adminpage" element={<PrivateRoute><AdminPage /></PrivateRoute>} />
                <Route path="/userpage" element={<PrivateRoute><UserPage /></PrivateRoute>} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
  )
};

export default App;
