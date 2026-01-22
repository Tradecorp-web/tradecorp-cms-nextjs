import exportFromJSON from "export-from-json";
import { dateFormat } from "../../helpers/general";

import { getPoReadySendApi, savePoToJournalApi } from "../api/acc-po.api";
import {
  getListAccPurchaseOrderApi,
  setFlagStatusAcc,
  setStatusBackAcc,
} from "../api/acc-po.api";
import { AlternateEmail } from "@material-ui/icons";

export const sendFlagAcc = async (param) => {
  try {
    // var res = await setFlagStatusAcc(param?.id, param?.flag);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const sendStatusBackAcc = async (param) => {
  try {
    var res = await setStatusBackAcc(param?.id, param?.status);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const sendPurchaseOrderAcc = async (param) => {
  var res = await getPoReadySendApi(param?.status_acc, param?.flag);

  for (var i = 0; i < res.total; i++) {
    var obj = {
      remarks: "(Mig) Insert from PO Number " + res.result[i].po_number,
      trx_src: "trx-acc-po-map",
      trx_date: "2022-03-02T17:00:00.000Z",
      reference_number: "TRX-22012",
      reference_document: res.result[i].po_number,
      company_id: "bbaecc1f-6151-44b8-9be5-debe77d40676",
      details: [
        {
          coa_id: "7ed41f69-eedd-4214-2df7-1bfe1f14c9d6",
          coa_code: "1000",
          coa_name: "Accounts payable",
          coa_description: null,
          remark_detail: "Pembelian bahan bakar dan uang makan",
          reference_document_detail: "PO-X1101",
          debit: 350000.0,
          credit: 0,
        },
        {
          coa_id: "98d4d97a-ade6-3a1c-2386-96e14271272c",
          coa_code: "110",
          coa_name: "Bank savings account",
          coa_description: null,
          remark_detail: "Pembelian bahan bakar dan uang makan",
          reference_document_detail: "PO-X1101",
          debit: 0,
          credit: 350000.0,
        },
      ],
    };

    savePoToJournalApi(obj);
  }
  console.log(obj);
};
