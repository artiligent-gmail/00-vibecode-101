'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye } from "lucide-react";

export function AssetTable({ assets }: { assets: any[] }) {
    return (
        <div className="rounded-md border bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Current Holder</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {assets.map((asset) => (
                        <TableRow key={asset.id}>
                            <TableCell className="font-medium">{asset.code}</TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium">{asset.name}</span>
                                    <span className="text-xs text-slate-500">{asset.serialNumber}</span>
                                </div>
                            </TableCell>
                            <TableCell>{asset.type.name}</TableCell>
                            <TableCell>
                                <StatusBadge status={asset.status} />
                            </TableCell>
                            <TableCell>
                                {asset.transactions[0]?.employee ? (
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{asset.transactions[0].employee.firstName} {asset.transactions[0].employee.lastName}</span>
                                        <span className="text-xs text-slate-500">{asset.transactions[0].employee.department}</span>
                                    </div>
                                ) : (
                                    <span className="text-slate-400 text-sm">-</span>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <Link href={`/dashboard/assets/${asset.id}`}>
                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                    {assets.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                                No assets found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        AVAILABLE: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200",
        IN_USE: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200",
        MAINTENANCE: "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200",
        RETIRED: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
    };

    return (
        <Badge className={`${styles[status as keyof typeof styles] || ""} font-medium`} variant="outline">
            {status.replace("_", " ")}
        </Badge>
    );
}
