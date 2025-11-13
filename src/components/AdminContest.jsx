import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllContests,
  deleteContest,
  clearContestState,
} from "../features/contestSlice";
import {
  Loader2,
  Trash2,
  Plus,
  Search,
  Filter,
  Info,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const AdminContests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { contests, loading, error, success, totalPages, currentPage } =
    useSelector((state) => state.contest);
console.log(contests);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPublic, setFilterPublic] = useState("");
  const [sortOption, setSortOption] = useState("upcoming");
  const [selectedContest, setSelectedContest] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getAllContests({ page }));
  }, [dispatch, page]);

  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearContestState());
    }
    if (error) {
      toast.error(error);
      dispatch(clearContestState());
    }
  }, [success, error, dispatch]);

  const filteredContests = contests?.contests?.filter((c) => {
      const matchTitle = c.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCreator = c.createdBy?.firstName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchTitle || matchCreator;
    })
    .filter((c) => (filterStatus ? c.status === filterStatus : true))
    .filter((c) =>
      filterPublic ? String(c.isPublic) === filterPublic : true
    )
    .sort((a, b) => {
      if (sortOption === "upcoming") return new Date(a.startTime) - new Date(b.startTime);
      if (sortOption === "latest") return new Date(b.startTime) - new Date(a.startTime);
      if (sortOption === "title") return a.title.localeCompare(b.title);
      return 0;
    });

  const handleDelete = (id) => {
    setSelectedContest(id);
  };

  const confirmDelete = () => {
    dispatch(deleteContest(selectedContest));
    setSelectedContest(null);
  };

  const cancelDelete = () => {
    setSelectedContest(null);
  };
  if(!contests){
    return null;
  }
  return (
    <motion.div
      className="min-h-screen bg-[#0d1117] text-gray-200 px-4 pt-20 pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Toaster position="top-center" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-yellow-400 text-center sm:text-left">
            Admin Contest Management
          </h2>
          <button
            onClick={() => navigate("/admin/contest/create")}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 transition-transform hover:scale-105"
          >
            <Plus size={18} /> Create Contest
          </button>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="bg-[#161b22]/70 backdrop-blur-lg border border-gray-700 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Search */}
          <div className="flex items-center bg-gray-800/50 px-3 py-2 rounded-lg w-full md:w-1/3">
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search contest..."
              className="bg-transparent w-full outline-none text-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Dropdowns */}
          <div className="flex gap-3 flex-wrap justify-center">
            <select
              className="bg-gray-800/50 px-3 py-2 rounded-lg text-gray-200 border border-gray-700"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="finished">Finished</option>
            </select>

            <select
              className="bg-gray-800/50 px-3 py-2 rounded-lg text-gray-200 border border-gray-700"
              value={filterPublic}
              onChange={(e) => setFilterPublic(e.target.value)}
            >
              <option value="">All Visibility</option>
              <option value="true">Public</option>
              <option value="false">Private</option>
            </select>

            <select
              className="bg-gray-800/50 px-3 py-2 rounded-lg text-gray-200 border border-gray-700"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="upcoming">Upcoming First</option>
              <option value="latest">Latest First</option>
              <option value="title">Title (A–Z)</option>
            </select>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-6 text-sm text-gray-400 flex flex-wrap justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>{filteredContests?.length || 0} Contests Found</p>
          <p className="text-xs italic flex items-center gap-1">
            <Info size={14} /> Filter or search to refine the list
          </p>
        </motion.div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : filteredContests?.length === 0 ? (
          <motion.p
            className="text-center py-20 text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No contests found.
          </motion.p>
        ) : (
          <motion.div
            className="overflow-x-auto bg-[#161b22]/60 border border-gray-700 rounded-lg mt-4 shadow-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <table className="min-w-full text-left text-sm sm:text-base">
              <thead className="border-b border-gray-700 text-gray-300 bg-gray-800/30">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Start Time</th>
                  <th className="px-6 py-3">End Time</th>
                  <th className="px-6 py-3">Creator</th>
                  <th className="px-6 py-3">Problems</th>
                  <th className="px-6 py-3">Users</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <AnimatePresence>
                <tbody>
                  {filteredContests?.map((c, index) => (
                    <motion.tr
                      key={c._id}
                      className="border-b border-gray-800 hover:bg-gray-800/70 transition group"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <td className="px-6 py-3 font-medium">{c.title}</td>
                      <td
                        className={`px-6 py-3 font-semibold ${
                          c.status === "upcoming"
                            ? "text-yellow-400"
                            : c.status === "ongoing"
                            ? "text-green-400"
                            : "text-gray-400"
                        }`}
                      >
                        {c.status}
                      </td>
                      <td className="px-6 py-3 text-gray-400">
                        {new Date(c.startTime).toLocaleString()}
                      </td>
                      <td className="px-6 py-3 text-gray-400">
                        {new Date(c.endTime).toLocaleString()}
                      </td>
                      <td className="px-6 py-3">
                        {c.createdBy?.firstName || "Unknown"}
                      </td>
                      <td className="px-6 py-3 text-center text-blue-400 font-semibold">
                        {c.totalProblems}
                      </td>
                      <td className="px-6 py-3 text-center text-pink-400 font-semibold">
                        {c.totalUsers}
                      </td>
                      <td className="px-6 py-3 text-right flex justify-end gap-3">
                        <Link
                          to={`/admin/contest/edit/${c._id}`}
                          className="text-yellow-400 hover:text-yellow-300 font-semibold transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="text-red-500 hover:text-red-400 transition transform hover:scale-110"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </AnimatePresence>
            </table>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-3">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === i + 1
                    ? "bg-yellow-500 text-black font-bold"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Delete Modal */}
        <AnimatePresence>
          {selectedContest && (
            <motion.div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-[#161b22] border border-gray-700 p-6 rounded-xl max-w-sm w-full text-center"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <h3 className="text-xl font-semibold text-yellow-400 mb-3">
                  Confirm Deletion
                </h3>
                <p className="text-gray-400 mb-6">
                  Are you sure you want to delete this contest? This action cannot be undone.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={cancelDelete}
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-white"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AdminContests;
