import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { checkDigitGenerator } from "../../helpers/general";

export const exportXlss = async (dataOrderQuote2) => {
  var b64 = "";
  var wb = new ExcelJS.Workbook();
  var ws = wb.addWorksheet("tes");
  dataOrderQuote2?.result?.map((res, keys) => {
    b64 = res?.order_quote_files[0]?.thumbnail;

    var myBase64Image = "data:image/png;base64," + b64;

    var imageId2 = wb.addImage({
      base64: myBase64Image,
      extension: "jpeg",
    });

    ws.addImage(imageId2, {
      tl: { col: 6, row: keys + 4 },
      ext: { width: 150, height: 150 },
      editAs: "absolute",
    });
  });

  var buf = await wb.xlsx.writeBuffer();

  // download file dari browser dan menamai filenya
  saveAs(new Blob([buf]), "tes" + ".xlsx");
};
export const exportXls = async (dataOrderQuote2) => {
  var spec = 0;
  dataOrderQuote2?.result?.map((cek) => {
    spec = cek?.container_specifications?.length;
  });

  var today = new Date(),
    dateNow =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate() +
      " " +
      today.getHours() +
      ":" +
      today.getMinutes() +
      ":" +
      today.getSeconds();

  // Create WorkBook
  const wb = new ExcelJS.Workbook();

  var column = 10;

  //properties excel
  wb.creator = "Tradecorp";
  wb.lastModifiedBy = "Tradecorp";
  wb.created = new Date(2022, 1, 5);
  wb.modified = new Date();
  wb.lastPrinted = new Date(2022, 1, 5);

  // Create Sheet
  //summary sheet
  const ws = wb.addWorksheet("Summary");

  ws.columns = [
    { key: "A", width: 10 },
    { key: "B", width: 40 },
    { key: "C", width: 10 },
    { key: "D", width: 10 },
    { key: "E", width: 10 },
    { key: "F", width: 20 },
    { key: "G", width: 20 },
    { key: "H", width: 10 },
    { key: "I", width: 10 },
  ];
  // Set value cell untuk title
  var factory = dataOrderQuote2?.result[0]?.container_factory;
  ws.getRow(1).getCell("A").value =
    "A List of Container Number (" +
    dataOrderQuote2?.result[0]?.container_factory +
    ")";
  ws.getRow(2).getCell("A").value = "Print date :" + dateNow;

  // Set font Style
  ws.getRow(1).getCell("A").font = {
    bold: true,
    size: 16,
  };

  // merge cell dari A1 sampai C1
  ws.mergeCells("A1", "H1");
  ws.mergeCells("A2", "H2");
  ws.mergeCells("F3", "G3");

  // inisiasi pada baris ke 3 jadi Header table
  const rowHeader = ws.getRow(3);

  // Buat styling cell header menggunakan perulangan agar tidak per cell kita bikinnya

  for (let i = 1; i <= column; i++) {
    // Untuk border table
    rowHeader.getCell(i).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    // Untuk fill color cell
    rowHeader.getCell(i).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "191970" },
    };
    // Untuk alignment text dalam cell
    rowHeader.getCell(i).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    // Untuk set font
    rowHeader.getCell(i).font = {
      bold: true,
      size: 11,
      color: { argb: "FFFFFF" },
    };
  }

  // Isi data Header
  rowHeader.getCell(1).value = "No";
  rowHeader.getCell(2).value = "Type";
  rowHeader.getCell(3).value = "Unit Code";
  rowHeader.getCell(4).value = "Qty";
  rowHeader.getCell(5).value = "Color";
  rowHeader.getCell(6).value = "Series";
  rowHeader.getCell(8).value = "Door Logo";
  rowHeader.getCell(9).value = "Logo PIC TBA";
  rowHeader.getCell(10).value = "CSC Plate";

  // Buat datanya menggunakan perulangan
  var start = 4;
  var containerNumber = "";
  dataOrderQuote2?.result?.map((res, keys) => {
    if (keys === 0) {
      containerNumber = res?.container_number;
    }
    const row = ws.getRow(start + keys);
    for (let index = 1; index <= column; index++) {
      row.getCell(index).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    }
    row.getCell(1).value = keys + 1;
    row.getCell(1).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    row.getCell(2).value = res?.container_type_data;
    row.getCell(2).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    row.getCell(3).value = res?.unit_code;
    row.getCell(3).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    row.getCell(4).value = res?.quantity;
    row.getCell(4).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    var vColor = "";
    // if (typeof res?.container_color[0] != "undefined") {
    vColor = res?.color + " - " + res?.container_color?.name_english;
    // }
    row.getCell(5).value = vColor;
    row.getCell(5).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    row.getCell(6).value = res?.container_number_from;
    row.getCell(6).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    row.getCell(7).value = res?.container_number_to;
    row.getCell(7).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };

    //   alert(res?.order_quote_files[0]?.thumbnail);
    var doorLogo = "No";
    row.height = 25;
    var imageId2 = "";
    if (res?.order_quote_files[0]?.file_description == "company_logo") {
      row.height = 60;
      doorLogo = "Yes";
      var myBase64Image =
        "data:image/jpeg;base64," + res?.order_quote_files[0]?.thumbnail;

      var imageId2 = wb.addImage({
        base64: myBase64Image,
        extension: "jpeg",
      });
      // ws.addImage(imageId2, "M1");
    }

    row.getCell(8).value = doorLogo;
    row.getCell(8).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "center",
    };
    // row.getCell(7).value = res?.contract;
    ws.addImage(imageId2, {
      tl: { col: 8, row: start - 1 + keys },
      ext: { width: 60, height: 60 },
      editAs: "absolute",
    });

    row.getCell(10).value = res?.csc_plate_description;
    row.getCell(10).alignment = {
      wrapText: true,
      vertical: "middle",
      horizontal: "left",
    };
  });

  //==summary sheet
  //create header for detail

  var size = "";

  dataOrderQuote2?.result?.map((res, keys) => {
    if (size != res?.container_size_data + "' " + res?.container_type_data) {
      const ws = wb.addWorksheet(
        res?.container_size_data + "' " + res?.container_type_data
      );
      ws.columns = [
        { key: "A", width: 5 },
        { key: "B", width: 20 },
        { key: "C", width: 5 },
        { key: "D", width: 20 },
        { key: "E", width: 10 },
        { key: "F", width: 10 },
        { key: "G", width: 20 },
        { key: "H", width: 20 },
      ];
      // Set value cell untuk title

      ws.getRow(1).getCell("A").value =
        "A List of Container Number (" +
        dataOrderQuote2?.result[0]?.container_factory +
        ")";
      ws.getRow(2).getCell("A").value =
        "Container size :" +
        res?.container_size_data +
        "' " +
        res?.container_type_data +
        " , Print date :" +
        dateNow;

      // Set font Style
      ws.getRow(1).getCell("A").font = {
        bold: true,
        size: 16,
      };

      // merge cell dari A1 sampai C1
      ws.mergeCells("A1", "D1");
      ws.mergeCells("A2", "D2");
      ws.mergeCells("F3", "G3");

      // inisiasi pada baris ke 3 jadi Header table

      const rowHeader = ws.getRow(3);

      // Buat styling cell header menggunakan perulangan agar tidak per cell kita bikinnya

      for (let i = 1; i <= column + 3; i++) {
        // Untuk border table
        rowHeader.getCell(i).border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        // Untuk fill color cell
        rowHeader.getCell(i).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "191970" },
        };
        // Untuk alignment text dalam cell
        rowHeader.getCell(i).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        // Untuk set font
        rowHeader.getCell(i).font = {
          bold: true,
          size: 11,
          color: { argb: "FFFFFF" },
        };
      }

      // Isi data Header
      rowHeader.getCell(1).value = "No";

      rowHeader.getCell(2).value = "Container Number";
      rowHeader.getCell(2).alignment = {
        wrapText: true,
        vertical: "middle",
        horizontal: "center",
      };
      rowHeader.getCell(3).value = "Check Digit";
      rowHeader.getCell(3).alignment = {
        wrapText: true,
        vertical: "middle",
        horizontal: "center",
      };
      rowHeader.getCell(4).value = "Type";
      rowHeader.getCell(4).alignment = {
        wrapText: true,
        vertical: "middle",
        horizontal: "center",
      };
      rowHeader.getCell(5).value = "Unit Code";
      rowHeader.getCell(5).alignment = {
        wrapText: true,
        vertical: "middle",
        horizontal: "center",
      };
      rowHeader.getCell(6).value = "Color";
      rowHeader.getCell(6).alignment = {
        wrapText: true,
        vertical: "middle",
        horizontal: "center",
      };
      rowHeader.getCell(8).value = "Specification";
      rowHeader.getCell(8).alignment = {
        wrapText: true,
        vertical: "middle",
        horizontal: "center",
      };

      var start = 3;
      var number = 1;
      dataOrderQuote2?.result?.map((resDetail, keysDetail) => {
        let containerNumberStart = resDetail?.container_number_from.substring(
          6,
          10
        );
        let containerNumberEnd = resDetail?.container_number_to.substring(
          6,
          10
        );
        let cTextNumber = resDetail?.container_number_from.substring(0, 6);

        for (
          let row = parseInt(containerNumberStart);
          row <= parseInt(containerNumberEnd);
          row++
        ) {
          var containerNumber = cTextNumber + row;
          var num = row.toString();
          var numString = "";
          if (num.length == 1) {
            numString = "000" + num;
          }
          if (num.length == 2) {
            numString = "00" + num;
          }
          if (num.length == 3) {
            numString = "0" + num;
          }
          var textNum = res?.prefix + res?.series?.toString() + numString;
          var gen = checkDigitGenerator(textNum);

          if (
            res?.container_size_data + res?.container_type_data ==
            resDetail?.container_size_data + resDetail?.container_type_data
          ) {
            const row = ws.getRow(start + number);
            column = 9;
            if (
              typeof resDetail?.container_specifications?.length != "undefined"
            ) {
              var column2 = column + res?.container_specifications?.length;
            }
            var logo = "No";
            var csc = "No";
            resDetail?.order_quote_files?.map((res) => {
              if (res?.file_description == "company_logo") {
                logo = "Yes";
              }
              if (res?.file_description == "csc_certified") {
                csc = "Yes";
              }
            });

            row.getCell(1).value = number;
            row.getCell(2).value = textNum;
            row.getCell(3).value = gen;
            row.getCell(4).value = resDetail?.container_type_data;
            row.getCell(5).value = resDetail?.unit_code;
            row.getCell(6).value = resDetail?.container_color?.ral_code;
            row.getCell(7).value = resDetail?.container_color?.name_english;
            var lastRow = 0;
            resDetail?.container_specifications?.map((res, key) => {
              row.getCell(8 + key).value = res?.specification;
              lastRow = 8 + key + 1;
            });
            if (resDetail?.other_specification != null) {
              row.getCell(lastRow).value = resDetail?.other_specification;
            }
          }
          number++;
        }
      });
      size = res?.container_size_data + "' " + res?.container_type_data;
    }
  });

  //membuat buffer file
  const buf = await wb.xlsx.writeBuffer();

  // download file dari browser dan menamai filenya
  saveAs(new Blob([buf]), "container_number_generate-" + factory + ".xlsx");
};
