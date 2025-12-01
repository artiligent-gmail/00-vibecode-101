import { getAssetById } from "@/app/actions/assets";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Box, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AssetDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = parseInt(params.id);
    if (isNaN(id)) notFound();

    const asset = await getAssetById(id);
    if (!asset) notFound();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/assets">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{asset.name}</h1>
                    <p className="text-slate-500 text-sm">{asset.code}</p>
                </div>
                <div className="ml-auto">
                    <StatusBadge status={asset.status} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Asset Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Category</p>
                            <p className="text-base">{asset.type.name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Serial Number</p>
                            <p className="text-base">{asset.serialNumber || "-"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Purchase Date</p>
                            <p className="text-base">{asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : "-"}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Price</p>
                            <p className="text-base">{asset.price ? `$${Number(asset.price).toFixed(2)}` : "-"}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Current Holder</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {asset.status === 'IN_USE' && asset.transactions[0]?.employee ? (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">{asset.transactions[0].employee.firstName} {asset.transactions[0].employee.lastName}</p>
                                    <p className="text-sm text-slate-500">{asset.transactions[0].employee.department}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-slate-500">
                                <Box className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>Not currently assigned</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>History Log</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Employee</TableHead>
                                <TableHead>Notes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {asset.transactions.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{tx.action.replace("_", " ")}</Badge>
                                    </TableCell>
                                    <TableCell>{tx.employee.firstName} {tx.employee.lastName}</TableCell>
                                    <TableCell>{tx.notes || "-"}</TableCell>
                                </TableRow>
                            ))}
                            {asset.transactions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-6 text-slate-500">
                                        No history recorded.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        AVAILABLE: "bg-emerald-100 text-emerald-700 border-emerald-200",
        IN_USE: "bg-blue-100 text-blue-700 border-blue-200",
        MAINTENANCE: "bg-amber-100 text-amber-700 border-amber-200",
        RETIRED: "bg-red-100 text-red-700 border-red-200",
    };

    return (
        <Badge className={`${styles[status as keyof typeof styles] || ""} font-medium`} variant="outline">
            {status.replace("_", " ")}
        </Badge>
    );
}
