import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

type MeetingType = {
  type: string;
  count: number;
};

type Props = {
  data: MeetingType[];
};

const COLORS = ["#0088FE","#FF6699"];

export const MeetingTypesChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="p-4  dark:bg-transparent rounded-lg  w-full h-80 flex flex-col">
      
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <span className="text-gray-700 dark:text-gray-300">{entry.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
