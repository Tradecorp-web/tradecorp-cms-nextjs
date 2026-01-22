import { AlternateEmailTwoTone } from "@material-ui/icons";
import { useState } from "react";
import { requestApi } from "./main.api";

export const setFlagStatusAcc = async (id, status) => {
  let dataPo = { flag_status_acc: status, status_acc: 1 };
  // alert(id);
  // alert(JSON.stringify(dataPo));
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/acc-po-update/${id}`,
      method: "PUT",
      body: dataPo,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
export const setStatusBackAcc = async (id, status_acc) => {
  let dataPo = { flag_status_acc: false, status_acc: status_acc };

  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/acc-po-update/${id}`,
      method: "PUT",
      body: dataPo,
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getListAccPurchaseOrderApi = async (param) => {
  var url = `${process.env.NEXT_PUBLIC_REST_API_URL}/acc-po?`;
  url += `search=${param?.search ?? ""}&`;
  url += `page=${param?.page ?? 1}&`;
  url += `limit=${param?.limit ?? 20}&`;
  url += `orderBy=${param?.orderBy ?? ""}&`;
  url += `order=${param?.order ?? ""}&`;
  try {
    const response = await requestApi({
      url: url,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getDetailAccPurchaseOrderApi = async (id) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/acc-po/${id}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const getPoReadySendApi = async (status_acc, flag) => {
  try {
    const response = await requestApi({
      url: `${process.env.NEXT_PUBLIC_REST_API_URL}/acc-po-status/${status_acc}/${flag}`,
      method: "GET",
      isAuth: true,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

//insert journal accounting

export const savePoToJournalApi = async (data) => {
  console.log(data);

  var response = null;
  response = await requestApi({
    url: `${process.env.NEXT_PUBLIC_REST_API_URL}/trx-journal`,
    method: "POST",
    body: data,
    isAuth: true,
  });
};
//==inser journal accounting
