// "use client";

// import {  CardContent,  } from "@/components/ui/card";

// interface ActivityItem {
//   icon: React.ReactNode;
//   title: string;
//   time: string;
// }

// interface RecentActivityProps {
//   activities: ActivityItem[];
// }

// export const RecentActivity = ({ activities }: RecentActivityProps) => (
//   <div className="p-6">
//       <h2 className="text-lg dark:text-gray-100 font-semibold mb-7">Recent Activity</h2>
    
//     <CardContent>
//       <div className="space-y-4 dark:text-gray-100">
//         {activities.map((activity, index) => (
//           <ActivityItem key={index} {...activity} />
//         ))}
//       </div>
//     </CardContent>
//   </div>
// );