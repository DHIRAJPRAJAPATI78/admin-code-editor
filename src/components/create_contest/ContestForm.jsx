import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {getAllContests, updateContest, createContest } from "../../features/contestSlice";
import { getAllProblems } from "../../features/problemSlice";

const ContestForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filterproblem, setFilterProblem] = useState(null);
  const { getAllContests, updateContest, loading } = useSelector((state) => state.contest);
  const { problems } = useSelector((state) => state.problem);
  const { contests } = useSelector((state) => state.contest);
  console.log(problems);
  console.log(contests);
  const [form, setForm] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    isPublic: true,
    status: "upcoming",
    problems: [],
  });

  // Load problems and contest (if editing)
  useEffect(() => {
    
    if(problems.length==0){
      dispatch(getAllProblems());
    }

  }, [id]);

  // Prefill form when contest loads
  useEffect(() => {
    if (id) {
      setForm({
        title: singleContest.title || "",
        description: singleContest.description || "",
        startTime: singleContest.startTime?.slice(0, 16) || "",
        endTime: singleContest.endTime?.slice(0, 16) || "",
        isPublic: singleContest.isPublic,
        status: singleContest.status || "upcoming",
        problems: singleContest.problems || [],
      });
    }
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleProblem = (problemId) => {
    setForm((prev) => ({
      ...prev,
      problems: prev.problems.includes(problemId)
        ? prev.problems.filter((p) => p !== problemId)
        : [...prev.problems, problemId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (id) {
      dispatch(updateContest({ id, updatedData: form }))
        .unwrap()
        .then(() => navigate("/contests"));
    } else {
      dispatch(createContest(form))
        .unwrap()
        .then(() => navigate("/contests"));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className='max-w-2xl mx-auto bg-[#1e1e1e] p-6 mt-16 rounded-xl border border-gray-800 shadow-lg'
    >
      <h2 className='text-xl font-semibold text-yellow-400 mb-6'>
        {id ? "Edit Contest" : "Create Contest"}
      </h2>

      {loading ? (
        <p className='text-gray-400'>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className='space-y-5'>
          {/* Title */}
          <div>
            <label className='block mb-1 text-sm text-gray-300'>Title</label>
            <input
              name='title'
              value={form.title}
              onChange={handleChange}
              required
              maxLength={100}
              className='w-full p-2 bg-[#0f0f0f] border border-gray-700 rounded-md
                focus:border-yellow-400 outline-none text-gray-200'
            />
          </div>

          {/* Description */}
          <div>
            <label className='block mb-1 text-sm text-gray-300'>
              Description
            </label>
            <textarea
              name='description'
              value={form.description}
              onChange={handleChange}
              rows='3'
              className='w-full p-2 bg-[#0f0f0f] border border-gray-700 rounded-md
                focus:border-yellow-400 outline-none text-gray-200'
            />
          </div>

          {/* Start & End Time */}
          <div className='grid sm:grid-cols-2 gap-4'>
            <div>
              <label className='block mb-1 text-sm text-gray-300'>
                Start Time
              </label>
              <input
                type='datetime-local'
                name='startTime'
                value={form.startTime}
                onChange={handleChange}
                required
                className='w-full p-2 bg-[#0f0f0f] border border-gray-700 rounded-md
                focus:border-yellow-400 outline-none text-gray-200'
              />
            </div>

            <div>
              <label className='block mb-1 text-sm text-gray-300'>
                End Time
              </label>
              <input
                type='datetime-local'
                name='endTime'
                value={form.endTime}
                onChange={handleChange}
                required
                className='w-full p-2 bg-[#0f0f0f] border border-gray-700 rounded-md
                focus:border-yellow-400 outline-none text-gray-200'
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className='block mb-1 text-sm text-gray-300'>Status</label>
            <select
              name='status'
              value={form.status}
              onChange={handleChange}
              className='w-full bg-[#0f0f0f] border border-gray-700 p-2 rounded-md
                text-gray-200 focus:border-yellow-400 outline-none'
            >
              <option value='upcoming'>Upcoming</option>
              <option value='running'>Running</option>
              <option value='completed'>Completed</option>
            </select>
          </div>

          {/* Problems List */}
          <div>
            <label className='block mb-2 text-sm text-gray-300'>
              Select Problems
            </label>

            <div className='bg-[#0f0f0f] border border-gray-700 p-3 rounded-lg max-h-40 overflow-y-auto'>
              {problems?.length === 0 && (
                <p className='text-gray-500 text-sm'>No problems available</p>
              )}

              {problems?.map((p) => (
                <label
                  key={p._id}
                  className='flex items-center gap-3 text-gray-300 mb-2'
                >
                  <input
                    type='checkbox'
                    checked={form.problems.includes(p._id)}
                    onChange={() => toggleProblem(p._id)}
                    className='accent-yellow-400'
                  />
                  {p.title}
                </label>
              ))}
            </div>
          </div>

          {/* Public */}
          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              name='isPublic'
              checked={form.isPublic}
              onChange={handleChange}
              className='accent-yellow-400'
            />
            <label className='text-sm text-gray-300'>Make contest public</label>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 rounded-md transition'
          >
            {id ? "Update Contest" : "Create Contest"}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default ContestForm;



// fetch all problem -> filter which is the part of the contest ->take that problem