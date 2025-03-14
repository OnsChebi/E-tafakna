"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Save, Globe, Mail, Phone, Briefcase, GraduationCap } from "lucide-react";

export default function ExpertProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Dr. Sarah houissa",
    title: "Senior Legal Consultant",
    bio: "Specializing in corporate law with 12+ years of international experience. Committed to delivering strategic legal solutions for business growth.",
    email: "sarah.h@hotmail.com",
    phone: "50123456",
    location: "Bizert,Tunisia",
    experience: "15 years",
    education: "Tunis Law School,",
    socialLinks: [
      { platform: "LinkedIn", url: "linkedin.com/in/sarahjohnson" },
      { platform: "Twitter", url: "twitter.com/sarah_j_law" }
    ]
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
              <p className="text-xl text-blue-600 dark:text-blue-400 mt-2">
                {profile.title}
              </p>
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
            >
              {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Pencil className="mr-2 h-4 w-4" />}
              {isEditing ? "Save Profile" : "Edit Profile"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Profile Image & Quick Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="relative group">
              <Avatar className="w-48 h-48 mx-auto border-4 border-white dark:border-gray-800 shadow-lg">
                <AvatarImage src="/path-to-avatar.jpg" />
                <AvatarFallback className="text-4xl bg-blue-100 dark:bg-blue-900">
                  SJ
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Pencil className="text-white h-8 w-8" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <ProfileInfoItem
                icon={<Mail className="h-5 w-5" />}
                label="Email"
                value={profile.email}
                isEditing={isEditing}
                onChange={(e: { target: { value: any; }; }) => setProfile({ ...profile, email: e.target.value })}
              />
              <ProfileInfoItem
                icon={<Phone className="h-5 w-5" />}
                label="Phone"
                value={profile.phone}
                isEditing={isEditing}
                onChange={(e: { target: { value: any; }; }) => setProfile({ ...profile, phone: e.target.value })}
              />
              <ProfileInfoItem
                icon={<Globe className="h-5 w-5" />}
                label="Location"
                value={profile.location}
                isEditing={isEditing}
                onChange={(e: { target: { value: any; }; }) => setProfile({ ...profile, location: e.target.value })}
              />
            </div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="md:col-span-2 space-y-8">
            <Section title="Professional Background">
              <ProfileInfoItem
                icon={<Briefcase className="h-5 w-5" />}
                label="Experience"
                value={profile.experience}
                isEditing={isEditing}
                onChange={(e: { target: { value: any; }; }) => setProfile({ ...profile, experience: e.target.value })}
              />
              <ProfileInfoItem
                icon={<GraduationCap className="h-5 w-5" />}
                label="Education"
                value={profile.education}
                isEditing={isEditing}
                onChange={(e: { target: { value: any; }; }) => setProfile({ ...profile, education: e.target.value })}
              />
            </Section>

            <Section title="About Me">
              {isEditing ? (
                <Textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="min-h-[120px]"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {profile.bio}
                </p>
              )}
            </Section>

            <Section title="Social Links">
              <div className="space-y-3">
                {profile.socialLinks.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <Input
                          value={link.platform}
                          onChange={(e) => {
                            const newLinks = [...profile.socialLinks];
                            newLinks[index].platform = e.target.value;
                            setProfile({ ...profile, socialLinks: newLinks });
                          }}
                          className="w-1/3"
                        />
                        <Input
                          value={link.url}
                          onChange={(e) => {
                            const newLinks = [...profile.socialLinks];
                            newLinks[index].url = e.target.value;
                            setProfile({ ...profile, socialLinks: newLinks });
                          }}
                          className="w-2/3"
                        />
                      </>
                    ) : (
                      <>
                        <Globe className="h-4 w-4 text-gray-500" />
                        <a
                          href={link.url}
                          className="text-blue-600 hover:underline dark:text-blue-400"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.platform}
                        </a>
                      </>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setProfile({
                      ...profile,
                      socialLinks: [...profile.socialLinks, { platform: "", url: "" }]
                    })}
                  >
                    Add Social Link
                  </Button>
                )}
              </div>
            </Section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const ProfileInfoItem = ({ icon, label, value, isEditing, onChange }) => (
  <div className="flex items-center gap-4">
    <span className="text-blue-600 dark:text-blue-400">{icon}</span>
    <div className="flex-1">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      {isEditing ? (
        <Input
          value={value}
          onChange={onChange}
          className="border-none p-0 h-auto focus-visible:ring-0"
        />
      ) : (
        <p className="text-gray-900 dark:text-gray-100">{value}</p>
      )}
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold text-gray-800 dark:text-white border-b pb-2">
      {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);