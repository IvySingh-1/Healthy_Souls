import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Stethoscope, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

export function Login() {
  const navigate = useNavigate();
  const { signIn, signUp, error: authError, clearError } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'doctor' | 'patient' | null>(null);
  const [aadharNumber, setAadharNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      clearError();
      setError(null);
    };
  }, [clearError]);

  useEffect(() => {
    clearError();
    setError(null);
  }, [isLogin, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (userType === 'doctor') {
        if (isLogin) {
          await signIn(email, password);
        } else {
          await signUp(email, password);
        }
        navigate('/dashboard');
      } else if (userType === 'patient') {
        try {
          // For patients, first check if the patient exists
          const { data: existingPatient, error: checkError } = await supabase
            .from('patients')
            .select('aadhar_number')
            .eq('aadhar_number', aadharNumber)
            .maybeSingle();

          if (checkError) {
            throw new Error('Error checking patient record');
          }

          if (isLogin && !existingPatient) {
            throw new Error('Patient not found. Please sign up first.');
          }

          if (!isLogin) {
            if (existingPatient) {
              throw new Error('Patient already exists. Please login instead.');
            }

            // Create new patient
            const { error: createError } = await supabase
              .from('patients')
              .insert([{ aadhar_number: aadharNumber }]);

            if (createError) {
              throw new Error('Failed to create patient record. Please try again.');
            }
          }

          // Store patient info and redirect
          localStorage.setItem('patientAadhar', aadharNumber);
          navigate('/patient-dashboard');
        } catch (err: any) {
          throw new Error(err.message);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setAadharNumber('');
    setError(null);
  };

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Activity className="h-12 w-12 text-blue-400" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Welcome to Healthy Souls
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Choose your portal to continue
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setUserType('doctor')}
              className="w-1/2 flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 hover:bg-white/20 transition-all"
            >
              <Stethoscope className="h-12 w-12 text-blue-400 mb-4" />
              <span className="text-lg font-medium text-white">Doctor Portal</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setUserType('patient')}
              className="w-1/2 flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 hover:bg-white/20 transition-all"
            >
              <User className="h-12 w-12 text-purple-400 mb-4" />
              <span className="text-lg font-medium text-white">Patient Portal</span>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={() => setUserType(null)}
          className="absolute top-4 left-4 text-white hover:text-blue-400 transition-colors"
        >
          ← Back
        </button>
        <div className="flex justify-center">
          {userType === 'doctor' ? (
            <Stethoscope className="h-12 w-12 text-blue-400" />
          ) : (
            <User className="h-12 w-12 text-purple-400" />
          )}
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-300">
          {userType === 'doctor' ? 'Doctor Portal' : 'Patient Portal'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/10 backdrop-blur-lg py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {(error || authError) && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded relative">
                <span className="block sm:inline">{error || authError}</span>
                <button
                  type="button"
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  onClick={() => {
                    clearError();
                    setError(null);
                  }}
                >
                  <span className="sr-only">Dismiss</span>
                  <span className="text-xl">&times;</span>
                </button>
              </div>
            )}

            {userType === 'doctor' ? (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md shadow-sm py-2 px-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md shadow-sm py-2 px-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </>
            ) : (
              <div>
                <label htmlFor="aadhar" className="block text-sm font-medium text-white">
                  Aadhar Number
                </label>
                <input
                  id="aadhar"
                  type="text"
                  required
                  value={aadharNumber}
                  onChange={(e) => setAadharNumber(e.target.value)}
                  className="mt-1 block w-full bg-white/5 border border-white/10 rounded-md shadow-sm py-2 px-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your 12-digit Aadhar number"
                />
              </div>
            )}

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  userType === 'doctor'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-purple-600 hover:bg-purple-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50`}
              >
                {loading ? 'Loading...' : (isLogin ? 'Sign in' : 'Sign up')}
              </motion.button>
            </div>
          </form>

          <div className="mt-6">
            <button
              onClick={toggleMode}
              className="w-full text-center text-sm text-blue-400 hover:text-blue-300"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}