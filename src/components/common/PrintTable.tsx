import { IStatement } from "@/interfaces/iCustomer";
import StringFormat from "@/shared/utils/string";
import dayjs from "dayjs";
import { forwardRef } from "react";

function isDate(dateStr) {
  return !isNaN(new Date(dateStr).getDate());
}

function formatValue(value) {
  if (typeof value === "number") {
    return StringFormat.formatNumber(value);
  } else if (isDate(value)) {
    return dayjs(value).format("YYYY-MM-DD HH:mm");
  } else {
    return value;
  }
}

const PrintTable = forwardRef<
  HTMLDivElement,
  {
    data: IStatement[];
  }
>(({ data = [] }, ref) => {
  return (
    <div className="flex" ref={ref}>
      <table className="w-full text-xs text-left text-gray-500">
        <thead className="text-white uppercase bg-blue-700 mb-3">
          <tr>
            {data.length > 0 &&
              Object.keys(data[0]).map((key) => (
                <th scope="col" className="py-2" key={key}>
                  {StringFormat.toTitleCase2(key)}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {Object.values(item).map((value, index) => (
                <td className="px-1 py-1 text-[10px]" key={index}>
                  {formatValue(value) || "--"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default PrintTable;
