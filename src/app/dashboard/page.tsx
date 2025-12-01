import { getAssetStats, getRecentActivity } from "@/app/actions/dashboard";
import { RecentActivityTable } from "@/components/dashboard/RecentActivityTable";
import { Box, CheckCircle, User, Wrench } from "lucide-react";

export default async function DashboardPage() {
    const [stats, recentActivity] = await Promise.all([
        getAssetStats(),
        getRecentActivity(),
    ]);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Assets"
                    value={stats.total}
                    icon={Box}
                    color="text-slate-900"
                    bgColor="bg-slate-100"
                />
                <StatCard
                    title="Available"
                    value={stats.available}
                    icon={CheckCircle}
                    color="text-emerald-600"
                    bgColor="bg-emerald-100"
                />
                <StatCard
                    title="In Use"
                    value={stats.inUse}
                    icon={User}
                    color="text-blue-600"
                    bgColor="bg-blue-100"
                />
                <StatCard
                    title="Maintenance"
                    value={stats.maintenance}
                    icon={Wrench}
                    color="text-amber-600"
                    bgColor="bg-amber-100"
                />
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">Recent Activity</h2>
                <RecentActivityTable activities={recentActivity} />
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, bgColor }: any) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
                <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
                <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
            </div>
            <div className={`p-3 rounded-full ${bgColor}`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
        </div>
    );
}
