import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Social from "./pages/Social";
import Explore from "./pages/Explore";
import Messages from "./pages/Messages";
import Reels from "./pages/Reels";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Communities from "./pages/CommunitiesPage";
import Settings from "./pages/Settings";
import Events from "./pages/company/Events";
import AboutPage from "./pages/company/AboutPage";
import BrandPage from "./pages/company/BrandPage";
import CareersPage from "./pages/company/CareersPage";
import HelpCenter from "./pages/company/HelpCenter";
import CommunityGuidelines from "./pages/company/CommunityGuidelines";
import Safety from "./pages/company/Safety";
import Press from "./pages/company/Press";
import TermsOfService from "./pages/company/TermsOfService";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/" element={<Navigate to="/dashboard" />} /> */}
            <Route path="/" element={<Social />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/reels" element={<Reels />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/guidelines" element={<CommunityGuidelines />} />
            <Route path="/events" element={<Events />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/brand" element={<BrandPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/press" element={<Press />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
