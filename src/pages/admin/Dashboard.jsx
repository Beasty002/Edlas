import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Badge } from "@/components/ui/badge";

// Example Data
const classDistribution = [
  { name: "Grade 10", value: 120 },
  { name: "Grade 11", value: 90 },
  { name: "Grade 12", value: 70 },
];

const COLORS = ["#6366f1", "#22c55e", "#f59e0b"];

const monthlyAdmissions = [
  { month: "Jan", students: 40 },
  { month: "Feb", students: 60 },
  { month: "Mar", students: 55 },
  { month: "Apr", students: 80 },
  { month: "May", students: 70 },
  { month: "Jun", students: 95 },
];

const recentActivities = [
  { id: 1, message: "John Doe admitted to Grade 10A", time: "2h ago" },
  { id: 2, message: "Jane Smith transferred to 11B", time: "5h ago" },
  { id: 3, message: "Sam Wilson graduated from Grade 12", time: "1d ago" },
  {
    id: 4,
    message: "New subject ‘Computer Science’ added to Grade 11",
    time: "2d ago",
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            title: "Students",
            value: "1,250",
            icon: <Users className="h-6 w-6" />,
            change: "+50 this month",
            color: "from-indigo-500 to-indigo-700",
          },
          {
            title: "Teachers",
            value: "85",
            icon: <GraduationCap className="h-6 w-6" />,
            change: "+2 this month",
            color: "from-emerald-500 to-emerald-700",
          },
          {
            title: "Classes",
            value: "30",
            icon: <BookOpen className="h-6 w-6" />,
            change: "Stable",
            color: "from-amber-500 to-amber-700",
          },
          {
            title: "Sections",
            value: "95",
            icon: <Layers className="h-6 w-6" />,
            change: "+3 new",
            color: "from-pink-500 to-pink-700",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition duration-200 rounded-md p-4 relative overflow-hidden "
            style={{
              backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
            }}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-90`}
            />
            <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs opacity-90">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-md shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-500" /> Monthly
              Admissions
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer>
              <LineChart data={monthlyAdmissions}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="#6366f1"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-md shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-500" /> Class
              Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex justify-center items-center">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={classDistribution}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                >
                  {classDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-pink-500" /> Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {[
              {
                id: 1,
                message: "Tommorrow's PTM has been rescheduled",
                time: "1h ago",
              },
              {
                id: 2,
                message: "Holiday notice: Dashain break starts Oct 10",
                time: "5h ago",
              },
              {
                id: 3,
                message: "Exam schedule for Grade 12 published",
                time: "1d ago",
              },
              {
                id: 4,
                message: "PTM scheduled for Grade 9 & 10",
                time: "2d ago",
              },
            ].map((n) => (
              <li
                key={n.id}
                className="flex justify-between items-center border-b last:border-0 pb-2"
              >
                <span className="text-sm">{n.message}</span>
                <Badge variant="outline" className="text-xs">
                  {n.time}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
