import { Routes, Route } from "react-router-dom";
import SidebarLayout from "./layout/SidebarLayout";
import Users from "./pages/Users";
import Lands from "./pages/Lands";
import UserDetails from "./pages/UserDetails";
import LandDetails from "./pages/LandDetails";
import './index.css';

function App() {
  return (
    <Routes>

      <Route path="/admin" element={<SidebarLayout />}>

        <Route path="getUsers" element={<Users />} />

        <Route path="user/:userId" element={<UserDetails />} />

        <Route path="getLands" element={<Lands />} />
        <Route path="land/:landId" element={<LandDetails />} />


      </Route>

      <Route path="*" element={<h2>404 - Page Not Found</h2>} />

    </Routes>
  );
}

export default App;
