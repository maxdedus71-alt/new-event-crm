const ExcelJS = require('exceljs');
const { Parser } = require('json2csv');

async function exportToExcel(res, rows, sheetName, fileName) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  if (rows.length > 0) {
    worksheet.columns = Object.keys(rows[0]).map(key => ({
      header: key,
      key
    }));
    worksheet.addRows(rows);
  }

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}.xlsx"`);

  await workbook.xlsx.write(res);
  res.end();
}

function exportToCsv(res, rows, fileName) {
  const parser = new Parser();
  const csv = parser.parse(rows);

  res.header('Content-Type', 'text/csv; charset=utf-8');
  res.attachment(`${fileName}.csv`);
  res.send('\uFEFF' + csv);
}

module.exports = {
  exportToExcel,
  exportToCsv
};