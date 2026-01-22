// import React from "react";
import { useEffect, useState } from "react";
import { accPoDataSwr } from "../../../../services/swr/acc-po-data.swr";

export function doImport() {
  const [AccPoData, setAccPoData] = useState([]);
  var accPoSwr = accPoDataSwr("", "");
  //   var accPoSwr = accPoDaataSwr("01-09-2021", "25-09-2021");
  useEffect(() => {
    if (accPoSwr?.data) {
      setAccPoData(accPoSwr?.data.result ?? []);
    }
  }, []);
  alert(JSON.stringify(AccPoData));
  //   AccPoData.map((id) => alert(id));
  return AccPoData;
}
// const importData = async (index) => {
//   if (index == 0) {
//     importData(index + 1);
//   } else {
//     setUploading(true);
//     var teu = 1;
//     if (data[index][1].toString() == "20") teu = 1;
//     if (data[index][1].toString() == "40") teu = 2;

//     var param = {
//       serial_number: data[index][0],
//       size_id:
//         masterData?.find(
//           (val) =>
//             val.name.toLowerCase() == data[index][1].toString().toLowerCase()
//         )?.id ?? null,
//       teu: teu,
//       type_id:
//         masterData?.find(
//           (val) =>
//             val.name.toLowerCase() == data[index][2].toString().toLowerCase()
//         )?.id ?? null,
//       stock_depo_id: stockDepoId,
//       depo_id: stockDepoId,
//       stock_status_id:
//         masterData?.find(
//           (val) =>
//             val.name.toLowerCase() == data[index][3].toString().toLowerCase()
//         )?.id ?? null,
//       repair_status_id:
//         masterData?.find(
//           (val) =>
//             val.name.toLowerCase() == data[index][4].toString().toLowerCase()
//         )?.id ?? null,
//       condition_id:
//         masterData?.find(
//           (val) =>
//             val.name.toLowerCase() == data[index][5].toString().toLowerCase()
//         )?.id ?? null,
//       percentage: data[index][6],
//       yom_month: data[index][7],
//       yom_year: data[index][8],
//       csc_month: data[index][9],
//       csc_year: data[index][10],
//       remarks: data[index][11],
//       company_id: company,
//     };
//     await insertContainerApi(param);
//     setCompleted(index + 1);
//     if (index < data.length - 1) {
//       importData(index + 1);
//     } else {
//       setUploading(false);
//       setFileName("");
//       setData([]);
//       props?.dataImported();
//     }
//   }
// };
