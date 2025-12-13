import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  Plus,
  X,
  AlertCircle,
  Check,
  Lock,
  Unlock,
  Calendar,
  Clock,
} from "lucide-react";

import {
  createContest,
  totalProblemsInContest,
} from "../../features/contestSlice";
import { getAllProblems } from "../../features/problemSlice";

// LeetCode-like dark theme colors
const colors = {
  bg: "#0f172a",
  card: "#020617",
  border: "#1e293b",
  text: "#e5e7eb",
  muted: "#9ca3af",
  primary: "#facc15",
  danger: "#ef4444",
  success: "#22c55e",
  warning: "#f59e0b",
  info: "#3b82f6",
};

export default function AddContest() {
  const dispatch = useDispatch();

  const { problems: allProblems = [] } = useSelector((state) => state.problem);
  const { contestProblmeId = [] } = useSelector((state) => state.contest);
  console.log(contestProblmeId);
  const [form, setForm] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    problems: [],
    isPublic: true,
  });

  const [loading, setLoading] = useState(false);
  const [showUsedProblems, setShowUsedProblems] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getAllProblems());
    dispatch(totalProblemsInContest());
  }, [dispatch]);

  // Categorize problems into used and unused
  const { unusedProblems, usedProblemsList } = useMemo(() => {
    const usedSet = new Set(contestProblmeId.problemIds);
    console.log(usedSet);
    const unused = allProblems.filter((p) => !usedSet.has(p._id));
    const used = allProblems.filter((p) => usedSet.has(p._id));

    // Filter by search query
    const filterBySearch = (list) =>
      list.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p._id.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return {
      unusedProblems: filterBySearch(unused),
      usedProblemsList: filterBySearch(used),
    };
  }, [allProblems, contestProblmeId, searchQuery]);

  // Get selected problem details
  const selectedProblemsDetails = useMemo(
    () => allProblems.filter((p) => form.problems.includes(p._id)),
    [allProblems, form.problems]
  );

  /* -------------------------------- handlers -------------------------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleProblem = (id, isUsed = false) => {
    if (isUsed) {
      toast.error("This problem is already used in another contest");
      return;
    }

    setForm((prev) => ({
      ...prev,
      problems: prev.problems.includes(id)
        ? prev.problems.filter((p) => p !== id)
        : [...prev.problems, id],
    }));
  };

  const removeSelectedProblem = (id) => {
    setForm((prev) => ({
      ...prev,
      problems: prev.problems.filter((p) => p !== id),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.problems.length === 0) {
      toast.error("Select at least one problem");
      return;
    }

    if (new Date(form.startTime) >= new Date(form.endTime)) {
      toast.error("End time must be after start time");
      return;
    }

    setLoading(true);

    try {
      await dispatch(createContest(form)).unwrap();
      toast.success("Contest created successfully");

      setForm({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        problems: [],
        isPublic: true,
      });
      setSearchQuery("");
    } catch (err) {
      toast.error(err || "Failed to create contest");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------- UI ----------------------------------- */
  return (
    <div
      className='min-h-screen flex items-center justify-center px-4 pt-20 pb-8'
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className='w-full max-w-6xl rounded-2xl p-6 sm:p-8 shadow-xl'
        style={{
          backgroundColor: colors.card,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1
              className='text-2xl font-semibold'
              style={{ color: colors.primary }}
            >
              Create Contest
            </h1>
            <p className='text-sm mt-1' style={{ color: colors.muted }}>
              Create a new coding contest with selected problems
            </p>
          </div>

          <div
            className='flex items-center gap-2 px-3 py-1 rounded-lg'
            style={{ backgroundColor: colors.border }}
          >
            <span className='text-sm' style={{ color: colors.success }}>
              Available: {unusedProblems.length}
            </span>
            <span className='mx-2' style={{ color: colors.muted }}>
              |
            </span>
            <span className='text-sm' style={{ color: colors.warning }}>
              Used: {usedProblemsList.length}
            </span>
          </div>
        </div>

        {/* Contest Details Card */}
        <div
          className='mb-8 p-4 rounded-xl'
          style={{ backgroundColor: colors.border + "20" }}
        >
          <h2 className='text-lg font-medium mb-4 flex items-center gap-2'>
            <Calendar size={18} />
            Contest Details
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Title */}
            <div>
              <label className='block text-sm mb-2 font-medium'>Title *</label>
              <input
                name='title'
                value={form.title}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder='Enter contest title'
                className='w-full rounded-lg px-4 py-3 bg-transparent border text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition'
                style={{ borderColor: colors.border }}
              />
            </div>

            {/* Visibility */}
            <div>
              <label className='block text-sm mb-2 font-medium'>
                Visibility
              </label>
              <div className='flex items-center gap-4'>
                <button
                  type='button'
                  onClick={() =>
                    setForm((prev) => ({ ...prev, isPublic: true }))
                  }
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition ${
                    form.isPublic
                      ? "border-yellow-500 bg-yellow-500/10"
                      : "border-gray-700"
                  }`}
                >
                  <Unlock size={16} />
                  <span>Public</span>
                </button>
                <button
                  type='button'
                  onClick={() =>
                    setForm((prev) => ({ ...prev, isPublic: false }))
                  }
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition ${
                    !form.isPublic
                      ? "border-red-500 bg-red-500/10"
                      : "border-gray-700"
                  }`}
                >
                  <Lock size={16} />
                  <span>Private</span>
                </button>
              </div>
            </div>

            {/* Start Time */}
            <div>
              <label className='block text-sm mb-2 font-medium'>
                Start Time *
              </label>
              <div className='relative'>
                <Clock
                  size={16}
                  className='absolute left-3 top-1/2 transform -translate-y-1/2'
                  style={{ color: colors.muted }}
                />
                <input
                  type='datetime-local'
                  name='startTime'
                  value={form.startTime}
                  onChange={handleChange}
                  required
                  className='w-full rounded-lg pl-10 pr-4 py-3 bg-transparent border text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition'
                  style={{ borderColor: colors.border }}
                />
              </div>
            </div>

            {/* End Time */}
            <div>
              <label className='block text-sm mb-2 font-medium'>
                End Time *
              </label>
              <div className='relative'>
                <Clock
                  size={16}
                  className='absolute left-3 top-1/2 transform -translate-y-1/2'
                  style={{ color: colors.muted }}
                />
                <input
                  type='datetime-local'
                  name='endTime'
                  value={form.endTime}
                  onChange={handleChange}
                  required
                  className='w-full rounded-lg pl-10 pr-4 py-3 bg-transparent border text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition'
                  style={{ borderColor: colors.border }}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className='mt-4'>
            <label className='block text-sm mb-2 font-medium'>
              Description
            </label>
            <textarea
              name='description'
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder='Describe the contest (optional)'
              className='w-full rounded-lg px-4 py-3 bg-transparent border text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition resize-none'
              style={{ borderColor: colors.border }}
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className='mb-6'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search problems by title or ID...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full rounded-lg pl-4 pr-10 py-3 bg-transparent border text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition'
              style={{ borderColor: colors.border }}
            />
            {searchQuery && (
              <button
                type='button'
                onClick={() => setSearchQuery("")}
                className='absolute right-3 top-1/2 transform -translate-y-1/2'
                style={{ color: colors.muted }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Problem Selection - Two Column Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          {/* Available Problems */}
          <div>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-lg font-medium flex items-center gap-2'>
                <Check size={18} style={{ color: colors.success }} />
                Available Problems
                <span
                  className='text-sm px-2 py-1 rounded'
                  style={{
                    backgroundColor: colors.success + "20",
                    color: colors.success,
                  }}
                >
                  {unusedProblems.length}
                </span>
              </h2>
            </div>

            <div
              className='rounded-xl border p-3 space-y-2 max-h-[400px] overflow-y-auto'
              style={{ borderColor: colors.border }}
            >
              {unusedProblems.map((p) => (
                <motion.button
                  type='button'
                  key={p._id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleProblem(p._id, false)}
                  className={`w-full text-left rounded-lg p-3 text-sm border transition-all flex items-center justify-between group ${
                    form.problems.includes(p._id)
                      ? "border-yellow-500 bg-yellow-500/10"
                      : "border-gray-700 hover:border-yellow-500/50 hover:bg-yellow-500/5"
                  }`}
                >
                  <div className='flex-1'>
                    <div className='font-medium truncate'>{p.title}</div>
                    <div className='text-xs opacity-70 mt-1 font-mono'>
                      ID: {p._id}
                    </div>
                    <div className='flex items-center gap-2 mt-2'>
                      <span
                        className='text-xs px-2 py-0.5 rounded'
                        style={{
                          backgroundColor: colors.info + "20",
                          color: colors.info,
                        }}
                      >
                        {p.difficulty || "Unknown"}
                      </span>
                      {p.tags && p.tags.length > 0 && (
                        <span
                          className='text-xs px-2 py-0.5 rounded'
                          style={{ backgroundColor: colors.border }}
                        >
                          {p.tags[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center ml-2 ${
                      form.problems.includes(p._id)
                        ? "border-yellow-500 bg-yellow-500"
                        : "border-gray-600"
                    }`}
                  >
                    {form.problems.includes(p._id) && (
                      <Check size={12} className='text-gray-900' />
                    )}
                  </div>
                </motion.button>
              ))}

              {unusedProblems.length === 0 && (
                <div className='text-center py-8'>
                  <AlertCircle
                    className='mx-auto mb-2'
                    size={24}
                    style={{ color: colors.muted }}
                  />
                  <p className='text-sm' style={{ color: colors.muted }}>
                    {searchQuery
                      ? "No available problems match your search"
                      : "No available problems"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Used Problems */}
          <div>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-lg font-medium flex items-center gap-2'>
                <Lock size={18} style={{ color: colors.warning }} />
                Used in Other Contests
                <span
                  className='text-sm px-2 py-1 rounded'
                  style={{
                    backgroundColor: colors.warning + "20",
                    color: colors.warning,
                  }}
                >
                  {usedProblemsList.length}
                </span>
              </h2>
              <button
                type='button'
                onClick={() => setShowUsedProblems(!showUsedProblems)}
                className='text-sm flex items-center gap-1 px-3 py-1 rounded-lg hover:opacity-80 transition'
                style={{ backgroundColor: colors.border }}
              >
                {showUsedProblems ? "Hide" : "Show"}
              </button>
            </div>

            {showUsedProblems && (
              <div
                className='rounded-xl border p-3 space-y-2 max-h-[400px] overflow-y-auto'
                style={{ borderColor: colors.warning + "40" }}
              >
                {usedProblemsList.map((p) => (
                  <div
                    key={p._id}
                    className='w-full text-left rounded-lg p-3 text-sm border cursor-not-allowed opacity-70'
                    style={{
                      borderColor: colors.warning + "40",
                      backgroundColor: colors.warning + "5",
                    }}
                  >
                    <div className='font-medium flex items-center gap-2'>
                      {p.title}
                      <span
                        className='text-xs px-2 py-0.5 rounded'
                        style={{
                          backgroundColor: colors.warning + "20",
                          color: colors.warning,
                        }}
                      >
                        Used
                      </span>
                    </div>
                    <div className='text-xs opacity-70 mt-1 font-mono'>
                      ID: {p._id}
                    </div>
                    <div className='flex items-center gap-2 mt-2'>
                      <span
                        className='text-xs px-2 py-0.5 rounded'
                        style={{
                          backgroundColor: colors.info + "20",
                          color: colors.info,
                        }}
                      >
                        {p.difficulty || "Unknown"}
                      </span>
                      {p.tags && p.tags.length > 0 && (
                        <span
                          className='text-xs px-2 py-0.5 rounded'
                          style={{ backgroundColor: colors.border }}
                        >
                          {p.tags[0]}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {usedProblemsList.length === 0 && (
                  <div className='text-center py-8'>
                    <AlertCircle
                      className='mx-auto mb-2'
                      size={24}
                      style={{ color: colors.muted }}
                    />
                    <p className='text-sm' style={{ color: colors.muted }}>
                      {searchQuery
                        ? "No used problems match your search"
                        : "No used problems found"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Selected Problems Preview */}
        {selectedProblemsDetails.length > 0 && (
          <div
            className='mb-6 p-4 rounded-xl'
            style={{ backgroundColor: colors.border + "20" }}
          >
            <h3 className='text-md font-medium mb-3 flex items-center gap-2'>
              <Plus size={16} />
              Selected Problems ({selectedProblemsDetails.length})
            </h3>
            <div className='flex flex-wrap gap-2'>
              {selectedProblemsDetails.map((p) => (
                <motion.div
                  key={p._id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className='flex items-center gap-2 px-3 py-2 rounded-lg group'
                  style={{ backgroundColor: colors.border }}
                >
                  <span className='text-sm truncate max-w-[200px]'>
                    {p.title}
                  </span>
                  <button
                    type='button'
                    onClick={() => removeSelectedProblem(p._id)}
                    className='opacity-70 hover:opacity-100 hover:text-red-400 transition'
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className='flex items-center justify-between'>
          <div className='text-sm' style={{ color: colors.muted }}>
            {form.problems.length === 0 ? (
              <span>Select at least one problem to continue</span>
            ) : (
              <span className='flex items-center gap-2'>
                <Check size={14} style={{ color: colors.success }} />
                Ready to create contest with {form.problems.length} problem
                {form.problems.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: form.problems.length > 0 ? 1.02 : 1 }}
            whileTap={{ scale: form.problems.length > 0 ? 0.97 : 1 }}
            disabled={loading || form.problems.length === 0}
            type='submit'
            className={`px-8 py-3 rounded-xl font-medium transition ${
              form.problems.length > 0
                ? "hover:shadow-lg hover:shadow-yellow-500/20"
                : "opacity-50 cursor-not-allowed"
            }`}
            style={{
              backgroundColor:
                form.problems.length > 0 ? colors.primary : colors.muted,
              color: "#000",
            }}
          >
            {loading ? (
              <span className='flex items-center gap-2'>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className='w-4 h-4 border-2 border-black border-t-transparent rounded-full'
                />
                Creating...
              </span>
            ) : (
              `Create Contest (${form.problems.length})`
            )}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}
