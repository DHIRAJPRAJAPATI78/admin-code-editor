import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Body from "./components/Body";
import AdminRegister from "./components/Login/AdminRegister";
import AdminProblems from "./components/AdminProblems";
import Problem from "./components/create_problem/Problem";
import ContestForm from "./components/create_contest/ContestForm";
import AdminProfile from "./components/profile/AdminProfile";
import UpdateProblemForm from "./components/create_problem/UpdateProblemForm";
import AdminContests from "./components/AdminContest";

function App() {


  return (
    <BrowserRouter>
      <Routes >
        <Route path='/' element={<Body />} >
        <Route path='/admin/login' element={<AdminRegister />} />
        <Route path="/admin/profile" element={<AdminProfile/>}/>
        <Route path='/admin/problems' element={<AdminProblems />} />
        <Route path='/admin/problem/create' element={<Problem/>} />
        <Route path='/admin/problem/edit/:id' element={<UpdateProblemForm/>} />
        <Route path='/admin/contest' element={<AdminContests />} />
        <Route path='/edit/:id' element={<ContestForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
