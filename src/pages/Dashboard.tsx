import React from 'react';
import { Activity, Users, FileText, Brain, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const stats = [
    { name: 'Total Patients', value: '124', icon: Users, trend: '+12% this month' },
    { name: 'Medical Records', value: '1,432', icon: FileText, trend: '+8% this month' },
    { name: 'Symptom Checks', value: '326', icon: Brain, trend: '+15% this month' },
  ];

  const recentActivity = [
    { id: 1, type: 'New Patient', name: 'Ram Kumar', time: '2 hours ago', aadhar: '22' },
    { id: 2, type: 'Medical Record', name: 'Ram Kumar', time: '2 hours ago', description: 'Added new symptoms' },
    { id: 3, type: 'Symptom Check', name: 'Ram Kumar', time: '2 hours ago', symptoms: ['Fever', 'Cough'] },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <Activity className="h-10 w-10 text-blue-400" />
            Healthcare Dashboard
          </h1>
          <div className="text-sm text-blue-300">Last updated: {new Date().toLocaleTimeString()}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                    <Icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="flex items-center text-green-400 text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {stat.trend}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-blue-300 mt-1">{stat.name}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    {activity.type === 'New Patient' && <Users className="h-5 w-5 text-blue-400" />}
                    {activity.type === 'Medical Record' && <FileText className="h-5 w-5 text-blue-400" />}
                    {activity.type === 'Symptom Check' && <Brain className="h-5 w-5 text-blue-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{activity.name}</div>
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
                          <span key={idx} className="px-2 py-1 bg-blue-500/20 rounded-full text-xs">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300">
                <Users className="h-6 w-6 mb-2" />
                <div className="font-medium">New Patient</div>
              </button>
              <button className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300">
                <FileText className="h-6 w-6 mb-2" />
                <div className="font-medium">Add Record</div>
              </button>
              <button className="p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300">
                <Brain className="h-6 w-6 mb-2" />
                <div className="font-medium">Check Symptoms</div>
              </button>
              <button className="p-4 bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-xl hover:from-cyan-700 hover:to-cyan-800 transition-all duration-300">
                <Activity className="h-6 w-6 mb-2" />
                <div className="font-medium">Analytics</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}