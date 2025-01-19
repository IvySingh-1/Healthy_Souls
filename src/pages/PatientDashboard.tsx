import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Calendar,
  Clock,
  FileText,
  LogOut,
  Settings,
  User,
  Bell,
  BarChart2,
  PieChart,
} from 'lucide-react';
import { Line, Pie } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function PatientDashboard() {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const aadharNumber = localStorage.getItem('patientAadhar');
    if (!aadharNumber) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const { data: patient } = await supabase
          .from('patients')
          .select('*')
          .eq('aadhar_number', aadharNumber)
          .single();

        const { data: medicalRecords } = await supabase
          .from('medical_records')
          .select('*')
          .eq('aadhar_number', aadharNumber)
          .order('treatment_date', { ascending: false });

        setPatientData(patient);
        setRecords(medicalRecords || []);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('patientAadhar');
    navigate('/login');
  };

  // Chart data
  const symptomsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Health Score',
        data: [85, 82, 88, 87, 84, 90],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const visitTypeData = {
    labels: ['Check-ups', 'Follow-ups', 'Emergencies', 'Consultations'],
    datasets: [
      {
        data: [4, 3, 1, 2],
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(16, 185, 129, 0.8)',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Interactive Mouse Follower */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30 mix-blend-color-dodge"
        animate={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.15), transparent 80%)`,
        }}
      />

      {/* Navigation Bar */}
      <nav className="relative z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-purple-400 mr-2" />
              <span className="text-xl font-bold text-white">Patient Portal</span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 text-gray-300 hover:text-purple-400 transition-colors"
                >
                  <Bell className="h-6 w-6" />
                </motion.button>
              </div>

              {/* Settings */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-gray-300 hover:text-purple-400 transition-colors"
              >
                <Settings className="h-6 w-6" />
              </motion.button>

              {/* Sign Out */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="flex items-center px-4 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold text-white flex items-center gap-3"
          >
            <User className="h-10 w-10 text-purple-400" />
            Welcome Back
          </motion.h1>
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { name: 'Total Visits', value: records.length, icon: FileText, color: 'from-purple-600 to-purple-400' },
            { name: 'Next Appointment', value: 'Tomorrow', icon: Calendar, color: 'from-blue-600 to-blue-400' },
            { name: 'Health Score', value: '90%', icon: Activity, color: 'from-green-600 to-green-400' },
            { name: 'Medications', value: '2 Active', icon: Clock, color: 'from-pink-600 to-pink-400' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={stat.name}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-purple-200 mt-1">{stat.name}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-purple-400" />
              Health Trend
            </h2>
            <Line data={symptomsData} options={chartOptions} />
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
            <Pie data={visitTypeData} options={chartOptions} />
          </motion.div>
        </div>

        {/* Recent Medical Records */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-400" />
            Recent Medical Records
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {records.slice(0, 6).map((record, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={record.id}
                className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-lg hover:bg-white/10 transition-colors"
              >
                <div className="space-y-4">
                  <div className="text-lg font-semibold text-white">
                    {new Date(record.treatment_date).toLocaleDateString()}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white/70 mb-2">Symptoms</h4>
                    <div className="flex flex-wrap gap-2">
                      {record.symptoms.map((symptom: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-purple-500/20 rounded-full text-xs font-medium text-purple-200"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white/70 mb-1">Prescription</h4>
                    <p className="text-sm text-white/90 whitespace-pre-line">{record.prescription}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
