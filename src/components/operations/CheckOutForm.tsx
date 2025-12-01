'use client'

import { useActionState, useEffect } from "react";
import { checkOutAsset } from "@/app/actions/operations";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";

type Asset = { id: number; code: string; name: string };
type Employee = { id: number; firstName: string; lastName: string; department: string | null };

export function CheckOutForm({ assets, employees }: { assets: Asset[], employees: Employee[] }) {
    const [state, formAction] = useActionState(checkOutAsset, null);

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message);
            (document.getElementById("checkout-form") as HTMLFormElement)?.reset();
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <form id="checkout-form" action={formAction} className="space-y-6 pt-4">
            <div className="space-y-2">
                <Label htmlFor="assetId">Select Asset (Available)</Label>
                <Select name="assetId" required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select asset..." />
                    </SelectTrigger>
                    <SelectContent>
                        {assets.map((asset) => (
                            <SelectItem key={asset.id} value={asset.id.toString()}>
                                {asset.code} - {asset.name}
                            </SelectItem>
                        ))}
                        {assets.length === 0 && <SelectItem value="none" disabled>No available assets</SelectItem>}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="employeeId">Select Employee</Label>
                <Select name="employeeId" required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select employee..." />
                    </SelectTrigger>
                    <SelectContent>
                        {employees.map((emp) => (
                            <SelectItem key={emp.id} value={emp.id.toString()}>
                                {emp.firstName} {emp.lastName} ({emp.department})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea name="notes" placeholder="Optional notes..." />
            </div>

            <SubmitButton label="Confirm Assignment" />
        </form>
    );
}

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Processing..." : label}
        </Button>
    );
}
