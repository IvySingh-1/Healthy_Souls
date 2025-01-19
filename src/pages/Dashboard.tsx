import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Users,
  FileText,
  Brain,
  TrendingUp,
  Calendar,
  Clock,
  AlertCircle,
  ChevronRight,
  BarChart2,
  PieChart,
} from 'lucide-react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function Dashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');

  const stats = [
    { name: 'Total Patients', value: '124', icon: Users, trend: '+12% this month', color: 'from-blue-600 to-blue-400' },
    { name: 'Medical Records', value: '1,432', icon: FileText, trend: '+8% this month', color: 'from-purple-600 to-purple-400' },
    { name: 'Symptom Checks', value: '326', icon: Brain, trend: '+15% this month', color: 'from-indigo-600 to-indigo-400' },
    { name: 'Active Cases', value: '48', icon: Activity, trend: '+5% this month', color: 'from-cyan-600 to-cyan-400' },
  ];

  const recentActivity = [
    { id: 1, type: 'New Patient', name: 'Ram Kumar', time: '2 hours ago', aadhar: '22' },
    { id: 2, type: 'Medical Record', name: 'Ram Kumar', time: '2 hours ago', description: 'Added new symptoms' },
    { id: 3, type: 'Symptom Check', name: 'Ram Kumar', time: '2 hours ago', symptoms: ['Fever', 'Cough'] },
  ];

  const appointments = [
    { id: 1, patient: 'John Doe', time: '10:00 AM', type: 'Check-up' },
    { id: 2, patient: 'Jane Smith', time: '11:30 AM', type: 'Follow-up' },
    { id: 3, patient: 'Mike Johnson', time: '2:00 PM', type: 'Consultation' },
  ];

  // Line Chart Data
  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Patient Visits',
        data: [12, 19, 15, 17, 14, 13, 18],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.4,
      },
    ],
  };

  // Pie Chart Data
  const pieChartData = {
    labels: ['Check-ups', 'Follow-ups', 'Emergencies', 'Consultations'],
    datasets: [
      {
        data: [35, 25, 15, 25],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(45, 212, 191, 0.8)',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold tracking-tight flex items-center gap-3 text-white"
        >
          <Activity className="h-10 w-10 text-blue-400" />
          Healthcare Dashboard
        </motion.h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <div className="text-sm text-blue-300">Last updated: {new Date().toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={stat.name}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stat.trend}
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-blue-300 mt-1">{stat.name}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-blue-400" />
            Patient Visits Trend
          </h2>
          <Line data={lineChartData} options={chartOptions} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
            <PieChart className="h-5 w-5 text-purple-400" />
            Visit Distribution
          </h2>
          <Pie data={pieChartData} options={pieChartOptions} />
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <h2 className="text-xl font-semibold mb-4 text-white">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  {activity.type === 'New Patient' && <Users className="h-5 w-5 text-white" />}
                  {activity.type === 'Medical Record' && <FileText className="h-5 w-5 text-white" />}
                  {activity.type === 'Symptom Check' && <Brain className="h-5 w-5 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-white">{activity.name}</div>
                      <div className="text-sm text-blue-300">{activity.type}</div>
                    </div>
                    <div className="text-sm text-blue-300">{activity.time}</div>
                  </div>
                  {activity.description && (
                    <div className="text-sm mt-1 text-white/70">{activity.description}</div>
                  )}
                  {activity.symptoms && (
                    <div className="flex gap-2 mt-2">
                      {activity.symptoms.map((symptom, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-500/20 rounded-full text-xs text-white"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Today's Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
        >
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-400" />
            Today's Appointments
          </h2>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-white">{appointment.patient}</div>
                      <div className="text-sm text-purple-300">{appointment.type}</div>
                    </div>
                    <div className="text-sm font-medium text-white">{appointment.time}</div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}