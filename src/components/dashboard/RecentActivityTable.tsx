import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type Transaction = {
    id: number;
    action: string;
    date: Date;
    asset: { name: string; code: string };
    employee: { firstName: string; lastName: string };
};

export function RecentActivityTable({ activities }: { activities: Transaction[] }) {
    return (
        <div className="rounded-md border bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Asset</TableHead>
                        <TableHead>Employee</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {activities.map((activity) => (
                        <TableRow key={activity.id}>
                            <TableCell className="text-slate-600">
                                {new Date(activity.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <Badge variant={activity.action === "CHECK_OUT" ? "default" : "secondary"} className={activity.action === "CHECK_OUT" ? "bg-indigo-600 hover:bg-indigo-700" : ""}>
                                    {activity.action === "CHECK_OUT" ? "Check Out" : "Check In"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium">{activity.asset.name}</span>
                                    <span className="text-xs text-slate-500">{activity.asset.code}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                {activity.employee.firstName} {activity.employee.lastName}
                            </TableCell>
                        </TableRow>
                    ))}
                    {activities.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                                No recent activity.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
