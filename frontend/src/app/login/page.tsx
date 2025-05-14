'use client';
import { useState,FormEvent,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, User, ArrowRight} from 'lucide-react';
import api from '../service/api';

export default function LoginPage() {
    const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

useEffect(()=>{
  const token=localStorage.getItem('authToken');
  if(token){
    router.push('/meetings');
    }
},[router]);

  const handleSubmit = async(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();// Prevent default form submission
    setIsLoading(true);

    try{

    const response = await api.post('/expert/login',{
    email:credentials.email,
    password:credentials.password
    });
    if (response.status==200){
        setIsLoading(false);
        localStorage.setItem('authToken',response.data.token);//store token
        router.push('/meetings');
    }

    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed';
  if (msg.includes('Email')) {
    setErrors({ email: msg });
  } else if (msg.includes('password') || msg.includes('Password')) {
    setErrors({ password: msg });
  } else {
    setErrors({ general: msg });
  }
//bch y5tafi msg
  setTimeout(() => setErrors({}), 4000);
} finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* 3D Model Section */}
      <div className="w-1/2 relative bg-gradient-to-l from-gray-400 to-white  ">
  {/* Calendar Grid */}
  <svg 
    viewBox="0 0 500 500" 
    className="absolute inset-0 w-full h-full opacity-20"
  >
    <rect x="50" y="80" width="400" height="340" rx="15" fill="currentColor" className="text-white/10"/>
    {/* Calendar Days */}
    {Array.from({ length: 24 }).map((_, i) => (
      <rect 
        key={i}
        x={50 + (i % 6) * 66} 
        y={100 + Math.floor(i / 6) * 60} 
        width="50" 
        height="40" 
        rx="5"
        className="text-white/5 hover:text-white/20 transition-colors cursor-pointer"
      />
    ))}
  </svg>

  {/* Floating Meeting Elements */}
  <motion.div 
    className="absolute top-1/4 left-1/4 w-48"
    animate={{ y: [-5, 5, -5] }}
    transition={{ duration: 4, repeat: Infinity }}
  >
    <svg viewBox="0 0 100 100" className="text-gray-900">
      {/* Calendar */}
      <rect x="10" y="10" width="80" height="80" rx="10" fill="none" stroke="currentColor" strokeWidth="2"/>
      <text x="50" y="35" textAnchor="middle" fontSize="20" fill="currentColor">15</text>
      <text x="50" y="60" textAnchor="middle" fontSize="14" fill="currentColor">Meetings</text>
      
      {/* Clock Overlay */}
      <circle cx="75" cy="25" r="8" fill="#3B82F6" stroke="black" strokeWidth="1"/>
      <path d="M75 25v3" stroke="black" strokeWidth="1"/>
      <path d="M75 25h3" stroke="black" strokeWidth="1"/>
    </svg>
  </motion.div>

  {/* Timeline with Meetings */}
  <div className="absolute top-1/2 left-1/3 w-1/2">
    <div className="relative h-1 bg-black/30">
      {/* Meeting Markers */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute -top-2 w-4 h-4 bg-black rounded-full shadow-lg"
          style={{ left: `${30 + i * 30}%` }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ delay: i * 0.5, repeat: Infinity, duration: 3 }}
        />
      ))}
    </div>
  </div>

  {/* Animated Checkmarks */}
  <motion.div 
    className="absolute bottom-1/4 right-1/4 w-16"
    animate={{ rotate: [0, 10, -10, 0] }}
    transition={{ duration: 6, repeat: Infinity }}
  >
    <svg viewBox="0 0 100 100" className="text-white">
      <path 
        d="M20 50 L40 70 L80 30" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="8" 
        strokeLinecap="round"
      />
    </svg>
  </motion.div>

  {/* Floating Participants */}
  <div className="absolute bottom-1/3 right-1/3 flex space-x-2">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-8 h-8 bg-black rounded-full shadow-lg"
        animate={{ y: [0, -15, 0] }}
        transition={{ delay: i * 0.3, duration: 4, repeat: Infinity }}
      />
    ))}
  </div>

  {/* Connecting Lines */}
  <svg className="absolute inset-0 w-full h-full">
    <path 
      d="M200,300 Q250,250 300,300" 
      stroke="white" 
      strokeWidth="1" 
      fill="none"
      strokeDasharray="4 4"
    />
    <path 
      d="M300,200 Q350,250 400,200" 
      stroke="white" 
      strokeWidth="1" 
      fill="none"
      strokeDasharray="4 4"
    />
  </svg>
</div>

      {/* Illustration & Form Section */}
      <div className="w-1/2 flex flex-col items-center justify-center bg-gradient-to-l from-indigo-600 to-gray-400 relative">
        {/* Interactive Background Elements */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 overflow-hidden"
        >
          <svg viewBox="0 0 500 500" className="w-full h-full opacity-10 dark:opacity-5">
            <path
              d="M250,100 C300,50 400,150 350,200 C300,250 200,300 250,350 C300,400 400,350 350,300"
              stroke="#3b82f6"
              fill="none"
              strokeWidth="2"
            />
          </svg>
        </motion.div>

        {/* Main Form Container */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full max-w-md px-12 relative z-10"
        >
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-800 to-black bg-clip-text text-transparent">
              Welcom To E-tafakna
            </h2>
            <p className="text-gray-200 ">
              Your All-in-One Solution
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
  {/* Email Input */}
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="group relative"
  >
    <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" />
    <input
      type="email"
      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 border border-indigo-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      placeholder="Email..."
      value={credentials.email}
      onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
      required
    />
    {/* Email Error Message */}
    {errors.email && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-[#e20260] text-sm mt-1 ml-2 font-medium flex items-center gap-1"
  >
    {errors.email}
  </motion.div>
)}

  </motion.div>

  {/* Password Input */}
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="group relative"
  >
    <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" />
    <input
      type={showPassword ? 'text' : 'password'}
      className="w-full pl-12 pr-12 py-3 rounded-xl bg-gray-100 border border-indigo-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      value={credentials.password}
      placeholder="Password..."
      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
      required
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
    >
      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>
    {/* Password Error Message */}
    {errors.password && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-[#e20260] text-sm mt-1 ml-2 font-medium flex items-center gap-1"
    >
    {errors.password}
  </motion.div>
)}

  </motion.div>

  {/* General Error Message */}
  <AnimatePresence>
  {errors.general && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-[#e20260] text-sm mt-1 ml-2 font-medium flex items-center gap-1"
    >
    {errors.general}
  </motion.div>
)}

  </AnimatePresence>
            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Verifying Credentials...
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <ArrowRight className="w-5 h-5" />
                    Login
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}