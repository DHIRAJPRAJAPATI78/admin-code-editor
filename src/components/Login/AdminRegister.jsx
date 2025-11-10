import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  registerAdmin,
  loginUser,
  clearAdminState,
} from "../../features/authSlice";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const AdminAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.admin);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      if (!formData.email || !formData.password) {
        toast.error("Please enter both email and password");
        return;
      }
      dispatch(
        loginUser({ email: formData.email, password: formData.password })
      );
    } else {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.password
      ) {
        toast.error("Please fill in all fields");
        return;
      }
      dispatch(registerAdmin(formData));
    }
  };

  // Navigate when successful login/register
  useEffect(() => {
    if (success) {
      toast.success(isLogin ? "Login successful!" : "Registration successful!");
      setTimeout(() => {
        navigate("/admin/dashboard");
        dispatch(clearAdminState());
      }, 1200);
    }
  }, [success, navigate, dispatch, isLogin]);

  // Handle API errors gracefully
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAdminState());
    }
  }, [error, dispatch]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#0d1117] px-4'>
      <Toaster position='top-center' reverseOrder={false} />

      <div className='w-full max-w-md bg-[#161b22] border border-gray-800 rounded-xl p-8 shadow-xl'>
        {/* Title */}
        <h2 className='text-3xl font-bold text-yellow-400 text-center mb-2'>
          {isLogin ? "Admin Login" : "Admin Register"}
        </h2>
        <p className='text-gray-400 text-center mb-6 text-sm'>
          {isLogin
            ? "Access your admin dashboard"
            : "Create a new admin account"}
        </p>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          {!isLogin && (
            <>
              <div>
                <label className='block text-gray-300 text-sm mb-1'>
                  First Name
                </label>
                <input
                  type='text'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleChange}
                  className='w-full bg-[#0d1117] border border-gray-700 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400'
                  placeholder='Enter first name'
                />
              </div>

              <div>
                <label className='block text-gray-300 text-sm mb-1'>
                  Last Name
                </label>
                <input
                  type='text'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleChange}
                  className='w-full bg-[#0d1117] border border-gray-700 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400'
                  placeholder='Enter last name'
                />
              </div>
            </>
          )}

          <div>
            <label className='block text-gray-300 text-sm mb-1'>Email</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='w-full bg-[#0d1117] border border-gray-700 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400'
              placeholder='admin@example.com'
            />
          </div>

          <div>
            <label className='block text-gray-300 text-sm mb-1'>Password</label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='w-full bg-[#0d1117] border border-gray-700 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400'
              placeholder='Enter password'
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg py-2 transition transform hover:scale-[1.02] flex justify-center items-center'
          >
            {loading ? (
              <>
                <Loader2 size={18} className='animate-spin mr-2' />
                {isLogin ? "Logging in..." : "Registering..."}
              </>
            ) : isLogin ? (
              "Login"
            ) : (
              "Register"
            )}
          </button>
        </form>

        {/* Switch Login/Register */}
        <p className='text-gray-400 text-sm text-center mt-6'>
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className='text-yellow-400 hover:underline'
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className='text-yellow-400 hover:underline'
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AdminAuth;
