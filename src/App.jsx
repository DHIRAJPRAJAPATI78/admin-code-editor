import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import AdminRegister from "./components/Login/AdminRegister";
import AdminProblems from "./components/AdminProblems";
import Problem from "./components/create_problem/Problem";
import ContestForm from "./components/create_contest/ContestForm";
import AdminProfile from "./components/profile/AdminProfile";
import UpdateProblemForm from "./components/create_problem/UpdateProblemForm";
import AdminContests from "./components/AdminContest";
import Protectedroute from "./Protectedroute";
import Header from "./components/Header";
import Home from "./components/Home";
import AddContest from "./components/create_contest/AddContest";

function App() {


  return (
    <BrowserRouter>
    <Header/>
      <Routes >
        {/* <Route path='/' element={<Body />} > */}
        <Route path='/' element={<Home />} /> 
        <Route path='/admin/login' element={<AdminRegister />} />

        <Route path="/admin/profile" element={<Protectedroute><AdminProfile/></Protectedroute>}/>
        <Route path='/admin/problems' element={<Protectedroute><AdminProblems /></Protectedroute>} />
        <Route path='/admin/problem/create' element={<Protectedroute><Problem/></Protectedroute>} />
        <Route path='/admin/problem/edit/:id' element={<Protectedroute><UpdateProblemForm/></Protectedroute>} />
        <Route path='/admin/contest' element={<Protectedroute><AdminContests /></Protectedroute>} />
        <Route path='/admin/contest/create' element={<Protectedroute><AddContest /></Protectedroute>} />
        <Route path='/admin/contest/edit/:id' element={<Protectedroute><ContestForm /></Protectedroute>} />
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
