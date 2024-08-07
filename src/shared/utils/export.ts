import generateExcel from "zipcelx";

export function getExcel(headerGroups, getHeader, rows, name) {
  const config = {
    filename: name,
    sheet: {
      data: [],
    },
  };

  const dataSet = config.sheet.data;

  // review with one level nested config
  // HEADERS
  headerGroups.forEach((headerGroup) => {
    const headerRow = [];
    if (headerGroup.headers) {
      headerGroup.headers.forEach((column) => {
        headerRow.push(...getHeader(column));
      });
    }

    dataSet.push(headerRow);
  });

  // FILTERED ROWS
  if (rows.length > 0) {
    rows.forEach((row) => {
      const dataRow = [];

      Object.values(row.values).forEach((value) =>
        dataRow.push({
          value,
          type: typeof value === "number" ? "number" : "string",
        })
      );

      dataSet.push(dataRow);
    });
  } else {
    dataSet.push([
      {
        value: "No data",
        type: "string",
      },
    ]);
  }

  return generateExcel(config);
}
