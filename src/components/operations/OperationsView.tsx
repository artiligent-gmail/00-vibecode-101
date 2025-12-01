'use client'

import { useState } from "react";
import { CheckOutForm } from "@/components/operations/CheckOutForm";
import { CheckInForm } from "@/components/operations/CheckInForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Asset = { id: number; code: string; name: string };
type Employee = { id: number; firstName: string; lastName: string; department: string | null };

export function OperationsView({
    availableAssets,
    inUseAssets,
    employees
}: {
    availableAssets: Asset[],
    inUseAssets: Asset[],
    employees: Employee[]
}) {
    const [activeTab, setActiveTab] = useState<"checkout" | "checkin">("checkout");

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg">
                <button
                    onClick={() => setActiveTab("checkout")}
                    className={`py-2 text-sm font-medium rounded-md transition-all ${activeTab === "checkout"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                >
                    Check-out (Assign)
                </button>
                <button
                    onClick={() => setActiveTab("checkin")}
                    className={`py-2 text-sm font-medium rounded-md transition-all ${activeTab === "checkin"
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                >
                    Check-in (Return)
                </button>
            </div>

            {activeTab === "checkout" ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Assign Asset</CardTitle>
                        <CardDescription>
                            Assign an available asset to an employee.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CheckOutForm assets={availableAssets} employees={employees} />
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Return Asset</CardTitle>
                        <CardDescription>
                            Process an asset return from an employee.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CheckInForm assets={inUseAssets} />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
