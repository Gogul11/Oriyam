import { Routes, Route } from "react-router-dom";
import SidebarLayout from "./layout/SidebarLayout";
import Users from "./pages/Users";
import Lands from "./pages/Lands";
// import UsersLand from "./pages/UsersLand";
import UserDetails from "./pages/UserDetails";
import LandDetails from "./pages/LandDetails";

function App() {
  return (
    <Routes>

      {/* ✅ Sidebar routes */}
      <Route path="/admin" element={<SidebarLayout />}>

        {/* Users list */}
        <Route path="getUsers" element={<Users />} />

        {/* ✅ User details route */}
        <Route path="user/:userId" element={<UserDetails />} />

        {/* Lands list */}
        <Route path="getLands" element={<Lands />} />
        <Route path="land/:landId" element={<LandDetails />} />


      </Route>

      {/* ✅ Fallback route */}
      <Route path="*" element={<h2>404 - Page Not Found</h2>} />

    </Routes>
  );
}

export default App;
