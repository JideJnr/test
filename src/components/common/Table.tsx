import { Row, flexRender } from "@tanstack/react-table";
import { Skeleton } from "antd";
import { Table } from "@tanstack/react-table";
import { RxCaretDown, RxCaretSort, RxCaretUp } from "react-icons/rx";

interface DynamicTableProps {
  table: Table<any>;
  fetchingAll: boolean;
  isNavigating: boolean;
  onClick?: (data: any) => void;
  emptyStateMessage: string;
  canSort?: boolean;
  hiddenColumns?: number;
  showToolTip?: boolean;
}

const DynamicTable: React.FC<DynamicTableProps> = ({
  table,
  fetchingAll,
  onClick,
  isNavigating,
  emptyStateMessage = "No data available.",
  hiddenColumns = 0,
}) => {
  return (
    <div className="relative overflow-x-auto sm:rounded-lg">
      <table className="w-full text-base text-left text-gray-500 ">
        <thead className="text-xs text-white uppercase bg-blue-700">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  scope="col"
                  className={` px-3 ${
                    header.column.getIsSorted() ? "py-1" : "py-2"
                  } whitespace-nowrap ${
                    header.column.getCanSort() && "cursor-pointer select-none"
                  }`}
                  key={header.id}
                  {...{
                    onClick: header.column.getToggleSortingHandler(),
                  }}
                >
                  <div className="flex items-center gap-2">
                    {header.isPlaceholder ? null : (
                      <>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <Sorter direction="up" />,
                          desc: <Sorter direction="down" />,
                        }[header.column.getIsSorted() as string] ?? (
                          <RxCaretSort className="text-gray-400" />
                        )}
                      </>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* Render the table body */}
        <tbody>
          {!fetchingAll && table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={table.getVisibleLeafColumns().length - hiddenColumns}
                className="text-center py-2 whitespace-nowrap"
              >
                {emptyStateMessage}
              </td>
            </tr>
          ) : (
            !fetchingAll &&
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={`hover:bg-blue-50 border-b border-gray-200 last:border-0 ${
                  isNavigating && "cursor-pointer"
                }`}
                onClick={() => {
                  if (isNavigating) onClick?.(row.original);
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-1 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}

          {fetchingAll &&
            Array(10)
              .fill(0)
              .map((_, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 last:border-0"
                >
                  {Array(table.getVisibleLeafColumns().length - hiddenColumns)
                    .fill(0)
                    .map((_, index) => (
                      <td key={index} className="text-center py-3">
                        <Skeleton.Input active size="small" block />
                      </td>
                    ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;

const Sorter: React.FC<{
  direction: "up" | "down";
}> = ({ direction }) => {
  return (
    <div className="flex flex-col gap-0">
      <RxCaretUp
        className={`text-xs leading-[0] p-0 m-0 ${
          direction !== "up" && "text-gray-400"
        }`}
      />
      <RxCaretDown
        className={`text-xs leading-[0] p-0 m-0 ${
          direction !== "down" && "text-gray-400"
        }`}
      />
    </div>
  );
};
