"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { expertApi } from "../service/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiUserPlus,
  FiEye,
  FiEyeOff,
  FiInfo,
  FiX,
} from "react-icons/fi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function RegisterPopup({ onClose }: { onClose: () => void }) {
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        onClose();
        router.refresh();
      }, 2000); // wait 2 seconds before closing
      return () => clearTimeout(timer);
    }
  }, [showSuccess, onClose, router]);

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") setPasswordStrength(calculatePasswordStrength(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setShowSuccess(false);
    setShowError(false);

    const { name, email, password, accessToken, role } = formData;

    if (!name || !email || !password || !role || (role === "expert" && !accessToken)) {
      setError("Please fill in all required fields.");
      setShowError(true);
      return;
    }

    try {
      setLoading(true);
      const response = await expertApi.register(formData);
      setSuccess("User created successfully!");
      setShowSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed.");
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.password &&
    formData.role &&
    (formData.role !== "expert" || formData.accessToken);

  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
        >
          <FiX size={24} />
        </button>

        <div className="mb-8 text-center">
          <FiUserPlus className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New User</h1>
        </div>

        <AnimatePresence>
          {(error && showError) && (
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
          {(success && showSuccess) && (
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <Label>Full Name <span className="text-red-500">*</span></Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="User Name"
              />
            </div>

            {/* Email */}
            <div>
              <Label>Email <span className="text-red-500">*</span></Label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <Label>Password <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-gray-400 hover:text-blue-500"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex gap-1 flex-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-full rounded-full ${
                        i < passwordStrength
                          ? "bg-blue-500"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  {strengthLabels[passwordStrength] || ""}
                </span>
              </div>
            </div>

            {/* Access Token */}
            <div>
              <div className="flex items-center gap-2">
                <Label>
                  Access Token {formData.role === "expert" && <span className="text-red-500">*</span>}
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FiInfo className="text-gray-400 hover:text-blue-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="text-sm bg-gray-800 text-white">
                      Calendly token for expert account
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                name="accessToken"
                value={formData.accessToken}
                onChange={handleChange}
                placeholder="Enter security token"
              />
            </div>

            {/* Role */}
            <div className="md:col-span-2">
              <Label>User Role <span className="text-red-500">*</span></Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="expert">Expert</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={!isFormValid || loading} 
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 transition-colors duration-200"
          >
            {loading ? "Creating..." : "Create User"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
