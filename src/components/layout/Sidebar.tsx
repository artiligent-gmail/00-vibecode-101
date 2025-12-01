import Link from "next/link";
import { LayoutDashboard, Box, ArrowRightLeft, Settings } from "lucide-react";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Assets", href: "/dashboard/assets", icon: Box },
    { name: "Operations", href: "/dashboard/operations", icon: ArrowRightLeft },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
    return (
        <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    AssetMgr
                </h1>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-all duration-200 group"
                    >
                        <item.icon className="w-5 h-5 group-hover:text-indigo-400 transition-colors" />
                        <span className="font-medium">{item.name}</span>
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center space-x-3 px-4 py-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
                        AD
                    </div>
                    <div className="text-sm">
                        <p className="font-medium">Admin User</p>
                        <p className="text-xs text-slate-400">admin@company.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
