import { Loader2 } from "lucide-react";

type Column<T> = {
  header: string;
  render: (item: T) => React.ReactNode;
};

type AdminListTableProps<T> = {
  title: string;
  subtitle?: string;
  isLoading: boolean;
  data: T[] | undefined;
  columns: Column<T>[];
};

export function AdminListTable<T>({ title, subtitle, isLoading, data, columns }: AdminListTableProps<T>) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="rounded-xl border border-slate-200 bg-white">
        {isLoading ? (
          <div className="flex items-center gap-2 px-6 py-8 text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  {columns.map(column => (
                    <th key={column.header} className="px-6 py-3 font-medium">
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(data ?? []).map((item, index) => (
                  <tr key={index} className="border-t border-slate-100">
                    {columns.map(column => (
                      <td key={column.header} className="px-6 py-4 text-slate-700">
                        {column.render(item)}
                      </td>
                    ))}
                  </tr>
                ))}
                {(!data || data.length === 0) && (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
