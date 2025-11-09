import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ContestForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    isPublic: true,
    problems: [],
  });

  useEffect(() => {
    if (id) {
      // Mock edit mode
      setForm({
        title: "Graph Theory Cup",
        description: "Edit existing contest",
        startTime: "2025-11-10T10:00",
        endTime: "2025-11-10T12:00",
        isPublic: true,
        problems: ["Problem1", "Problem2"],
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id) {
      alert("Contest updated successfully!");
    } else {
      alert("Contest created successfully!");
    }
    navigate("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-[#1e1e1e] p-6 rounded-xl border border-gray-800 shadow-lg"
    >
      <h2 className="text-xl font-semibold text-yellow-400 mb-6">
        {id ? "Edit Contest" : "Create Contest"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm text-gray-300">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full p-2 bg-[#0f0f0f] border border-gray-700 rounded-md focus:border-yellow-400 outline-none text-gray-200"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full p-2 bg-[#0f0f0f] border border-gray-700 rounded-md focus:border-yellow-400 outline-none text-gray-200"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm text-gray-300">Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              required
              className="w-full p-2 bg-[#0f0f0f] border border-gray-700 rounded-md focus:border-yellow-400 outline-none text-gray-200"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-300">End Time</label>
            <input
              type="datetime-local"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              required
              className="w-full p-2 bg-[#0f0f0f] border border-gray-700 rounded-md focus:border-yellow-400 outline-none text-gray-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isPublic"
            checked={form.isPublic}
            onChange={handleChange}
            className="accent-yellow-400"
          />
          <label className="text-sm text-gray-300">Make contest public</label>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 rounded-md transition"
        >
          {id ? "Update Contest" : "Create Contest"}
        </button>
      </form>
    </motion.div>
  );
};

export default ContestForm;
