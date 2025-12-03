
import {  useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


export default function Protectedroute({ children }) {

  const { error } = useSelector((state) => state.profile);

  if (error===401) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
