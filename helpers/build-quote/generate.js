import { getSerialUnitcodeApi } from "../../services/api/container-number.api";
//https://www.bic-code.org/bic-codes/tihu/
export const generateSerial = async (
  unitCode,
  ral_colour,
  countData,
  series,
  prefix
) => {
  try {
    var getData = await getSerialUnitcodeApi(unitCode, series, prefix);

    var dataUpdate = [];
    if (getData.count > 0) {
      var startNum = "";
      var endNum = "";
      var flag0 = false;
      var id = getData.result[0].id;
      var prefix = getData.result[0].prefix;
      var series = getData.result[0].series;
      var lastNumber = getData.result[0].last_number;
      if (lastNumber == 0 && getData.result[0].used == false) {
        lastNumber = -1;
        flag0 = true;
      }

      var qty = parseInt(countData);
      var endNumber = lastNumber + qty;
      endNum = getDigit(prefix, series, endNumber.toString());

      var numChar = "";
      var numberChar = "";
      var serialNumber = "";

      for (var i = 1; i <= qty; i++) {
        lastNumber = lastNumber + 1;
        numChar = lastNumber.toString();
        serialNumber = getDigit(prefix, series, numChar);
        if (lastNumber == getData.result[0].last_number + 1) {
          startNum = serialNumber;
        }
        if (flag0) {
          serialNumber = prefix + series + "0000";
          startNum = serialNumber;
        }
        dataUpdate.push({
          id: id,
          serial_start: startNum,
          serial_end: endNum,
          container_number: serialNumber,
        });
      }
    }
    if (dataUpdate != null) {
      return dataUpdate;
    } else {
      return false;
    }
  } catch (err) {
    throw err;
  }
};

export const genSerialFrCustom = (serialStart, countData) => {
  try {
    var dataUpdate = [];
    var id = "";
    var prefix = serialStart.substring(0, 4);
    var series = serialStart.substring(4, 10);

    var lastNumber = series;

    var startNum = "";
    var endNum = "";
    var countQty = parseInt(countData) - 1;

    var endNumber = parseInt(lastNumber) + countQty;
    endNum = getDigit6(prefix, endNumber.toString());
    if (countQty < 1) {
      countQty = 1;
      var endNumber = parseInt(lastNumber) + 0;
      endNum = getDigit6(prefix, endNumber.toString());
    }

    if (lastNumber == 0 && countQty == 1) {
      var endNumber = parseInt(lastNumber) + 0;
      endNum = getDigit6(prefix, endNumber.toString());
    }

    var numChar = "";
    var numberChar = "";
    var serialNumber = "";

    for (var i = 1; i <= countQty; i++) {
      lastNumber = lastNumber + 1;
      numChar = lastNumber.toString();
      serialNumber = getDigit6(prefix, numChar);

      dataUpdate.push({
        id: null,
        serial_start: serialStart,
        serial_end: endNum,
        container_number: serialNumber,
      });
    }

    if (dataUpdate != null) {
      return dataUpdate;
    } else {
      return false;
    }
  } catch (err) {
    throw err;
  }
};

function getDigit(prefix, series, numChar) {
  var numberChar = "";
  if (numChar.length == 4) {
    numberChar = numChar;
  }
  if (numChar.length == 3) {
    numberChar = "0" + numChar;
  }
  if (numChar.length == 2) {
    numberChar = "00" + numChar;
  }
  if (numChar.length == 1) {
    numberChar = "000" + numChar;
  }
  var serialNumber = prefix + series + numberChar;
  return serialNumber;
}

function getDigit6(prefix, numChar) {
  var numberChar = "";
  if (numChar.length == 6) {
    numberChar = numChar;
  }
  if (numChar.length == 5) {
    numberChar = "0" + numChar;
  }
  if (numChar.length == 4) {
    numberChar = "00" + numChar;
  }
  if (numChar.length == 3) {
    numberChar = "000" + numChar;
  }
  if (numChar.length == 2) {
    numberChar = "0000" + numChar;
  }
  if (numChar.length == 1) {
    numberChar = "00000" + numChar;
  }
  var serialNumber = prefix + numberChar;
  return serialNumber;
}
