
import { Outlet ,useNavigate} from "react-router-dom"
import Header from "./Header"
import { useSelector } from "react-redux";
import { useEffect } from "react";
const Body = () => {
    const navigate = useNavigate();
    const {user}=useSelector((state)=>state.admin);
    useEffect(()=>{
    if(!user){
      navigate("/admin/login")
    }
    },[])

  return (
    <div>
    <Header/>
    <Outlet/>
    </div>
  )
}

export default Body