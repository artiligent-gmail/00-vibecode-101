import { getAssets } from "@/app/actions/assets";
import { getEmployees } from "@/app/actions/employees";
import { OperationsView } from "@/components/operations/OperationsView";

export default async function OperationsPage() {
    const [availableAssets, inUseAssets, employees] = await Promise.all([
        getAssets(undefined, "AVAILABLE"),
        getAssets(undefined, "IN_USE"),
        getEmployees(),
    ]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900">Operations</h1>
            <OperationsView
                availableAssets={availableAssets}
                inUseAssets={inUseAssets}
                employees={employees}
            />
        </div>
    );
}
