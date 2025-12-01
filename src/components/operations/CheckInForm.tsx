'use client'

import { useActionState, useEffect } from "react";
import { checkInAsset } from "@/app/actions/operations";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";

type Asset = { id: number; code: string; name: string };

export function CheckInForm({ assets }: { assets: Asset[] }) {
    const [state, formAction] = useActionState(checkInAsset, null);

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message);
            (document.getElementById("checkin-form") as HTMLFormElement)?.reset();
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <form id="checkin-form" action={formAction} className="space-y-6 pt-4">
            <div className="space-y-2">
                <Label htmlFor="assetId">Select Asset (In Use)</Label>
                <Select name="assetId" required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select asset to return..." />
                    </SelectTrigger>
                    <SelectContent>
                        {assets.map((asset) => (
                            <SelectItem key={asset.id} value={asset.id.toString()}>
                                {asset.code} - {asset.name}
                            </SelectItem>
                        ))}
                        {assets.length === 0 && <SelectItem value="none" disabled>No assets currently in use</SelectItem>}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-3">
                <Label>New Status</Label>
                <RadioGroup name="status" defaultValue="AVAILABLE" className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="AVAILABLE" id="r1" />
                        <Label htmlFor="r1" className="font-normal">Available (Ready for use)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="MAINTENANCE" id="r2" />
                        <Label htmlFor="r2" className="font-normal">Maintenance (Needs repair)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="RETIRED" id="r3" />
                        <Label htmlFor="r3" className="font-normal">Retired (Lost/Broken/Sold)</Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Notes / Condition</Label>
                <Textarea name="notes" placeholder="Condition of the asset..." />
            </div>

            <SubmitButton label="Confirm Return" />
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
