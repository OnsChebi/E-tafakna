// "use client";

// import { useState } from "react";
// import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Users, Video, TrendingUp } from "lucide-react";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, BarChart, Bar } from "recharts";

// export default function StatisticsDashboard() {
//   const [timePeriod, setTimePeriod] = useState("monthly");

//   const clientData = {
//     monthly: [120, 59, 80, 81, 56, 55, 40],
//     yearly: [400, 300, 700, 850, 600, 450, 800, 900, 750, 850, 900, 950],
//   };

//   const meetingData = {
//     monthly: [12, 15, 8, 20, 18, 14, 10],
//     yearly: [120, 150, 130, 170, 160, 140, 180, 190, 170, 160, 180, 200],
//   };

//   const caseDistribution = [
//     { name: "Civil", value: 400, fill: "#A78BFA" }, // Pastel Purple
//     { name: "Criminal", value: 300, fill: "#FBCFE8" }, // Pastel Pink
//     { name: "Family", value: 300, fill: "#93C5FD" }, // Pastel Blue
//     { name: "Corporate", value: 200, fill: "#6EE7B7" }, // Pastel Green
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 pt-1">
//       {/* Key Metrics Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-3">
//         <MetricCard
//           title="Total Clients"
//           value="1,234"
//           icon={<Users className="h-6 w-6" />}
//           trend={18.2}
//         />
//         <MetricCard
//           title="Monthly Clients"
//           value="156"
//           icon={<TrendingUp className="h-6 w-6" />}
//           trend={4.5}
//         />
//         <MetricCard
//           title="Online Meetings"
//           value="89"
//           icon={<Video className="h-6 w-6" />}
//           trend={-2.1}
//         />
//       </div>

//       {/* Main Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Client Acquisition Chart */}
//         <Card className="hover:shadow-lg transition-shadow">
//           <CardHeader>
//             <div className="flex justify-between items-center">
//               <CardTitle className="text-lg font-semibold">
//                 Client Acquisition
//               </CardTitle>
//               <div className="flex gap-2">
//                 {["weekly", "monthly"].map((period) => (
//                   <Button
//                     key={period}
//                     variant={timePeriod === period ? "default" : "outline"}
//                     onClick={() => setTimePeriod(period)}
//                     className="capitalize"
//                   >
//                     {period}
//                   </Button>
//                 ))}
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent className="h-80">
//             <LineChart
//               width={550}
//               height={300}
//               data={
//                 timePeriod === "monthly"
//                   ? clientData.yearly.map((value, index) => ({
//                       name: new Date(0, index).toLocaleString("default", {
//                         month: "short",
//                       }),
//                       value,
//                     }))
//                   : clientData.monthly.map((value, index) => ({
//                       name: `Week ${index + 1}`,
//                       value,
//                     }))
//               }
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Line
//                 type="monotone"
//                 dataKey="value"
//                 stroke="#3B72F6"
//               />
//             </LineChart>
//           </CardContent>
//         </Card>

//         {/* Case Type Distribution Chart */}
//         <Card className="hover:shadow-lg transition-shadow">
//           <CardHeader>
//             <CardTitle className="text-lg font-semibold">
//               Case Type Distribution
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="h-80 flex justify-center">
//             <PieChart width={400} height={300}>
//               <Pie
//                 data={caseDistribution}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={100}
//                 innerRadius={40}              >
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Additional Statistics Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
//         {/* Meeting Frequency Chart */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-lg font-semibold">
//               Meeting Frequency
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="flex justify-center">
//             <BarChart
//               width={500}
//               height={300}
//               data={
//                 timePeriod === "monthly"
//                   ? meetingData.monthly.map((value, index) => ({
//                       name: `Week ${index + 1}`,
//                       value,
//                     }))
//                   : meetingData.yearly.map((value, index) => ({
//                       name: new Date(0, index).toLocaleString("default", {
//                         month: "short",
//                       }),
//                       value,
//                     }))
//               }
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="value" fill="#93C5FD" />
//             </BarChart>
//           </CardContent>
//         </Card>

//         {/* Stat Badges */}
//         {/* <div className="space-y-6">
//           <StatBadge title="Active Cases" value="89" trend={2.4} />
//           <StatBadge title="Client Satisfaction" value="94%" trend={1.8} />
//           <StatBadge title="Revenue Growth" value="22.5%" trend={4.6} />
//         </div> */}
//       </div>
//     </div>
//   );
// }

// // MetricCard Component
// const MetricCard = ({ title, value, icon, trend }: MetricCardProps) => (
//   <Card className="hover:shadow-lg transition-shadow group">
//     <CardContent className="p-6">
//       <div className="flex justify-between items-start">
//         <div>
//           <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{title}</p>
//           <div className="flex items-end gap-2">
//             <span className="text-3xl font-bold text-gray-900 dark:text-white">
//               {value}
//             </span>
//             <span
//               className={`flex items-center text-sm ${
//                 trend > 0 ? "text-green-500" : "text-red-500"
//               }`}
//             >
//               {trend > 0 ? "+" : ""}
//               {trend}%
//               <TrendingUp
//                 className={`h-4 w-4 ml-1 ${trend > 0 ? "" : "rotate-180"}`}
//               />
//             </span>
//           </div>
//         </div>
//         <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
//           {icon}
//         </div>
//       </div>
//     </CardContent>
//   </Card>
// );

// // StatBadge Component
// const StatBadge = ({ title, value, trend }: StatBadgeProps) => (
//   <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
//     <div>
//       <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
//       <p className="text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
//     </div>
//     <span
//       className={`text-sm ${trend > 0 ? "text-green-500" : "text-red-500"}`}
//     >
//       {trend > 0 ? "+" : ""}
//       {trend}%
//     </span>
//   </div>
// );