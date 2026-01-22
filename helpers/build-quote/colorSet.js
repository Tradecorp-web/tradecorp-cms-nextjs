import { getColorListApi } from "../../services/api/color-codes.api";
import { getListMasterSerialApi } from "../../services/api/master-serial.api";

export const getColor = async () => {
  try {
    var getData = await getColorListApi("", "name_english");

    dataColor = [];

    dataColor.push({
      ral_code: "Miscellaneous",
      rgb: null,
      html_code: null,
      name_german: null,
      name_english: "Miscellaneous",
      name_french: null,
      name_spanish: null,
      name_italian: null,
      name_nederlands: null,
      unit_link: null,
      series: -1,
    });

    dataColor.push({
      ral_code: "All Colours",
      rgb: null,
      html_code: null,
      name_german: null,
      name_english: "All Colours",
      name_french: null,
      name_spanish: null,
      name_italian: null,
      name_nederlands: null,
      unit_link: null,
      series: -1,
    });

    getData?.result?.map((res) => {
      dataColor.push({
        ral_code: res?.ral_code,
        rgb: null,
        html_code: res?.html_code,
        name_german: null,
        name_english: res?.name_english,
        name_french: null,
        name_spanish: null,
        name_italian: null,
        name_nederlands: null,
        unit_link: null,
        series: -1,
      });
    });

    return dataColor;
  } catch (err) {
    throw err;
  }
};
