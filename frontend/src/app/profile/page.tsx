"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { expertApi, stat } from "../service/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, ImagePlus } from "lucide-react";

interface CalendlyStats {
  totalClients: number;
  todaysMeetings: number;
  upcomingMeetings: number;
  weeklyMeetings: any[];
  meetingTypes: any[];
  activeFolder: number;
}

const ProfilePage = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState<CalendlyStats | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await expertApi.getProfile();
        setName(data.name || "");
        setBio(data.bio || "");
        setPreviewImage(data.profileImage);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load profile." });
      }
    };

    const fetchStats = async () => {
      try {
        const { data } = await stat.getStat();
        setStats(data);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load stats." });
      }
    };

    fetchProfile();
    fetchStats();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (profileImage) formData.append("profileImage", profileImage);

    try {
      await expertApi.updateProfile(formData);
      toast({ title: "Success", description: "Profile updated successfully." });
      if (profileImage) {
        setPreviewImage(URL.createObjectURL(profileImage));
      }
      setIsEditing(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Update failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 p-4">
      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="shadow-2xl rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-8">
            <motion.div
              className="flex flex-col md:flex-row items-center gap-8 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-purple-100 shadow-lg">
                  <AvatarImage src={previewImage || ""} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-2xl text-white">
                    {name[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <Label
                  htmlFor="profileImage"
                  className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <ImagePlus className="w-8 h-8 text-white" />
                </Label>
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProfileImage(file);
                      setPreviewImage(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>

              <div className="flex-1 space-y-4 text-center md:text-left">
                <motion.div
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
                  <div className="flex gap-2 justify-center md:justify-start mt-2">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      Clients: {stats?.totalClients ?? "Loading..."}
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                      ★ 4.9
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                      🕒 30 min
                    </Badge>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-4 justify-center md:justify-start"
                >
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    className="rounded-full px-6 py-3 shadow-lg transition-transform hover:scale-105"
                    variant={isEditing ? "secondary" : "default"}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {isEditing && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate();
                }}
                className="space-y-6 mt-6"
              >
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" >
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
