import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProblem } from "../../features/problemSlice";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Problem = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.problem);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    tags: "",
    visibleTestCase: [{ input: "", output: "" }],
    hiddenTestCases: [{ input: "", output: "" }],
    refrenceSolution: [{ language: "cpp", code: "" }],
    editorial: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      tags: formData.tags.split(",").map((t) => t.trim()),
    };
    dispatch(createProblem(data));
    navigate("/admin/problems");
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full bg-[#161b22] p-8 border border-gray-800 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-yellow-400 text-center mb-6">
          Create Problem
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-[#0d1117] border border-gray-700 text-gray-200 rounded-lg px-3 py-2"
              placeholder="Problem title"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full bg-[#0d1117] border border-gray-700 text-gray-200 rounded-lg px-3 py-2"
              placeholder="Problem description..."
              required
            ></textarea>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm mb-1 text-gray-300">
                Difficulty
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full bg-[#0d1117] border border-gray-700 text-gray-200 rounded-lg px-3 py-2"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm mb-1 text-gray-300">Tags</label>
              <input
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full bg-[#0d1117] border border-gray-700 text-gray-200 rounded-lg px-3 py-2"
                placeholder="e.g. array, dp"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg py-2 transition transform hover:scale-[1.02] flex justify-center items-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} /> Saving...
              </>
            ) : (
              "Save Problem"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Problem;
