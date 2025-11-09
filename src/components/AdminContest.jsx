import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter } from "lucide-react";
import ContestCard from "./create_contest/ContestCard";

const AdminContest = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [contests, setContests] = useState([
    {
      _id: "1",
      title: "Graph Theory Cup",
      description: "Solve challenging graph problems.",
      startTime: "2025-11-10T10:00:00",
      endTime: "2025-11-10T12:00:00",
      status: "upcoming",
      totalProblems: 5,
      totalUsers: 20,
    },
    {
      _id: "2",
      title: "Binary Search Battle",
      description: "All about midpoints and intervals.",
      startTime: "2025-11-05T17:00:00",
      endTime: "2025-11-05T19:00:00",
      status: "finished",
      totalProblems: 4,
      totalUsers: 35,
    },
    {
      _id: "3",
      title: "Dynamic Programming League",
      description: "Advanced DP problems with edge cases.",
      startTime: "2025-11-08T14:00:00",
      endTime: "2025-11-08T17:00:00",
      status: "ongoing",
      totalProblems: 6,
      totalUsers: 45,
    },
  ]);

  const handleDelete = (id) => {
    setContests((prev) => prev.filter((c) => c._id !== id));
  };

  // ✅ Filtering logic
  const filteredContests = useMemo(() => {
    return contests.filter((contest) => {
      const matchSearch = contest.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === "all" ? true : contest.status === statusFilter;

      const now = new Date();
      const matchDate =
        dateFilter === "all"
          ? true
          : dateFilter === "past"
          ? new Date(contest.endTime) < now
          : dateFilter === "upcoming"
          ? new Date(contest.startTime) > now
          : dateFilter === "ongoing"
          ? now >= new Date(contest.startTime) &&
            now <= new Date(contest.endTime)
          : true;

      return matchSearch && matchStatus && matchDate;
    });
  }, [searchTerm, statusFilter, dateFilter, contests]);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white px-4 sm:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl sm:text-3xl font-bold text-yellow-400"
        >
          Contest Management
        </motion.h2>

        {/* Search bar */}
        <div className="flex items-center bg-[#1e1e1e] border border-gray-700 rounded-lg px-3 py-2 w-full sm:w-80">
          <Search className="text-gray-400 w-4 h-4 mr-2" />
          <input
            type="text"
            placeholder="Search contests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent w-full focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex items-center gap-2 bg-[#1e1e1e] border border-gray-700 px-3 py-2 rounded-lg">
          <Filter size={16} className="text-gray-400" />
          <span className="text-sm text-gray-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-sm outline-none cursor-pointer"
          >
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="finished">Finished</option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-[#1e1e1e] border border-gray-700 px-3 py-2 rounded-lg">
          <Filter size={16} className="text-gray-400" />
          <span className="text-sm text-gray-400">Date:</span>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-transparent text-sm outline-none cursor-pointer"
          >
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="past">Past</option>
          </select>
        </div>
      </div>

      {/* Contest Cards Grid */}
      <AnimatePresence>
        {filteredContests.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-400 text-center"
          >
            No contests found.
          </motion.p>
        ) : (
          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredContests.map((contest) => (
              <motion.div
                key={contest._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ContestCard contest={contest} onDelete={handleDelete} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminContest;
