'use client'

import { useActionState } from "react";
import { createAsset } from "@/app/actions/assets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormStatus } from "react-dom";

type AssetType = {
    id: number;
    name: string;
};

export function AssetForm({ assetTypes }: { assetTypes: AssetType[] }) {
    const [state, formAction] = useActionState(createAsset, null);

    return (
        <form action={formAction} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="code">Asset Code <span className="text-red-500">*</span></Label>
                    <Input id="code" name="code" placeholder="e.g. AST-001" required />
                    {state?.fields?.code && <p className="text-xs text-red-500">{state.fields.code[0]}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="name">Asset Name <span className="text-red-500">*</span></Label>
                    <Input id="name" name="name" placeholder="e.g. MacBook Pro M3" required />
                    {state?.fields?.name && <p className="text-xs text-red-500">{state.fields.name[0]}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="typeId">Category <span className="text-red-500">*</span></Label>
                    <Select name="typeId" required>
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {assetTypes.map((type) => (
                                <SelectItem key={type.id} value={type.id.toString()}>
                                    {type.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {state?.fields?.typeId && <p className="text-xs text-red-500">{state.fields.typeId[0]}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="serialNumber">Serial Number</Label>
                    <Input id="serialNumber" name="serialNumber" placeholder="e.g. C02..." />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Input id="purchaseDate" name="purchaseDate" type="date" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" name="price" type="number" step="0.01" placeholder="0.00" />
                </div>
            </div>

            {state?.error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">
                    {state.error}
                </div>
            )}

            <div className="flex justify-end">
                <SubmitButton />
            </div>
        </form>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Create Asset"}
        </Button>
    );
}
