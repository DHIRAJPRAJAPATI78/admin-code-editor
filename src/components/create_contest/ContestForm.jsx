import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import {
  getProblemIdInContest,
  updateContest,
  createContest,
  totalProblemsInContest,
} from "../../features/contestSlice";
import { getAllProblems } from "../../features/problemSlice";
import {
  Plus,
  X,
  ExternalLink,
  Check,
  Clock,
  Users,
  Globe,
  Lock,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  Info,
} from "lucide-react";

const ContestForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, contestDetails, contestProblmeId } = useSelector(
    (state) => state.contest
  );
  const { problems } = useSelector((state) => state.problem);

  const [form, setForm] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    isPublic: true,
    problems: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProblemIds, setShowProblemIds] = useState(false);

  // Initialize and fetch data
  useEffect(() => {
    if (problems.length === 0) {
      dispatch(getAllProblems()).catch((error) => {
        toast.error("Failed to load problems");
        console.error("Error loading problems:", error);
      });
    }
  }, [dispatch, problems.length]);

  useEffect(() => {
    dispatch(totalProblemsInContest()).catch((error) => {
      toast.error("Failed to load contest statistics");
      console.error("Error loading contest stats:", error);
    });
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(getProblemIdInContest(id))
        .unwrap()
        .catch((error) => {
          toast.error("Failed to load contest details");
          console.error("Error loading contest:", error);
        });
    }
  }, [id, dispatch]);

  // Prefill form when contestDetails arrive
  useEffect(() => {
    if (id && contestDetails && contestDetails._id) {
      setForm({
        title: contestDetails.title || "",
        description: contestDetails.description || "",
        startTime: contestDetails.startTime?.slice(0, 16) || "",
        endTime: contestDetails.endTime?.slice(0, 16) || "",
        isPublic: contestDetails.isPublic,
        problems: contestDetails.problems || [],
      });
    }
  }, [contestDetails, id]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addProblem = (problemId) => {
    if (!form.problems.includes(problemId)) {
      setForm((prev) => ({
        ...prev,
        problems: [...prev.problems, problemId],
      }));
      toast.success("Problem added to contest");
    }
  };

  const removeProblem = (problemId) => {
    setForm((prev) => ({
      ...prev,
      problems: prev.problems.filter((p) => p !== problemId),
    }));
    toast.success("Problem removed from contest");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (form.problems.length === 0) {
      toast.error("Please add at least one problem to create a contest");
      return;
    }

    if (new Date(form.startTime) >= new Date(form.endTime)) {
      toast.error("End time must be after start time");
      return;
    }

    setIsSubmitting(true);

    try {
      if (id) {
        await dispatch(
          updateContest({ id, updatedData: form })
        ).unwrap();
        toast.success("Contest updated successfully!");
        navigate("/contests");
      } else {
        await dispatch(createContest(form)).unwrap();
        toast.success("Contest created successfully!");
        navigate("/contests");
      }
    } catch (error) {
      console.error("Error saving contest:", error);
      toast.error(
        error.message || "Failed to save contest. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Find a problem by ID
  const getProblemById = (id) => problems.find((p) => p._id === id);

  // Filter problems based on search
  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem._id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Calculate total difficulty points
  const getTotalDifficultyScore = () => {
    return form.problems.reduce((total, pid) => {
      const pb = getProblemById(pid);
      if (!pb) return total;

      const difficultyPoints = {
        easy: 1,
        medium: 3,
        hard: 5,
      };

      return total + (difficultyPoints[pb.difficulty?.toLowerCase()] || 1);
    }, 0);
  };

  const difficultyColors = {
    easy: "bg-green-500/20 text-green-400 border-green-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    hard: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  // Get problem details for display
  const getCurrentContestProblems = () => {
    return form.problems.map((pid) => {
      const pb = getProblemById(pid);
      return {
        id: pid,
        title: pb?.title || "Unknown Problem",
        difficulty: pb?.difficulty || "medium",
      };
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-linear-to-br from-gray-900 to-black py-8 px-4 md:px-6 pt-20"
    >
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
          },
          success: {
            style: {
              background: "#065f46",
              borderColor: "#047857",
            },
          },
          error: {
            style: {
              background: "#7f1d1d",
              borderColor: "#b91c1c",
            },
          },
        }}
      />

      <div className="max-w-9xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {id ? "Edit Contest" : "Create New Contest"}
          </h1>
          <p className="text-gray-400">
            {id
              ? "Modify your contest details and problems"
              : "Create a programming contest with selected problems"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SECTION - Problem Selection */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Selected Problems Card */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-4 md:p-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    Selected Problems
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {form.problems.length} problem
                    {form.problems.length !== 1 ? "s" : ""} selected
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 bg-gray-800 rounded-full">
                    <span className="text-white font-semibold">
                      Difficulty Score:{" "}
                      <span className="text-yellow-400">
                        {getTotalDifficultyScore()}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {form.problems.length > 0 ? (
                  <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {form.problems.map((pid) => {
                      const pb = getProblemById(pid);
                      const difficulty =
                        pb?.difficulty?.toLowerCase() || "medium";

                      return (
                        <motion.div
                          key={pid}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          whileHover={{ y: -2 }}
                          className="group relative bg-linear-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-4 hover:border-blue-500 transition-all duration-300"
                        >
                          <button
                            onClick={() => removeProblem(pid)}
                            className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 z-10"
                            aria-label="Remove problem"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>

                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium border ${difficultyColors[difficulty]}`}
                                >
                                  {pb?.difficulty || "Unknown"}
                                </span>
                                <span className="text-xs text-gray-400 font-mono bg-gray-800 px-2 py-1 rounded">
                                  {pid.slice(0, 8)}...
                                </span>
                              </div>

                              <h3 className="text-white font-semibold line-clamp-1">
                                {pb?.title || "Unknown Problem"}
                              </h3>

                              <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                                {pb?.description || "No description available"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
                            <span className="text-xs text-gray-400 truncate mr-2">
                              ID: {pid.slice(0, 12)}...
                            </span>
                            <button
                              onClick={() => navigate(`/problems/${pid}`)}
                              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 shrink-0"
                            >
                              View <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <Plus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-white font-semibold">
                      No problems selected
                    </h3>
                    <p className="text-gray-400 mt-1">
                      Add problems from the list below to create your contest
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* All Problems Card */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-4 md:p-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-400" />
                    Problem Library
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {filteredProblems.length} available problems
                  </p>
                </div>

                {/* Search Control */}
                <div className="w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search problems by title or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Problems List */}
              <div className="max-h-[500px] overflow-y-auto pr-2 space-y-2">
                <AnimatePresence>
                  {filteredProblems.map((pb) => {
                    const isSelected = form.problems.includes(pb._id);
                    const difficulty = pb.difficulty?.toLowerCase() || "medium";

                    return (
                      <motion.div
                        key={pb._id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ x: 4 }}
                        onClick={() =>
                          isSelected
                            ? removeProblem(pb._id)
                            : addProblem(pb._id)
                        }
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                          isSelected
                            ? "bg-linear-to-r from-green-900/20 to-emerald-900/10 border-green-500/50"
                            : "bg-gray-800/50 hover:bg-gray-700/50 border-gray-700 hover:border-blue-500/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium border ${difficultyColors[difficulty]}`}
                              >
                                {pb.difficulty}
                              </span>
                              <code className="text-xs text-gray-400 font-mono bg-gray-900 px-2 py-1 rounded truncate max-w-[120px]">
                                {pb._id.slice(0, 10)}...
                              </code>
                            </div>

                            <h4 className="text-white font-medium truncate">
                              {pb.title}
                            </h4>

                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                              {pb.description || "No description available"}
                            </p>
                          </div>

                          <motion.div
                            animate={{ scale: isSelected ? 1.1 : 1 }}
                            className="ml-4 shrink-0"
                          >
                            {isSelected ? (
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <Check className="w-5 h-5 text-white" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-blue-500">
                                <Plus className="w-5 h-5 text-gray-400 group-hover:text-white" />
                              </div>
                            )}
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {filteredProblems.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-400">
                      No problems found matching your criteria
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* RIGHT SECTION - Contest Details Form */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="space-y-6">
              <div className="bg-linear-to-b from-gray-900 to-gray-900/90 rounded-2xl border border-gray-800 p-6 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-yellow-400" />
                  Contest Details
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Configure your contest settings
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Contest Title *
                    </label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g., CodeBattle 2024"
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Describe your contest..."
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 resize-none"
                    />
                  </div>

                  {/* DateTime Picker Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Start Time *
                      </label>
                      <input
                        type="datetime-local"
                        name="startTime"
                        value={form.startTime}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        End Time *
                      </label>
                      <input
                        type="datetime-local"
                        name="endTime"
                        value={form.endTime}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Public/Private Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="flex items-center gap-3">
                      {form.isPublic ? (
                        <Globe className="w-5 h-5 text-blue-400" />
                      ) : (
                        <Lock className="w-5 h-5 text-gray-400" />
                      )}
                      <div>
                        <span className="text-white font-medium">
                          {form.isPublic ? "Public Contest" : "Private Contest"}
                        </span>
                        <p className="text-gray-400 text-sm">
                          {form.isPublic
                            ? "Visible to all users"
                            : "Invite only"}
                        </p>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isPublic"
                        checked={form.isPublic}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Stats Card */}
                  <div className="p-4 bg-linear-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700">
                    <h3 className="text-white font-medium mb-3">
                      Contest Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                        <div className="text-2xl font-bold text-white">
                          {form.problems.length}
                        </div>
                        <div className="text-xs text-gray-400">Problems</div>
                      </div>
                      <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-400">
                          {getTotalDifficultyScore()}
                        </div>
                        <div className="text-xs text-gray-400">
                          Difficulty Score
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={
                      isSubmitting || loading || form.problems.length === 0
                    }
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                      isSubmitting || loading || form.problems.length === 0
                        ? "bg-gray-700 cursor-not-allowed"
                        : "bg-linear-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 hover:shadow-lg hover:shadow-yellow-500/20"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        {id ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        {id ? "Update Contest" : "Create Contest"}
                        {!id && <Plus className="w-5 h-5" />}
                      </>
                    )}
                  </button>

                  {/* Validation Warning */}
                  {form.problems.length === 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-red-400 text-sm flex items-center justify-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Please add at least one problem to create a contest
                    </motion.p>
                  )}
                </form>
              </div>

              {/* Problem IDs Information Card */}
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-400" />
                    Problem IDs Information
                  </h3>
                  <button
                    onClick={() => setShowProblemIds(!showProblemIds)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {showProblemIds ? "Hide" : "Show"}
                  </button>
                </div>

                {showProblemIds && (
                  <div className="space-y-4">
                    {/* Current Contest Problem IDs */}
                    <div>
                      <h4 className="text-gray-300 font-medium mb-2 flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400" />
                        Current Contest Problem IDs ({form.problems.length})
                      </h4>
                      <div className="bg-gray-800/50 rounded-lg p-3 max-h-40 overflow-y-auto">
                        {form.problems.length > 0 ? (
                          <div className="space-y-1">
                            {getCurrentContestProblems().map((problem) => (
                              <div
                                key={problem.id}
                                className="flex items-center justify-between text-sm"
                              >
                                <code className="text-gray-300 font-mono truncate">
                                  {problem.id}
                                </code>
                                <span className="text-gray-400 text-xs ml-2">
                                  {problem.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400 text-sm italic">
                            No problems selected
                          </p>
                        )}
                      </div>
                    </div>

                    {/* All Contests Problem IDs */}
                    <div>
                      <h4 className="text-gray-300 font-medium mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-400" />
                        Total Used in All Contests (
                        {contestProblmeId?.problemIds?.length || 0})
                      </h4>
                      <div className="bg-gray-800/50 rounded-lg p-3 max-h-40 overflow-y-auto">
                        {contestProblmeId?.problemIds?.length > 0 ? (
                          <div className="space-y-1">
                            {contestProblmeId.problemIds.map((pid) => {
                              const isUsedInCurrent = form.problems.includes(pid);
                              return (
                                <div
                                  key={pid}
                                  className={`flex items-center justify-between text-sm ${
                                    isUsedInCurrent
                                      ? "text-green-400"
                                      : "text-gray-400"
                                  }`}
                                >
                                  <code className="font-mono truncate">
                                    {pid}
                                  </code>
                                  {isUsedInCurrent && (
                                    <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">
                                      In this contest
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-gray-400 text-sm italic">
                            No problems used in any contest yet
                          </p>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs mt-2">
                        Total unique problems used across all contests
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContestForm;