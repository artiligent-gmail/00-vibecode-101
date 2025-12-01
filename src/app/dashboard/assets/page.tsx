import { getAssets } from "@/app/actions/assets";
import { AssetTable } from "@/components/assets/AssetTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

export default async function AssetsPage(props: { searchParams: Promise<{ q?: string, status?: string }> }) {
    const searchParams = await props.searchParams;
    const query = searchParams.q || "";
    const status = searchParams.status || "ALL";

    const assets = await getAssets(query, status);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900">Assets</h1>
                <Link href="/dashboard/assets/new">
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="w-4 h-4 mr-2" /> Add Asset
                    </Button>
                </Link>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <form>
                        <Input
                            name="q"
                            placeholder="Search assets..."
                            className="pl-9 bg-white border-slate-200"
                            defaultValue={query}
                        />
                    </form>
                </div>
            </div>

            <AssetTable assets={assets} />
        </div>
    );
}
