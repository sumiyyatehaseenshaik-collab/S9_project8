import { BrowserRouter, Route, Routes } from "react-router-dom";
import Master from "./components/Master";
import Temperature from "./components/Temperature";
import Population from "./components/population";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Master />} />
        <Route path="/temperature" element={<Temperature />} />
        <Route path="/population" element={<Population />} />  
      </Routes>
    </BrowserRouter>
  );
}

export default App;
