import Navbar from "./components/Navbar";
import Collection from "./pages/Collection";
import Dashboard from "./pages/Dashboard";
import { Toaster } from 'react-hot-toast';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Navbar />
      <Toaster position="bottom-center" />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/search" element={<Collection />} />
      </Routes>
    </Router>
  );
}

export default App;
