import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Activity, UserCircle, ClipboardList, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function Layout() {
  const { signOut } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <Activity className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Healthy Souls</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/dashboard" className="inline-flex items-center px-1 pt-1 text-gray-900">
                  Dashboard
                </Link>
                <Link to="/records" className="inline-flex items-center px-1 pt-1 text-gray-900">
                  Patient Records
                </Link>
                <Link to="/symptoms" className="inline-flex items-center px-1 pt-1 text-gray-900">
                  Symptom Checker
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => signOut()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}