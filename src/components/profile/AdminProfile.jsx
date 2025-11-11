import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProfileAdmin,
  updateProfileAdmin,
  clearProfileState,
} from "../../features/profileSlice";
import { motion } from "framer-motion";
import { Loader2, Camera, CheckCircle, XCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const AdminProfile = () => {
  const dispatch = useDispatch();
  const { user, loading, error, success } = useSelector((state) => state.profile);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    profilePic: "",
  });

  useEffect(() => {
    dispatch(getProfileAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
        profilePic: user.profilePic || "",
      });
    }
  }, [user]);


  useEffect(() => {
    if (error) {
      console.log('object');
      toast.dismiss(); 
      toast.error(error, {
        style: {
          background: "#1a1a1a",
          color: "#FFA116",
          border: "1px solid #333",
        },
      });
      setTimeout(() => dispatch(clearProfileState()), 2500);
    }

    if (success) {
      toast.dismiss();
      toast.success(success, {
        style: {
          background: "#1a1a1a",
          color: "#FFA116",
          border: "1px solid #333",
        },
      });
      setTimeout(() => dispatch(clearProfileState()), 2500);
    }
  }, [error, success, dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfileAdmin(formData));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#0e0e0e] flex flex-col items-center pt-17 px-4 text-white"
    >
      <Toaster position="top-center" reverseOrder={false} />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="w-full max-w-2xl bg-[#1a1a1a] shadow-2xl rounded-2xl p-8 border border-[#2a2a2a]"
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={
                formData.profilePic ||
                "https://avatars.githubusercontent.com/u/9919?v=4"
              }
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-[#FFA116] shadow-md"
            />
            <label className="absolute bottom-1 right-1 bg-[#FFA116] p-2 rounded-full cursor-pointer hover:bg-[#ffb733] transition">
              <Camera size={18} className="text-black" />
              <input
                type="text"
                name="profilePic"
                value={formData.profilePic}
                onChange={handleChange}
                placeholder="Profile image URL"
                className="hidden"
              />
            </label>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-gray-400 text-sm mt-1">@{user?.email}</p>
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 border-t border-[#2a2a2a] pt-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-[#121212] text-white border border-[#2a2a2a] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FFA116] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-[#121212] text-white border border-[#2a2a2a] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FFA116] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              className="w-full bg-[#121212] text-white border border-[#2a2a2a] rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#FFA116] outline-none resize-none"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            className="w-full bg-[#FFA116] text-black py-2 rounded-lg font-semibold hover:bg-[#ffb733] transition flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <CheckCircle size={18} />
                Update Profile
              </>
            )}
          </motion.button>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm mt-2">
              <XCircle size={16} />
              {error}
            </div>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminProfile;
