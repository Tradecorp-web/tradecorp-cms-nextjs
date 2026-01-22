import {
  LOCAL_STORAGE_API_TOKEN,
  LOCAL_STORAGE_EXP_TOKEN,
  LOCAL_STORAGE_USER_ID,
  LOCAL_STORAGE_API_REFRESH_TOKEN,
  LOCAL_STORAGE_DEVICE,
  LOCAL_STORAGE_PREFIX,
  LOCAL_STORAGE_SUFFIX,
  LOCAL_STORAGE_THOUSAND,
  LOCAL_STORAGE_DECIMAL,
  LOCAL_STORAGE_SCALE,
  LOCAL_STORAGE_SWITCH_VIEW,
} from "./consts";
import { loginApi, tokenApi } from "../services/api/auth.api";
import moment from "moment";
import getRoute from "./router";
import NumberFormat from "react-number-format";
import { isNumber } from "@material-ui/data-grid";

export function rupiah(number) {
  return `Rp ${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

export const redirectIfUnAuth = async (router) => {
  var res = await isLoggedIn();
  if (!res) router.push(getRoute("auth.login"));
};

export const isLoggedIn = () => {
  const token = localStorage.getItem(LOCAL_STORAGE_API_TOKEN);
  const exp = localStorage.getItem(LOCAL_STORAGE_EXP_TOKEN);
  const userid = localStorage.getItem(LOCAL_STORAGE_USER_ID);
  const refresh = localStorage.getItem(LOCAL_STORAGE_API_REFRESH_TOKEN);
  const device = localStorage.getItem(LOCAL_STORAGE_DEVICE);

  if (token != "" && token != "undefined" && token != null) {
    var now = new Date().getTime();
    var timenow = Math.floor(now / 1000);
    //console.log(exp)
    //console.log(timenow)
    if (timenow > exp) {
      try {
        var data = tokenApi(userid, refresh, device);
        if (data.expires > 0) {
          return true;
        } else {
          localStorage.removeItem(LOCAL_STORAGE_API_TOKEN);
          localStorage.removeItem(LOCAL_STORAGE_EXP_TOKEN);
          localStorage.removeItem(LOCAL_STORAGE_USER_ID);
          localStorage.removeItem(LOCAL_STORAGE_API_REFRESH_TOKEN);
          return false;
        }
      } catch (err) {
        console.log(err);
        localStorage.removeItem(LOCAL_STORAGE_API_TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_EXP_TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_USER_ID);
        localStorage.removeItem(LOCAL_STORAGE_API_REFRESH_TOKEN);
        return false;
      }
    } else {
      return true;
    }
  } else {
    localStorage.removeItem(LOCAL_STORAGE_API_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_EXP_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_USER_ID);
    localStorage.removeItem(LOCAL_STORAGE_API_REFRESH_TOKEN);
    return false;
  }
};

export const isPermit = (tipe, module) => {
  const token = localStorage.getItem(LOCAL_STORAGE_API_TOKEN);
  if (token != "" && token != "undefined" && token != null) {
    const data = JSON.parse(atob(token.split(".")[1]));
    const permission = JSON.parse(data.role);
    for (let item of permission) {
      if (
        item.permission_type == tipe &&
        item.module == module &&
        item.access
      ) {
        return true;
      }
    }
    return false;
  } else {
    return false;
  }
};

export function switchView(type = "") {
  var switch_view = localStorage.getItem(LOCAL_STORAGE_SWITCH_VIEW);
  if (switch_view == "" || switch_view == null || switch_view == "undefined") {
    switch_view = "list";
  }
  if (type == "" || type == null) {
    return switch_view;
  } else {
    localStorage.setItem(LOCAL_STORAGE_SWITCH_VIEW, type);
    return type;
  }
}

export function generateRange(startNumber, untilNumber) {
  var range = "0";
  if (startNumber == untilNumber) range = startNumber.toString();
  else range = `${startNumber} - ${untilNumber}`;
  return range;
}

export function numberWithCommas(x) {
  return (x ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function currency(value, currency = "") {
  const thousand = localStorage.getItem(LOCAL_STORAGE_THOUSAND);
  const decimal = localStorage.getItem(LOCAL_STORAGE_DECIMAL);
  const prefix = currency == "" ? localStorage.getItem(LOCAL_STORAGE_PREFIX) : currency;
  const suffix = currency == "" ? localStorage.getItem(LOCAL_STORAGE_SUFFIX) : "";
  const scale = parseInt(localStorage.getItem(LOCAL_STORAGE_SCALE));
  const fixed = scale > 0 ? true : false;
  if (Number.isNaN(value) || value == null) return prefix + "0" + suffix;
  return (
    <NumberFormat
      value={value}
      thousandSeparator={thousand}
      decimalSeparator={decimal}
      prefix={prefix}
      suffix={suffix}
      decimalScale={scale}
      fixedDecimalScale={fixed}
      allowEmptyFormatting={true}
      displayType="text"
    />
  );
}

export function dateFormat(date) {
  if (date == null || date == "") return "-";
  return moment(date).format("MMMM Do YYYY, h:mm:ss a");
}

export function countDays(date) {
  if (date == null || date == "") return "-";
  const oneDay = 24 * 60 * 60 * 1000;
  var given = moment(date).toDate();
  var current = Date.now();
  return Math.round(Math.abs((given - current) / oneDay)) + " days";
}

export function dateTimeFormat(date) {
  if (date == null) return "-";
  return moment(date).format("LLLL");
}

export function dateTimeFormatInput(date) {
  if (date == null) return "-";
  return moment(date).format("YYYY-MM-DD h:mm:ss");
}

export function dateFormatInput(date) {
  if (date == null) return "-";
  return moment(date).format("YYYY-MM-DD");
}

export function dateExpired(date) {
  var date = new Date(date);
  var now = new Date();
  return now > date;
}

export function urlPhoto(url) {
  if (url == null || url == "") return "/images/empty.jpeg";
  return url;
}

//update DN
export function numberConvert(value) {
  const thousand = localStorage.getItem(LOCAL_STORAGE_THOUSAND);
  const prefix = localStorage.getItem(LOCAL_STORAGE_PREFIX);

  var val = "";
  if (!isNumber(val) || prefix != "") {
    val = value.toString();
    val = val.replaceAll(prefix, "");
  }
  if (thousand == ".") {
    val = val.replaceAll(".", "");
    val = val.replaceAll(",", ".");
  } else if (thousand == ",") {
    val = val.replaceAll(",", "");
  }

  return parseFloat(val);
}

export function checkNull(value) {
  if (value == null) {
    return "";
  } else {
    return value;
  }
}

export function checkDigitGenerator(serial) {
  const alpha = {
    A: 10,
    B: 12,
    C: 13,
    D: 14,
    E: 15,
    F: 16,
    G: 17,
    H: 18,
    I: 19,
    J: 20,
    K: 21,
    L: 23,
    M: 24,
    N: 25,
    O: 26,
    P: 27,
    Q: 28,
    R: 29,
    S: 30,
    T: 31,
    U: 32,
    V: 34,
    W: 35,
    X: 36,
    Y: 37,
    Z: 38,
  };
  const exponent = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512];

  var sum = 0;
  for (var i = 0; i < 10; i++) {
    if (i < 4) {
      var calc = alpha[serial.charAt(i)] * exponent[i];
      sum += calc;
    } else {
      var calc = parseInt(serial.charAt(i)) * exponent[i];
      sum += calc;
    }
  }
  var mul = Math.floor(sum / 11) * 11;
  var digit = sum - mul;
  if (digit == 10) {
    digit = 0;
  }
  return digit.toString();
}

export function getDateDaysBefore(numOfDays, date = new Date()) {
  const daysAgo = new Date(date.getTime());

  daysAgo.setDate(date.getDate() - numOfDays);

  return daysAgo;
}

export function onlyNumber(number) {
  const regex = /^[0-9\b]+$/;
  if (number === "" || regex.test(number)) {
    return number;
  }else{
    let updateStr = number.substring(0,number.length - 1)
    return updateStr;
  }
   
}
