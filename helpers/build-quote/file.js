import { downloadFileSecApi } from "../../services/api/file.api";

export const downloadFileProcess = async (link) => {
  try {
    var response = await downloadFileSecApi(link);
    if (response.status == 200) {
      var reader = response.body.getReader();
      var contenttype = response.headers.get("Content-Type");
      var chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        chunks.push(value);
      }

      var content = new Blob(chunks, { type: contenttype });
      var url = window.URL.createObjectURL(content);
      var tmpLink = document.createElement("a");
      tmpLink.href = url;
      tmpLink.setAttribute("target", "_blank");
      tmpLink.click();
    }
  } catch (err) {
    console.log(err);
  }
};
