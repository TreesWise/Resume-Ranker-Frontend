import Navbar from "./components/Navbar";
import Collection from "./pages/Collection";
import Dashboard from "./pages/Dashboard";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/search" element={<Collection />} />
      </Routes>
    </Router>
  );
}

export default App;
