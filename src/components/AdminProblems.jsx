// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllProblems, deleteProblem } from "../features/problemSlice";
// import { Loader2, Trash2, Plus } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const AdminProblems = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { problems, loading } = useSelector((state) => state.problem);

//   useEffect(() => {
//     dispatch(getAllProblems());
//   }, [dispatch]);

//   return (
//     <div className="min-h-screen bg-[#0d1117] text-gray-200 px-4 py-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-3xl font-bold text-yellow-400">
//             Admin Problem Management
//           </h2>
//           <button
//             onClick={() => navigate("/admin/problem/create")}
//             className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg flex items-center gap-2"
//           >
//             <Plus size={18} /> Create Problem
//           </button>
//         </div>

//         {loading ? (
//           <div className="flex justify-center py-20">
//             <Loader2 className="animate-spin" size={32} />
//           </div>
//         ) : (
//           <div className="overflow-x-auto bg-[#161b22] border border-gray-700 rounded-lg">
//             <table className="min-w-full text-left">
//               <thead className="border-b border-gray-700 text-gray-300">
//                 <tr>
//                   <th className="px-6 py-3">Title</th>
//                   <th className="px-6 py-3">Difficulty</th>
//                   <th className="px-6 py-3">Tags</th>
//                   <th className="px-6 py-3">Creator</th>
//                   <th className="px-6 py-3 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {problems.map((p) => (
//                   <tr
//                     key={p._id}
//                     className="border-b border-gray-800 hover:bg-gray-800/50 transition"
//                   >
//                     <td className="px-6 py-3">{p.title}</td>
//                     <td
//                       className={`px-6 py-3 font-semibold ${
//                         p.difficulty === "Easy"
//                           ? "text-green-400"
//                           : p.difficulty === "Medium"
//                           ? "text-yellow-400"
//                           : "text-red-400"
//                       }`}
//                     >
//                       {p.difficulty}
//                     </td>
//                     <td className="px-6 py-3">
//                       {p.tags?.join(", ") || "-"}
//                     </td>
//                     <td className="px-6 py-3">
//                       {p.creator?.firstName} {p.creator?.lastName}
//                     </td>
//                     <td className="px-6 py-3 text-right flex justify-end gap-2">
//                       <button
//                         onClick={() => navigate(`/admin/problem/edit/${p._id}`)}
//                         className="text-yellow-400 hover:underline"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => dispatch(deleteProblem(p._id))}
//                         className="text-red-500 hover:text-red-400 transition"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {problems.length === 0 && (
//               <p className="text-center py-6 text-gray-400">
//                 No problems found.
//               </p>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminProblems;




import { useState } from "react";
import { Loader2, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminProblems = () => {
  const navigate = useNavigate();

  // 🧩 Mock data for now (you can later replace with Redux API data)
  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState([
    {
      _id: "1",
      title: "Two Sum",
      difficulty: "Easy",
      tags: ["Array", "HashMap"],
      creator: { firstName: "John", lastName: "Doe" },
    },
    {
      _id: "2",
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      tags: ["String", "Sliding Window"],
      creator: { firstName: "Jane", lastName: "Smith" },
    },
    {
      _id: "3",
      title: "Merge K Sorted Lists",
      difficulty: "Hard",
      tags: ["LinkedList", "Heap", "Divide and Conquer"],
      creator: { firstName: "Alex", lastName: "Brown" },
    },
  ]);

  const handleDelete = (id) => {
    setProblems((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200 px-4 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
          <h2 className="text-3xl font-bold text-yellow-400 text-center sm:text-left">
            Admin Problem Management
          </h2>
          <button
            onClick={() => navigate("/admin/problem/create")}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-transform hover:scale-105"
          >
            <Plus size={18} /> Create Problem
          </button>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : (
          <div className="overflow-x-auto bg-[#161b22] border border-gray-700 rounded-lg">
            <table className="min-w-full text-left text-sm sm:text-base">
              <thead className="border-b border-gray-700 text-gray-300">
                <tr>
                  <th className="px-4 sm:px-6 py-3">Title</th>
                  <th className="px-4 sm:px-6 py-3">Difficulty</th>
                  <th className="px-4 sm:px-6 py-3">Tags</th>
                  <th className="px-4 sm:px-6 py-3">Creator</th>
                  <th className="px-4 sm:px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-gray-800 hover:bg-gray-800/50 transition"
                  >
                    <td className="px-4 sm:px-6 py-3">{p.title}</td>
                    <td
                      className={`px-4 sm:px-6 py-3 font-semibold ${
                        p.difficulty === "Easy"
                          ? "text-green-400"
                          : p.difficulty === "Medium"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {p.difficulty}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-gray-400">
                      {p.tags.join(", ")}
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      {p.creator.firstName} {p.creator.lastName}
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-right flex justify-end gap-3">
                      <button
                        onClick={() => navigate(`/admin/problem/edit/${p._id}`)}
                        className="text-yellow-400 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="text-red-500 hover:text-red-400 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {problems.length === 0 && (
              <p className="text-center py-6 text-gray-400">
                No problems found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProblems;
