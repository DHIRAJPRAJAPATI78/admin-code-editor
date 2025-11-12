// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { updateProblem, clearProblemState } from "../../features/problemSlice";
// import {
//   Loader2,
//   Plus,
//   Trash2,
//   ChevronDown,
//   ChevronUp,
//   Code2,
//   ClipboardPaste,
//   X,
//   CheckCircle,
// } from "lucide-react";
// import { useNavigate, useParams } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import toast, { Toaster } from "react-hot-toast";
// import ReactMarkdown from "react-markdown";


// const UpdateProblem = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const { loading, success, error } = useSelector((state) => state.problem);

//   const [showPreview, setShowPreview] = useState(false);
//   const [expandTests, setExpandTests] = useState(true);
//   const [expandHidden, setExpandHidden] = useState(false);
//   const [expandSolution, setExpandSolution] = useState(false);
//   const [showJsonModal, setShowJsonModal] = useState(false);
//   const [jsonInput, setJsonInput] = useState("");

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     difficulty: "easy",
//     tags: "",
//     visibleTestCase: [{ input: "", output: "", explanation: "" }],
//     hiddenTestCases: [{ input: "", output: "" }],
//     refrenceSolution: [{ language: "cpp", solution: "" }],
//     editorial: "",
//   });



//   // ====== Handlers ======
//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleTestChange = (type, index, field, value) => {
//     const updated = [...formData[type]];
//     updated[index][field] = value;
//     setFormData({ ...formData, [type]: updated });
//   };

//   const addTestCase = (type) => {
//     const newCase =
//       type === "visibleTestCase"
//         ? { input: "", output: "", explanation: "" }
//         : { input: "", output: "" };
//     setFormData({
//       ...formData,
//       [type]: [...formData[type], newCase],
//     });
//   };

//   const removeTestCase = (type, index) => {
//     const updated = formData[type].filter((_, i) => i !== index);
//     setFormData({ ...formData, [type]: updated });
//   };

//   const handleSolutionChange = (index, field, value) => {
//     const updated = [...formData.refrenceSolution];
//     updated[index][field] = value;
//     setFormData({ ...formData, refrenceSolution: updated });
//   };

//   const addSolution = () => {
//     setFormData({
//       ...formData,
//       refrenceSolution: [
//         ...formData.refrenceSolution,
//         { language: "cpp", solution: "" },
//       ],
//     });
//   };

//   const removeSolution = (index) => {
//     const updated = formData.refrenceSolution.filter((_, i) => i !== index);
//     setFormData({ ...formData, refrenceSolution: updated });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const data = {
//       ...formData,
//       difficulty: formData.difficulty.toLowerCase(),
//       tags:
//         typeof formData.tags === "string"
//           ? formData.tags.split(",").map((t) => t.trim())
//           : formData.tags,
//     };
//     dispatch(updateProblem({ id, updatedData: data }));
//   };

//   const handleJsonApply = () => {
//     try {
//       const parsed = JSON.parse(jsonInput);
//       setFormData({
//         title: parsed.title || "",
//         description: parsed.description || "",
//         difficulty: parsed.difficulty || "easy",
//         tags: Array.isArray(parsed.tags)
//           ? parsed.tags.join(", ")
//           : parsed.tags || "",
//         visibleTestCase:
//           parsed.visibleTestCase || [{ input: "", output: "", explanation: "" }],
//         hiddenTestCases:
//           parsed.hiddenTestCases || [{ input: "", output: "" }],
//         refrenceSolution:
//           parsed.refrenceSolution || [{ language: "cpp", solution: "" }],
//         editorial: parsed.editorial || "",
//       });
//       toast.success("JSON applied successfully!");
//       setShowJsonModal(false);
//       setJsonInput("");
//     } catch {
//       toast.error("Invalid JSON format!");
//     }
//   };

//   // ===== Toasts =====
//   useEffect(() => {
//     if (success) {
//       toast.success(success);
//       setTimeout(() => {
//         navigate("/admin/problems");
//         dispatch(clearProblemState());
//       }, 1200);
//     }
//     if (error) {
//       toast.error(error);
//       dispatch(clearProblemState());
//     }
//   }, [success, error, dispatch, navigate]);

//   // ====== UI ======
//   return (
//     <motion.div
//       className="min-h-screen bg-[#0d1117] text-gray-200 flex items-start justify-center px-4 pt-20"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.4 }}
//     >
//       <Toaster position="top-center" />
//       <motion.div
//         className="max-w-5xl w-full bg-[#161b22] p-8 border border-gray-800 rounded-xl shadow-lg"
//         initial={{ y: 40, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-semibold text-yellow-400">
//             Update Problem
//           </h2>
//           <div className="flex items-center gap-3">
//             <button
//               type="button"
//               onClick={() => setShowJsonModal(true)}
//               className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1 rounded-md text-sm font-medium"
//             >
//               <ClipboardPaste size={16} /> Paste JSON
//             </button>
//             <button
//               type="button"
//               onClick={() => setShowPreview(!showPreview)}
//               className="text-sm text-yellow-400 hover:underline"
//             >
//               {showPreview ? "Hide Preview" : "Show Preview"}
//             </button>
//           </div>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Title */}
//           <div>
//             <label className="block text-sm mb-1">Title</label>
//             <input
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               placeholder="Problem title"
//               className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500"
//               required
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-sm mb-1">
//               Description (Markdown supported)
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               rows="5"
//               className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500"
//               required
//             />
//             {showPreview && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="bg-[#0d1117] mt-3 p-3 border border-gray-700 rounded-lg text-gray-300"
//               >
//                 <ReactMarkdown>
//                   {formData.description || "Nothing to preview..."}
//                 </ReactMarkdown>
//               </motion.div>
//             )}
//           </div>

//           {/* Difficulty & Tags */}
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="flex-1">
//               <label className="block text-sm mb-1">Difficulty</label>
//               <select
//                 name="difficulty"
//                 value={formData.difficulty}
//                 onChange={handleChange}
//                 className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500"
//               >
//                 <option value="easy">Easy</option>
//                 <option value="medium">Medium</option>
//                 <option value="hard">Hard</option>
//               </select>
//             </div>
//             <div className="flex-1">
//               <label className="block text-sm mb-1">Tags (comma separated)</label>
//               <input
//                 name="tags"
//                 value={formData.tags}
//                 onChange={handleChange}
//                 placeholder="e.g. graph, dp, math"
//                 className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500"
//               />
//             </div>
//           </div>

//           {/* === Visible/Hidden Test Cases & Solutions — same as Create Page === */}
//          <div className="bg-[#0d1117] border border-gray-700 rounded-lg p-4">
//             <div
//               className="flex justify-between items-center cursor-pointer mb-3"
//               onClick={() => setExpandTests(!expandTests)}
//             >
//               <h3 className="text-yellow-400 font-semibold">
//                 Visible Test Cases
//               </h3>
//               {expandTests ? <ChevronUp /> : <ChevronDown />}
//             </div>

//             <AnimatePresence>
//               {expandTests && (
//                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//                   {formData.visibleTestCase.map((test, index) => (
//                     <div key={index} className="mb-3 space-y-2">
//                       <div className="flex flex-col sm:flex-row gap-3">
//                         <input
//                           placeholder="Input"
//                           value={test.input}
//                           onChange={(e) =>
//                             handleTestChange("visibleTestCase", index, "input", e.target.value)
//                           }
//                           className="flex-1 bg-[#161b22] border border-gray-700 rounded-lg px-3 py-2"
//                         />
//                         <input
//                           placeholder="Expected Output"
//                           value={test.output}
//                           onChange={(e) =>
//                             handleTestChange("visibleTestCase", index, "output", e.target.value)
//                           }
//                           className="flex-1 bg-[#161b22] border border-gray-700 rounded-lg px-3 py-2"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => removeTestCase("visibleTestCase", index)}
//                           className="text-red-500 hover:text-red-400"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                       <input
//                         placeholder="Explanation (optional)"
//                         value={test.explanation}
//                         onChange={(e) =>
//                           handleTestChange("visibleTestCase", index, "explanation", e.target.value)
//                         }
//                         className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-3 py-2"
//                       />
//                     </div>
//                   ))}
//                   <button
//                     type="button"
//                     onClick={() => addTestCase("visibleTestCase")}
//                     className="flex items-center gap-2 text-yellow-400 hover:underline mt-2"
//                   >
//                     <Plus size={16} /> Add Test Case
//                   </button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Hidden Test Cases */}
//           <div className="bg-[#0d1117] border border-gray-700 rounded-lg p-4">
//             <div
//               className="flex justify-between items-center cursor-pointer mb-3"
//               onClick={() => setExpandHidden(!expandHidden)}
//             >
//               <h3 className="text-yellow-400 font-semibold">Hidden Test Cases</h3>
//               {expandHidden ? <ChevronUp /> : <ChevronDown />}
//             </div>

//             <AnimatePresence>
//               {expandHidden && (
//                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//                   {formData.hiddenTestCases.map((test, index) => (
//                     <div key={index} className="flex flex-col sm:flex-row gap-3 mb-3">
//                       <input
//                         placeholder="Input"
//                         value={test.input}
//                         onChange={(e) =>
//                           handleTestChange("hiddenTestCases", index, "input", e.target.value)
//                         }
//                         className="flex-1 bg-[#161b22] border border-gray-700 rounded-lg px-3 py-2"
//                       />
//                       <input
//                         placeholder="Expected Output"
//                         value={test.output}
//                         onChange={(e) =>
//                           handleTestChange("hiddenTestCases", index, "output", e.target.value)
//                         }
//                         className="flex-1 bg-[#161b22] border border-gray-700 rounded-lg px-3 py-2"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeTestCase("hiddenTestCases", index)}
//                         className="text-red-500 hover:text-red-400"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
//                   ))}
//                   <button
//                     type="button"
//                     onClick={() => addTestCase("hiddenTestCases")}
//                     className="flex items-center gap-2 text-yellow-400 hover:underline mt-2"
//                   >
//                     <Plus size={16} /> Add Hidden Test Case
//                   </button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Reference Solutions */}
//           <div className="bg-[#0d1117] border border-gray-700 rounded-lg p-4">
//             <div
//               className="flex justify-between items-center cursor-pointer mb-3"
//               onClick={() => setExpandSolution(!expandSolution)}
//             >
//               <h3 className="text-yellow-400 font-semibold flex items-center gap-2">
//                 <Code2 size={18} /> Reference Solutions
//               </h3>
//               {expandSolution ? <ChevronUp /> : <ChevronDown />}
//             </div>

//             <AnimatePresence>
//               {expandSolution && (
//                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//                   {formData.refrenceSolution.map((sol, index) => (
//                     <div key={index} className="mb-3">
//                       <div className="flex gap-3 mb-2">
//                         <select
//                           value={sol.language}
//                           onChange={(e) =>
//                             handleSolutionChange(index, "language", e.target.value)
//                           }
//                           className="bg-[#161b22] border border-gray-700 rounded-lg px-3 py-2"
//                         >
//                           <option value="cpp">C++</option>
//                           <option value="python">Python</option>
//                           <option value="java">Java</option>
//                           <option value="javascript">JavaScript</option>
//                         </select>
//                         <button
//                           type="button"
//                           onClick={() => removeSolution(index)}
//                           className="text-red-500 hover:text-red-400"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </div>
//                       <textarea
//                         placeholder="Enter solution code..."
//                         value={sol.solution}
//                         onChange={(e) =>
//                           handleSolutionChange(index, "solution", e.target.value)
//                         }
//                         rows="5"
//                         className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-3 py-2 font-mono"
//                       ></textarea>
//                     </div>
//                   ))}
//                   <button
//                     type="button"
//                     onClick={addSolution}
//                     className="flex items-center gap-2 text-yellow-400 hover:underline mt-2"
//                   >
//                     <Plus size={16} /> Add Solution
//                   </button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Editorial */}
//           <div>
//             <label className="block text-sm mb-1">Editorial (Markdown)</label>
//             <textarea
//               name="editorial"
//               value={formData.editorial}
//               onChange={handleChange}
//               rows="5"
//               placeholder="Explain logic..."
//               className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500"
//             ></textarea>
//             {showPreview && formData.editorial && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className="bg-[#0d1117] mt-3 p-3 border border-gray-700 rounded-lg text-gray-300"
//               >
//                 <ReactMarkdown>{formData.editorial}</ReactMarkdown>
//               </motion.div>
//             )}
//           </div>

//           {/* Submit */}
//           <motion.button
//             type="submit"
//             disabled={loading}
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg py-2 flex justify-center items-center"
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="animate-spin mr-2" size={18} /> Updating...
//               </>
//             ) : (
//               "Update Problem"
//             )}
//           </motion.button>
//         </form>
//       </motion.div>

//       {/* ===== JSON Modal (same as Create Page) ===== */}
//       <AnimatePresence>
//         {showJsonModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               transition={{ duration: 0.25 }}
//               className="bg-[#161b22] border border-gray-700 p-6 rounded-xl max-w-2xl w-full mx-3 shadow-2xl"
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
//                   <ClipboardPaste size={18} /> Paste JSON
//                 </h3>
//                 <button
//                   onClick={() => setShowJsonModal(false)}
//                   className="text-gray-400 hover:text-gray-200"
//                 >
//                   <X size={20} />
//                 </button>
//               </div>

//               <textarea
//                 value={jsonInput}
//                 onChange={(e) => setJsonInput(e.target.value)}
//                 placeholder="Paste your JSON here..."
//                 rows="10"
//                 className="w-full bg-[#0d1117] border border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-300 focus:ring-2 focus:ring-yellow-500"
//               />

//               <div className="flex justify-end gap-3 mt-4">
//                 <button
//                   onClick={() => setShowJsonModal(false)}
//                   className="px-4 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleJsonApply}
//                   className="px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-400 text-black font-semibold flex items-center gap-2"
//                 >
//                   <CheckCircle size={16} /> Apply JSON
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// export default UpdateProblem;



import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProblem, clearProblemState } from "../../features/problemSlice";
import {
  Loader2,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Code2,
  ClipboardPaste,
  X,
  CheckCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import axios from "axios";

const API_URL =  "http://localhost:3000/user"; 

const UpdateProblem = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { loading, success, error } = useSelector((state) => state.problem);

  const [showPreview, setShowPreview] = useState(false);
  const [expandTests, setExpandTests] = useState(true);
  const [expandHidden, setExpandHidden] = useState(false);
  const [expandSolution, setExpandSolution] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    tags: "",
    visibleTestCase: [{ input: "", output: "", explanation: "" }],
    hiddenTestCases: [{ input: "", output: "" }],
    refrenceSolution: [{ language: "cpp", solution: "" }],
    editorial: "",
  });


  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setFetching(true);
        const res = await axios.get(`${API_URL}/problem/${id}`, {
          withCredentials: true,
        });
console.log(res);
        const problem = res.data;

        setFormData({
          title: problem.title || "",
          description: problem.description || "",
          difficulty: problem.difficulty || "easy",
          tags: Array.isArray(problem.tags)
            ? problem.tags.join(", ")
            : problem.tags || "",
          visibleTestCase:
            problem.visibleTestCase?.length > 0
              ? problem.visibleTestCase
              : [{ input: "", output: "", explanation: "" }],
          hiddenTestCases:
            problem.hiddenTestCases?.length > 0
              ? problem.hiddenTestCases
              : [{ input: "", output: "" }],
          refrenceSolution:
            problem.refrenceSolution?.length > 0
              ? problem.refrenceSolution
              : [{ language: "cpp", solution: "" }],
          editorial: problem.editorial || "",
        });

        setFetching(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load problem data");
        setFetching(false);
      }
    };

    fetchProblem();
  }, [id]);

  // ====== Input Handlers ======
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleTestChange = (type, index, field, value) => {
    const updated = [...formData[type]];
    updated[index][field] = value;
    setFormData({ ...formData, [type]: updated });
  };

  const addTestCase = (type) => {
    const newCase =
      type === "visibleTestCase"
        ? { input: "", output: "", explanation: "" }
        : { input: "", output: "" };
    setFormData({
      ...formData,
      [type]: [...formData[type], newCase],
    });
  };

  const removeTestCase = (type, index) => {
    const updated = formData[type].filter((_, i) => i !== index);
    setFormData({ ...formData, [type]: updated });
  };

  const handleSolutionChange = (index, field, value) => {
    const updated = [...formData.refrenceSolution];
    updated[index][field] = value;
    setFormData({ ...formData, refrenceSolution: updated });
  };

  const addSolution = () => {
    setFormData({
      ...formData,
      refrenceSolution: [
        ...formData.refrenceSolution,
        { language: "cpp", solution: "" },
      ],
    });
  };

  const removeSolution = (index) => {
    const updated = formData.refrenceSolution.filter((_, i) => i !== index);
    setFormData({ ...formData, refrenceSolution: updated });
  };

  // ===== Submit =====
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      difficulty: formData.difficulty.toLowerCase(),
      tags:
        typeof formData.tags === "string"
          ? formData.tags.split(",").map((t) => t.trim())
          : formData.tags,
    };
    dispatch(updateProblem({ id, updatedData: data }));
  };

  // ===== JSON Apply =====
  const handleJsonApply = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setFormData({
        title: parsed.title || "",
        description: parsed.description || "",
        difficulty: parsed.difficulty || "easy",
        tags: Array.isArray(parsed.tags)
          ? parsed.tags.join(", ")
          : parsed.tags || "",
        visibleTestCase:
          parsed.visibleTestCase || [{ input: "", output: "", explanation: "" }],
        hiddenTestCases:
          parsed.hiddenTestCases || [{ input: "", output: "" }],
        refrenceSolution:
          parsed.refrenceSolution || [{ language: "cpp", solution: "" }],
        editorial: parsed.editorial || "",
      });
      toast.success("JSON applied successfully!");
      setShowJsonModal(false);
      setJsonInput("");
    } catch {
      toast.error("Invalid JSON format!");
    }
  };

  // ===== Toast Effects =====
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

  // ===== Loading Screen =====
  if (fetching) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-gray-300 flex items-center justify-center">
        <Loader2 className="animate-spin mr-2" size={24} /> Loading problem data...
      </div>
    );
  }

  // ====== MAIN UI ======
  return (
    <motion.div
      className="min-h-screen bg-[#0d1117] text-gray-200 flex items-start justify-center px-4 pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Toaster position="top-center" />

      {/* ✅ Your existing UI stays the same (header, form, modal, etc.) */}
      <motion.div
        className="max-w-5xl w-full bg-[#161b22] p-8 border border-gray-800 rounded-xl shadow-lg"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-yellow-400">
            Update Problem
          </h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowJsonModal(true)}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1 rounded-md text-sm font-medium"
            >
              <ClipboardPaste size={16} /> Paste JSON
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-sm text-yellow-400 hover:underline"
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
          </div>
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
            <label className="block text-sm mb-1">
              Description (Markdown supported)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500"
              required
            />
            {showPreview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#0d1117] mt-3 p-3 border border-gray-700 rounded-lg text-gray-300"
              >
                <ReactMarkdown>
                  {formData.description || "Nothing to preview..."}
                </ReactMarkdown>
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
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">Tags (comma separated)</label>
              <input
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. graph, dp, math"
                className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          {/* === Visible/Hidden Test Cases & Solutions — same as Create Page === */}
         <div className="bg-[#0d1117] border border-gray-700 rounded-lg p-4">
            <div
              className="flex justify-between items-center cursor-pointer mb-3"
              onClick={() => setExpandTests(!expandTests)}
            >
              <h3 className="text-yellow-400 font-semibold">
                Visible Test Cases
              </h3>
              {expandTests ? <ChevronUp /> : <ChevronDown />}
            </div>

            <AnimatePresence>
              {expandTests && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {formData.visibleTestCase.map((test, index) => (
                    <div key={index} className="mb-3 space-y-2">
                      <div className="flex flex-col sm:flex-row gap-3">
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
                      <input
                        placeholder="Explanation (optional)"
                        value={test.explanation}
                        onChange={(e) =>
                          handleTestChange("visibleTestCase", index, "explanation", e.target.value)
                        }
                        className="w-full bg-[#161b22] border border-gray-700 rounded-lg px-3 py-2"
                      />
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
              <h3 className="text-yellow-400 font-semibold">Hidden Test Cases</h3>
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

          {/* Reference Solutions */}
          <div className="bg-[#0d1117] border border-gray-700 rounded-lg p-4">
            <div
              className="flex justify-between items-center cursor-pointer mb-3"
              onClick={() => setExpandSolution(!expandSolution)}
            >
              <h3 className="text-yellow-400 font-semibold flex items-center gap-2">
                <Code2 size={18} /> Reference Solutions
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
                        value={sol.solution}
                        onChange={(e) =>
                          handleSolutionChange(index, "solution", e.target.value)
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
            <label className="block text-sm mb-1">Editorial (Markdown)</label>
            <textarea
              name="editorial"
              value={formData.editorial}
              onChange={handleChange}
              rows="5"
              placeholder="Explain logic..."
              className="w-full bg-[#0d1117] border border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500"
            ></textarea>
            {showPreview && formData.editorial && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#0d1117] mt-3 p-3 border border-gray-700 rounded-lg text-gray-300"
              >
                <ReactMarkdown>{formData.editorial}</ReactMarkdown>
              </motion.div>
            )}
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg py-2 flex justify-center items-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} /> Updating...
              </>
            ) : (
              "Update Problem"
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* ===== JSON Modal (same as Create Page) ===== */}
      <AnimatePresence>
        {showJsonModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-[#161b22] border border-gray-700 p-6 rounded-xl max-w-2xl w-full mx-3 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
                  <ClipboardPaste size={18} /> Paste JSON
                </h3>
                <button
                  onClick={() => setShowJsonModal(false)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <X size={20} />
                </button>
              </div>

              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste your JSON here..."
                rows="10"
                className="w-full bg-[#0d1117] border border-gray-700 rounded-lg p-3 font-mono text-sm text-gray-300 focus:ring-2 focus:ring-yellow-500"
              />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowJsonModal(false)}
                  className="px-4 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJsonApply}
                  className="px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-400 text-black font-semibold flex items-center gap-2"
                >
                  <CheckCircle size={16} /> Apply JSON
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UpdateProblem;




