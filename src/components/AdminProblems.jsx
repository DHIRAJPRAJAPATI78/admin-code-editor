import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProblems,
  deleteProblem,
  clearProblemState,
} from "../features/problemSlice";
import {
  Loader2,
  Trash2,
  Plus,
  Search,
  Filter,
  X,
  Info,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const AdminProblems = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { problems, loading, error, success } = useSelector(
    (state) => state.problem
  );
console.log(problems);
 
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [sortOption, setSortOption] = useState("latest");
  const [selectedProblem, setSelectedProblem] = useState(null);


  useEffect(() => {
    dispatch(getAllProblems());
  }, [dispatch]);

  
  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearProblemState());
    }
    if (error) {
      toast.error(error);
      dispatch(clearProblemState());
    }
  }, [success, error, dispatch]);

  //  Filter + Search + Sort Logic

const filteredProblems = problems
  .filter((p) => {
    const titleMatch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const creatorName = `${p.creator?.firstName || ""} ${p.creator?.lastName || ""}`.toLowerCase();
    const creatorMatch = creatorName.includes(searchTerm.toLowerCase());
    return titleMatch || creatorMatch;
  })
  .filter((p) =>
    filterDifficulty ? p.difficulty.toLowerCase() === filterDifficulty.toLowerCase() : true
  )
  .sort((a, b) => {
    if (sortOption === "latest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOption === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortOption === "title") return a.title.localeCompare(b.title);
    return 0;
  });


  const handleDelete = (id) => {
    setSelectedProblem(id);
  };

  const confirmDelete = () => {
    dispatch(deleteProblem(selectedProblem));
    setSelectedProblem(null);
  };

  const cancelDelete = () => {
    setSelectedProblem(null);
  };

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
            Admin Problem Management
          </h2>
          <button
            onClick={() => navigate("/admin/problem/create")}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 transition-transform hover:scale-105"
          >
            <Plus size={18} /> Create Problem
          </button>
        </motion.div>

        {/* Controls */}
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
              placeholder="Search problem..."
              className="bg-transparent w-full outline-none text-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap justify-center">
            <select
              className="bg-gray-800/50 px-3 py-2 rounded-lg text-gray-200 border border-gray-700"
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
            >
              <option value="">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <select
              className="bg-gray-800/50 px-3 py-2 rounded-lg text-gray-200 border border-gray-700"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-6 text-sm text-gray-400 flex flex-wrap justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>{filteredProblems.length} Problems Found</p>
          <p className="text-xs italic flex items-center gap-1">
            <Info size={14} /> Filter or search to refine the list
          </p>
        </motion.div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : filteredProblems.length === 0 ? (
          <motion.p
            className="text-center py-20 text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No problems found.
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
                  <th className="px-6 py-3">Difficulty</th>
                  <th className="px-6 py-3">Tags</th>
                  <th className="px-6 py-3">Creator</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <AnimatePresence>
                <tbody>
                  {filteredProblems.map((p, index) => (
                    <motion.tr
                      key={p._id}
                      className="border-b border-gray-800 hover:bg-gray-800/70 transition group"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <td className="px-6 py-3 font-medium">{p.title}</td>
                      <td
                        className={`px-6 py-3 font-semibold ${
                          p.difficulty === "Easy"
                            ? "text-green-400"
                            : p.difficulty === "Medium"
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      >
                        {p.difficulty}
                      </td>
                      <td className="px-6 py-3 text-gray-400">
                        {Array.isArray(p.tags) ? p.tags.join(", ") : ""}
                      </td>
                      <td className="px-6 py-3">
                        {p.creator
                          ? `${p.creator.firstName || ""} ${p.creator.lastName || ""}`
                          : "Unknown"}
                      </td>
                      <td className="px-6 py-3 text-right flex justify-end gap-3">
                        <Link
                         to={`/admin/problem/edit/${p._id}`}
                          className="text-yellow-400 hover:text-yellow-300 font-semibold transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id)}
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

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {selectedProblem && (
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
                  Are you sure you want to delete this problem? This action cannot be undone.
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

export default AdminProblems;
