import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";

const ContestCard = ({ contest, onDelete }) => {
 
  const statusColor =
    contest.status === "upcoming"
      ? "text-blue-400"
      : contest.status === "ongoing"
      ? "text-green-400"
      : "text-red-400";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className='bg-[#1e1e1e] rounded-xl p-5 shadow-lg border border-gray-800 hover:border-yellow-400 transition'
    >
      <div className='flex justify-between items-start mb-2'>
        <h3 className='text-lg font-semibold text-white'>{contest.title}</h3>
        <span className={`text-xs font-medium ${statusColor}`}>
          {contest?.status}
        </span>
      </div>
      <p className='text-gray-400 text-sm mb-3'>{contest?.description}</p>
      <p className='text-xs text-gray-500 mb-2'>
        Start: {contest?.startTime} <br />
        End: {contest?.endTime}
      </p>

      <div className='flex justify-between text-sm text-gray-400'>
        <span>Problems: {contest?.totalProblems}</span>
        <span>Users: {contest?.totalUsers}</span>
      </div>

      <div className='flex gap-3 mt-4'>
        <Link
          to={`/edit/${contest._id}`}
          className='flex items-center gap-1 bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1 rounded-md text-sm font-semibold transition'
        >
          <Edit size={14} /> Edit
        </Link>
        <button
          onClick={() => onDelete(contest._id)}
          className='flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold transition'
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </motion.div>
  );
};

export default ContestCard;
