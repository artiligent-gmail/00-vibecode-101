import { getAssetTypes } from "@/app/actions/asset-types";
import { AssetTypeManager } from "@/components/assets/AssetTypeManager";

export default async function SettingsPage() {
    const assetTypes = await getAssetTypes();

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Settings</h1>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <h2 className="text-xl font-semibold mb-4">Asset Types</h2>
                <AssetTypeManager initialAssetTypes={assetTypes} />
            </div>
        </div>
    );
}
