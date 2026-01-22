// import React from "react";
// import Button from "@material-ui/core/Button";
// import Dialog from "@material-ui/core/Dialog";
// import DialogActions from "@material-ui/core/DialogActions";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import useMediaQuery from "@material-ui/core/useMediaQuery";
// import { useTheme } from "@material-ui/core/styles";

import { sendFlagAcc } from "../../../../services/export/send-po-acc";

export function showMonth() {
  var arrMonth = [];
  for (let i = 0; i < 12; i++) {
    const today = new Date();
    const utcYear = today.getFullYear();
    const date = new Date(utcYear, i, 1); // 2009-11-10
    const month = date.toLocaleString("default", { month: "long" });
    arrMonth.push(month);
  }
  return arrMonth;
}

export function showYear() {
  var arrYear = [];
  const today = new Date();
  const utcYear = today.getFullYear();
  let oldYear = utcYear - 20;
  for (let i = utcYear; i >= oldYear; i--) {
    arrYear.push(i.toString());
  }
  return arrYear;
}

export function getMonth(vMonth) {
  const today = new Date();
  const utcYear = today.getFullYear();
  const date = new Date(utcYear, vMonth - 1, 1); // 2009-11-10
  const month = date.toLocaleString("default", { month: "long" });
  return month;
}

export function modulDesc(vModul) {
  let modul = "";
  switch (vModul) {
    case "po":
      modul = "Purchase Order";
      break;
    case "wo":
      modul = "Work Order";
      break;

    default:
      modul = "No Modul Selected";
  }
  return modul;
}
