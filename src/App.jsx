import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Body from "./components/Body";
import AdminRegister from "./components/Login/AdminRegister";
import AdminProblems from "./components/AdminProblems";
import Problem from "./components/create_problem/Problem";
import AdminContest from "./components/AdminContest";
import ContestForm from "./components/create_contest/ContestForm";
import AdminProfile from "./components/profile/AdminProfile";

function App() {
  // const dispath=useDispatch();

  return (
    <BrowserRouter>
      <Routes >
        <Route path='/' element={<Body />} >
        <Route path='/admin/login' element={<AdminRegister />} />
        <Route path="/admin/profile" element={<AdminProfile/>}/>
        <Route path='/admin/problems' element={<AdminProblems />} />
        <Route path='/admin/problem/create' element={<Problem/>} />
        <Route path='/contest' element={<AdminContest />} />
        <Route path='/edit/:id' element={<ContestForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
