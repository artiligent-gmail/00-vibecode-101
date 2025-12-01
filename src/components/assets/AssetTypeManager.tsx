'use client'

import { useActionState, useEffect } from "react";
import { createAssetType, deleteAssetType } from "@/app/actions/asset-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { useFormStatus } from "react-dom";

type AssetType = {
    id: number;
    name: string;
    description: string | null;
    _count: { assets: number };
};

export function AssetTypeManager({ initialAssetTypes }: { initialAssetTypes: AssetType[] }) {
    async function handleDelete(id: number) {
        if (!confirm("Are you sure you want to delete this asset type?")) return;

        const result = await deleteAssetType(id);
        if (result.success) {
            toast.success("Asset type deleted");
        } else {
            toast.error(result.error);
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <h3 className="text-lg font-medium">Add New Type</h3>
                <CreateAssetTypeForm />
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-center">Assets Count</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialAssetTypes.map((type) => (
                            <TableRow key={type.id}>
                                <TableCell className="font-medium">{type.name}</TableCell>
                                <TableCell>{type.description || "-"}</TableCell>
                                <TableCell className="text-center">
                                    <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                                        {type._count.assets}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(type.id)}
                                        disabled={type._count.assets > 0}
                                        className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {initialAssetTypes.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-12 text-slate-500">
                                    No asset types found. Start by adding one.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

function CreateAssetTypeForm() {
    const [state, formAction] = useActionState(createAssetType, null);

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message);
            const form = document.getElementById("create-type-form") as HTMLFormElement;
            form?.reset();
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <form id="create-type-form" action={formAction} className="flex flex-col sm:flex-row gap-4 items-end bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="grid w-full sm:max-w-xs items-center gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" name="name" placeholder="e.g. Laptop" required className="bg-white" />
                {state?.fields?.name && <p className="text-xs text-red-500">{state.fields.name[0]}</p>}
            </div>
            <div className="grid w-full sm:max-w-md items-center gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Input type="text" id="description" name="description" placeholder="Optional description" className="bg-white" />
            </div>
            <SubmitButton />
        </form>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? "Adding..." : <><Plus className="w-4 h-4 mr-2" /> Add Type</>}
        </Button>
    );
}
