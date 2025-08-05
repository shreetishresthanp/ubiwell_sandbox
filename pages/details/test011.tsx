import { useRouter } from "next/router";
import Link from "next/link";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { ArrowLeft } from "lucide-react";

const dummyData1 = [
  { name: "Mon", value: 12 },
  { name: "Tue", value: 18 },
  { name: "Wed", value: 22 },
  { name: "Thu", value: 15 },
  { name: "Fri", value: 26 },
];

const dummyData2 = [
  { name: "Prompt A", count: 4 },
  { name: "Prompt B", count: 6 },
  { name: "Prompt C", count: 3 },
  { name: "Prompt D", count: 7 },
];

export default function UIDDetailsPage() {
  const router = useRouter();
  const { uid } = router.query;
    console.log(router);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-8">
          <div className="max-w-6xl mx-auto space-y-8">



    <button
      onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md hover:bg-gray-200 transition"
    >
      <ArrowLeft size={16} className="mr-2" />
      Back to Dashboard
    </button>       
                          

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-900">Stats for UID: <span className="text-blue-600">{uid}</span></h1>
          <p className="text-sm text-gray-500 mt-1">Visual overview of prompt activity and types</p>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Daily Prompt Count</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dummyData1}>
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Prompt Type Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dummyData2}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
