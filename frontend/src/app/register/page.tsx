"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { expertApi } from "../service/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle, FiCheckCircle, FiUserPlus, FiEye, FiEyeOff, FiInfo } from "react-icons/fi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    accessToken: "",
    role: "expert",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (password.match(/[A-Z]/)) strength += 1;
    if (password.match(/[0-9]/)) strength += 1;
    if (password.match(/[^A-Za-z0-9]/)) strength += 1;
    return strength;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      const response = await expertApi.register(formData);
      if (response.data.success) {
        setSuccess("User created successfully!");
        setTimeout(() => router.push("/users"), 2000);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Registration failed. Please check your access token."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8"
        style={{ boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)" }}
      >
        {/* Header Section */}
        <div className="mb-8 text-center">
          <FiUserPlus className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New User
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Add new users to the system with specific roles and permissions
          </p>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-4 mb-6 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg"
            >
              <FiAlertCircle className="flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-4 mb-6 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-lg"
            >
              <FiCheckCircle className="flex-shrink-0" />
              <span className="text-sm">{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="User Name"
                  className="pl-4 pr-10 py-3 text-base rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
                {formData.name && (
                  <FiCheckCircle className="absolute right-3 top-3.5 h-5 w-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="user@example.com"
                  className="pl-4 pr-10 py-3 text-base rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
                {formData.email && (
                  <FiCheckCircle className="absolute right-3 top-3.5 h-5 w-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-4 pr-12 py-3 text-base rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-blue-500"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 w-full rounded-full ${i < passwordStrength ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    {strengthLabels[passwordStrength] || ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Access Token Field */}
            <div className="space-y-2">
  <div className="flex items-center gap-2">
    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
      Access Token <span className="text-red-500">*</span>
    </Label>
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <FiInfo className="text-gray-400 hover:text-blue-500 cursor-help" />
        </TooltipTrigger>
        <TooltipContent className="max-w-[240px] p-3 text-sm bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900">
          <p>Unique authentication token provided by your system administrator</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
  <div className="relative">
    <Input
      name="accessToken"
      value={formData.accessToken}
      onChange={handleChange}
      placeholder="Enter security token"
      className="pl-4 pr-10 py-3 text-base rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
    />
    {formData.accessToken && (
      <FiCheckCircle className="absolute right-3 top-3.5 h-5 w-5 text-green-500" />
    )}
  </div>
</div>

            {/* Role Selection */}
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                User Role <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="py-3 text-base rounded-lg border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-gray-300 dark:border-gray-600">
                  <SelectItem value="expert" className="py-3">
                    <div className="space-y-1">
                      <div className="font-medium">Expert</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Can access assigned projects and submit reports
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="admin" className="py-3">
                    <div className="space-y-1">
                      <div className="font-medium">Admin</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Full system access with user management privileges
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              className="w-full py-3 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating User...
                </div>
              ) : (
                "Create User Account"
              )}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}