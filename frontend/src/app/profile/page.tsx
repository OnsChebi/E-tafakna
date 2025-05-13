"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { expertApi } from "../service/api";

const ProfilePage = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await expertApi.getProfile();
        setName(data.name || "");
        setBio(data.bio || "");
        setPreviewImage(data.profileImage); // Set the image URL received from the API
      } catch (error) {
        toast({ title: "Error", description: "Failed to load profile." });
      }
    };
    fetchProfile();
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

      // Refresh the preview if a new image was uploaded
      if (profileImage) {
        setPreviewImage(URL.createObjectURL(profileImage));
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Update failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <motion.div
        className="w-full max-w-xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-xl rounded-2xl p-6 bg-white">
          <CardContent>
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
              Update Profile
            </h2>

            <div className="space-y-4">
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
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <Label htmlFor="profileImage">Profile Image</Label>
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProfileImage(file);
                      setPreviewImage(URL.createObjectURL(file)); // Display selected image
                    }
                  }}
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="mt-2 w-32 h-32 object-cover rounded-full border"
                  />
                )}
              </div>

              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
