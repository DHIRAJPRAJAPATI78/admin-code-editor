import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProblem, clearProblemState } from "../../features/problemSlice";
import { Loader2, Plus, Trash2, ChevronDown, ChevronUp, Code2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import ReactMarkdown from "react-markdown";

const Problem = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error } = useSelector((state) => state.problem);

  const [showPreview, setShowPreview] = useState(false);
  const [expandTests, setExpandTests] = useState(true);
  const [expandHidden, setExpandHidden] = useState(false);
  const [expandSolution, setExpandSolution] = useState(false);

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

  //  Handle change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  //  Dynamic test case handling
  const handleTestChange = (type, index, field, value) => {
    const updated = [...formData[type]];
    updated[index][field] = value;
    setFormData({ ...formData, [type]: updated });
  };

  const addTestCase = (type) => {
    setFormData({
      ...formData,
      [type]: [...formData[type], { input: "", output: "" }],
    });
  };

  const removeTestCase = (type, index) => {
    const updated = formData[type].filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: updated });
  };

  //  Dynamic reference solution
  const handleSolutionChange = (index, field, value) => {
    const updated = [...formData.refrenceSolution];
    updated[index][field] = value;
    setFormData({ ...formData, refrenceSolution: updated });
  };

  const addSolution = () => {
    setFormData({
      ...formData,
      refrenceSolution: [...formData.refrenceSolution, { language: "", code: "" }],
    });
  };

  const removeSolution = (index) => {
    const updated = formData.refrenceSolution.filter((_, i) => i !== index);
    setFormData({ ...formData, refrenceSolution: updated });
  };

  //  Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      tags: formData.tags.split(",").map((t) => t.trim()),
    };
    dispatch(createProblem(data));
  };

  //  Toast & redirect
  useEffect(() => {
    if (success) {
      toast.success(success);
      setTimeout(() => {
        navigate("/admin/problems");
        dispatch(clearProblemState());
      }, 1200);
    }
    if (error) {
      toast.error(error);
      dispatch(clearProblemState());
    }
  }, [success, error, dispatch, navigate]);

  return (
    <motion.div
      className="min-h-screen bg-[#0d1117] text-gray-200 flex items-start justify-center px-4 pt-17"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Toaster position="top-right" />
      <motion.div
        className="max-w-5xl w-full bg-[#161b22] p-8 border border-gray-800 rounded-xl shadow-lg"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-yellow-400">
             Create New Problem
          </h2>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-yellow-400 hover:underline"
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Problem title"
              className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-1">Description (Markdown supported)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Problem description..."
              className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500"
              required
            />
            {showPreview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#0d1117] mt-3 p-3 border border-gray-700 rounded-lg text-gray-300"
              >
                <ReactMarkdown>{formData.description || "Nothing to preview..."}</ReactMarkdown>
              </motion.div>
            )}
          </div>

          {/* Difficulty & Tags */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm mb-1">Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">Tags (comma separated)</label>
              <input
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. array, dp, graph"
                className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          {/* Test Cases (Visible) */}
          <div className="bg-[#0d1117] border border-gray-700 rounded-lg p-4">
            <div
              className="flex justify-between items-center cursor-pointer mb-3"
              onClick={() => setExpandTests(!expandTests)}
            >
              <h3 className="text-yellow-400 font-semibold flex items-center gap-2">
                Visible Test Cases
              </h3>
              {expandTests ? <ChevronUp /> : <ChevronDown />}
            </div>

            <AnimatePresence>
              {expandTests && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {formData.visibleTestCase.map((test, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-3 mb-3">
                      <input
                        placeholder="Input"
                        value={test.input}
                        onChange={(e) =>
                          handleTestChange("visibleTestCase", index, "input", e.target.value)
                        }
                        className="flex-1 bg-[#161b22] border border-gray-700 rounded-lg px-3 py-2"
                      />
                      <input
                        placeholder="Expected Output"
                        value={test.output}
                        onChange={(e) =>
                          handleTestChange("visibleTestCase", index, "output", e.target.value)
                        }
                        className="flex-1 bg-[#161b22] border border-gray-700 rounded-lg px-3 py-2"
                      />
                      <button
                        type="button"
                        onClick={() => removeTestCase("visibleTestCase", index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addTestCase("visibleTestCase")}
                    className="flex items-center gap-2 text-yellow-400 hover:underline mt-2"
                  >
                    <Plus size={16} /> Add Test Case
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hidden Test Cases */}
          <div className="bg-[#0d1117] border border-gray-700 rounded-lg p-4">
            <div
              className="flex justify-between items-center cursor-pointer mb-3"
              onClick={() => setExpandHidden(!expandHidden)}
            >
              <h3 className="text-yellow-400 font-semibold flex items-center gap-2">
                Hidden Test Cases
              </h3>
              {expandHidden ? <ChevronUp /> : <ChevronDown />}
            </div>

            <AnimatePresence>
              {expandHidden && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {formData.hiddenTestCases.map((test, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-3 mb-3">
                      <input
                        placeholder="Input"
                        value={test.input}
                        onChange={(e) =>
                          handleTestChange("hiddenTestCases", index, "input", e.target.value)
                        }
                        className="flex-1 bg-[#161b22] border border-gray-700 rounded-lg px-3 py-2"
                      />
                      <input
                        placeholder="Expected Output"
                        value={test.output}
                        onChange={(e) =>
                          handleTestChange("hiddenTestCases", index, "output", e.target.value)
                        }
                        className="flex-1 bg-[#161b22] border border-gray-700 rounded-lg px-3 py-2"
                      />
                      <button
                        type="button"
                        onClick={() => removeTestCase("hiddenTestCases", index)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addTestCase("hiddenTestCases")}
                    className="flex items-center gap-2 text-yellow-400 hover:underline mt-2"
                  >
                    <Plus size={16} /> Add Hidden Test Case
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Reference Solution */}
          <div className="bg-[#0d1117] border border-gray-700 rounded-lg p-4">
            <div
              className="flex justify-between items-center cursor-pointer mb-3"
              onClick={() => setExpandSolution(!expandSolution)}
            >
              <h3 className="text-yellow-400 font-semibold flex items-center gap-2">
                <Code2 size={18} /> Reference Solution
              </h3>
              {expandSolution ? <ChevronUp /> : <ChevronDown />}
            </div>

            <AnimatePresence>
              {expandSolution && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {formData.refrenceSolution.map((sol, index) => (
                    <div key={index} className="mb-3">
                      <div className="flex gap-3 mb-2">
                        <select
                          value={sol.language}
                          onChange={(e) =>
                            handleSolutionChange(index, "language", e.target.value)
                          }
                          className="bg-[#161b22] border border-gray-700 rounded-lg px-3 py-2"
                        >
                          <option value="cpp">C++</option>
                          <option value="python">Python</option>
                          <option value="java">Java</option>
                          <option value="javascript">JavaScript</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => removeSolution(index)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <textarea
                        placeholder="Enter solution code..."
                        value={sol.code}
                        onChange={(e) =>
                          handleSolutionChange(index, "code", e.target.value)
                        }
                        rows="5"
                        className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-3 py-2 font-mono"
                      ></textarea>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSolution}
                    className="flex items-center gap-2 text-yellow-400 hover:underline mt-2"
                  >
                    <Plus size={16} /> Add Solution
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Editorial */}
          <div>
            <label className="block text-sm mb-1">Editorial (optional)</label>
            <textarea
              name="editorial"
              value={formData.editorial}
              onChange={handleChange}
              rows="4"
              placeholder="Explain approach or logic..."
              className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500"
            ></textarea>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg py-2 transition flex justify-center items-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} /> Saving...
              </>
            ) : (
              "Save Problem"
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Problem;
