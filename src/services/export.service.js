const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const { getLeaveSummaryData } = require("./leave.service");

// ─────────────────────────────────────────────────────────────
// PDF Export
// ─────────────────────────────────────────────────────────────

/**
 * Stream a PDF leave summary to the HTTP response.
 */
const downloadPDF = async (userId, res) => {
  const { employee, leaves, balance } = await getLeaveSummaryData(userId);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="leave-summary-${userId}.pdf"`
  );

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  // ── Header ─────────────────────────────────────────
  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("Leave Summary Report", { align: "center" });
  doc.moveDown(0.5);
  doc
    .fontSize(10)
    .font("Helvetica")
    .text(`Generated: ${new Date().toDateString()}`, { align: "center" });
  doc.moveDown(1);

  // ── Employee Info ───────────────────────────────────
  doc.fontSize(13).font("Helvetica-Bold").text("Employee Details");
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.3);
  doc.fontSize(10).font("Helvetica");
  doc.text(`Name       : ${employee.name || "N/A"}`);
  doc.text(`Email      : ${employee.email || "N/A"}`);
  doc.text(`Department : ${employee.department || "N/A"}`);
  doc.moveDown(1);

  // ── Leave Balance ───────────────────────────────────
  doc.fontSize(13).font("Helvetica-Bold").text("Leave Balance");
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.3);
  doc.fontSize(10).font("Helvetica");

  if (balance) {
    const rows = [
      ["Annual Leave", balance.annual_total, balance.annual_used, balance.annual_total - balance.annual_used],
      ["Sick Leave",   balance.sick_total,   balance.sick_used,   balance.sick_total   - balance.sick_used],
      ["Casual Leave", balance.casual_total, balance.casual_used, balance.casual_total - balance.casual_used],
      ["LWOP",         "∞",                  balance.lwop_used,   "–"],
    ];

    const colX = [55, 200, 320, 430];
    doc.font("Helvetica-Bold");
    doc.text("Type",      colX[0], doc.y, { continued: true });
    doc.text("Total",     colX[1], doc.y, { continued: true });
    doc.text("Used",      colX[2], doc.y, { continued: true });
    doc.text("Remaining", colX[3], doc.y);
    doc.moveDown(0.3);
    doc.font("Helvetica");

    rows.forEach(([type, total, used, rem]) => {
      const y = doc.y;
      doc.text(String(type),  colX[0], y, { continued: true });
      doc.text(String(total), colX[1], y, { continued: true });
      doc.text(String(used),  colX[2], y, { continued: true });
      doc.text(String(rem),   colX[3], y);
      doc.moveDown(0.2);
    });
  }

  doc.moveDown(1);

  // ── Leave History ───────────────────────────────────
  doc.fontSize(13).font("Helvetica-Bold").text("Leave History");
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.3);
  doc.fontSize(9).font("Helvetica");

  if (leaves.length === 0) {
    doc.text("No leave records found.");
  } else {
    const hx = [55, 115, 190, 265, 310, 410];
    doc.font("Helvetica-Bold");
    doc.text("#",          hx[0], doc.y, { continued: true });
    doc.text("Type",       hx[1], doc.y, { continued: true });
    doc.text("Start",      hx[2], doc.y, { continued: true });
    doc.text("End",        hx[3], doc.y, { continued: true });
    doc.text("Days",       hx[4], doc.y, { continued: true });
    doc.text("Status",     hx[5], doc.y);
    doc.moveDown(0.2);
    doc.font("Helvetica");

    leaves.forEach((l, i) => {
      const y = doc.y;
      doc.text(String(i + 1),        hx[0], y, { continued: true });
      doc.text(l.leaveType,          hx[1], y, { continued: true });
      doc.text(l.startDate,          hx[2], y, { continued: true });
      doc.text(l.endDate,            hx[3], y, { continued: true });
      doc.text(String(l.duration),   hx[4], y, { continued: true });
      doc.text(l.status,             hx[5], y);
      doc.moveDown(0.2);
    });
  }

  doc.end();
};

// ─────────────────────────────────────────────────────────────
// Excel Export
// ─────────────────────────────────────────────────────────────

/**
 * Stream an Excel leave summary to the HTTP response.
 */
const downloadExcel = async (userId, res) => {
  const { employee, leaves, balance } = await getLeaveSummaryData(userId);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "HR Leave System";
  workbook.created = new Date();

  // ── Sheet 1: Summary ──────────────────────────────────
  const summarySheet = workbook.addWorksheet("Summary");
  summarySheet.columns = [
    { header: "Field",     key: "field",     width: 25 },
    { header: "Value",     key: "value",     width: 30 },
  ];

  summarySheet.addRow({ field: "Employee Name",  value: employee.name });
  summarySheet.addRow({ field: "Email",          value: employee.email });
  summarySheet.addRow({ field: "Department",     value: employee.department });
  summarySheet.addRow({});
  summarySheet.addRow({ field: "Annual Leave Total",     value: balance.annual_total });
  summarySheet.addRow({ field: "Annual Leave Used",      value: balance.annual_used });
  summarySheet.addRow({ field: "Annual Leave Remaining", value: balance.annual_total - balance.annual_used });
  summarySheet.addRow({});
  summarySheet.addRow({ field: "Sick Leave Total",       value: balance.sick_total });
  summarySheet.addRow({ field: "Sick Leave Used",        value: balance.sick_used });
  summarySheet.addRow({ field: "Sick Leave Remaining",   value: balance.sick_total - balance.sick_used });
  summarySheet.addRow({});
  summarySheet.addRow({ field: "Casual Leave Total",     value: balance.casual_total });
  summarySheet.addRow({ field: "Casual Leave Used",      value: balance.casual_used });
  summarySheet.addRow({ field: "Casual Leave Remaining", value: balance.casual_total - balance.casual_used });
  summarySheet.addRow({});
  summarySheet.addRow({ field: "LWOP Used",              value: balance.lwop_used });

  // Style header row
  summarySheet.getRow(1).font = { bold: true };

  // ── Sheet 2: Leave History ────────────────────────────
  const historySheet = workbook.addWorksheet("Leave History");
  historySheet.columns = [
    { header: "#",           key: "no",         width: 6  },
    { header: "Leave Type",  key: "leaveType",  width: 15 },
    { header: "Start Date",  key: "startDate",  width: 14 },
    { header: "End Date",    key: "endDate",    width: 14 },
    { header: "Duration",    key: "duration",   width: 10 },
    { header: "Reason",      key: "reason",     width: 35 },
    { header: "Status",      key: "status",     width: 12 },
    { header: "Applied On",  key: "appliedOn",  width: 20 },
  ];

  historySheet.getRow(1).font = { bold: true };

  leaves.forEach((l, i) => {
    historySheet.addRow({
      no:        i + 1,
      leaveType: l.leaveType,
      startDate: l.startDate,
      endDate:   l.endDate,
      duration:  l.duration,
      reason:    l.reason,
      status:    l.status,
      appliedOn: l.appliedOn,
    });
  });

  // Colour status cells
  historySheet.eachRow((row, rowNum) => {
    if (rowNum === 1) return;
    const statusCell = row.getCell("status");
    const colourMap = {
      Approved: "C6EFCE",
      Rejected: "FFC7CE",
      Pending:  "FFEB9C",
    };
    const fill = colourMap[statusCell.value];
    if (fill) {
      statusCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: fill },
      };
    }
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="leave-summary-${userId}.xlsx"`
  );

  await workbook.xlsx.write(res);
  res.end();
};

module.exports = { downloadPDF, downloadExcel };
