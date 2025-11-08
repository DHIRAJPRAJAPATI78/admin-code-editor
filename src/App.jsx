import { BrowserRouter, Routes, Route } from "react-router-dom";
import Body from "./components/Body";
import AdminRegister from "./components/Login/AdminRegister";
import AdminProblems from "./components/AdminProblems";
import Problem from "./components/create_problem/Problem";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Body />} />
        <Route path='/admin/login' element={<AdminRegister />} />
        <Route path='/admin/problems' element={<AdminProblems />} />
        <Route path='/admin/problem/create' element={<Problem/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
