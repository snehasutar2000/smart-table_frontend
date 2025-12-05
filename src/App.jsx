import './App.css';
import Customer from './components/Customer';
import Admin from './components/Admin';
import { Routes, Route } from "react-router-dom";

function App() {
 
  return (
    <Routes>
      <Route path="/customers" element={<Customer />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );

}

export default App;
