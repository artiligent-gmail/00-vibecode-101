import { getAssetTypes } from "@/app/actions/asset-types";
import { AssetForm } from "@/components/assets/AssetForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function NewAssetPage() {
    const assetTypes = await getAssetTypes();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/assets">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold text-slate-900">Add New Asset</h1>
            </div>

            <AssetForm assetTypes={assetTypes} />
        </div>
    );
}
