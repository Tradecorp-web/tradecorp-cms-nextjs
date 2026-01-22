import {
  Button,
  makeStyles,
  Modal,
  Box,
  Card,
  TextField,
  Grid,
  Typography,
  InputLabel,
} from "@material-ui/core";
import { useState, useEffect } from "react";

import {
  FileUploadSecureComponent,
  DropZoneComponent,
} from "../../base_component/file-upload";

import AlertDialog from "../../base_component/dialog";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
}));

export default function UploadForm(props) {
  /**[{"file_id":"b3ab14e7-644d-4041-bf1e-d3862694d1d8",
   * "file_description":"company_logo","user_upload":"",
   * "send_date":"2023-02-23T14:20:26Z",
   * "attachment":"company_logo_container_number_generate-tesss.xlsx",
   * "link":"https://tradecorp-bucket.s3-ap-southeast-1.amazonaws.com/test/order_quote/company_logo/aef3ebf7e7ab288710a3de8a0b62b1d8202323142013container_number_generate-tesss.xlsx","content_type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","thumbnail":""},{"file_id":"d2cee379-3666-4913-9f5b-1f88b32ad1b5","file_description":"csc_certified","user_upload":"","send_date":"2023-02-23T14:20:26Z","attachment":"csc_certified_check-document.xls","link":"https://tradecorp-bucket.s3-ap-southeast-1.amazonaws.com/test/order_quote/csc_certified/278915cf76bbc05e405cf6c73c5a483b202323142018check-document.xls","content_type":"application/vnd.ms-excel","thumbnail":""}] */
  // props?.uploadListData?.map((res) => {
  //   alert(JSON.stringify(res));
  // });

  const classes = useStyles();
  const [data, setData] = useState(false);

  const [sendDialog, setSendDialog] = useState(false);
  const [listFile, setListFile] = useState(false);
  const [fileUpOther, setFileUpOther] = useState({
    label: null,
    content_type: null,
    link: null,
    thumbnail: null,
  });
  const [fileUpload, setFileUpload] = useState({
    file_id: null,
    file_description: null,
    link: null,
    attachment: null,
    content_type: null,
  });
  const [fileUpCompLogo, setFileUpCompLogo] = useState({
    file_id: null,
    file_description: null,
    link: null,
    attachment: null,
    content_type: null,
  });
  const [fileUpCsc, setFileUpCsc] = useState({
    file_id: null,
    file_description: null,
    link: null,
    attachment: null,
    content_type: null,
  });

  const closeForm = () => {
    // props?.uploadData(data, props?.keyRow);
    // props?.closeModal();
  };

  useEffect(() => {
    setFileUpCsc({
      file_description: null,
      link: null,
      attachment: null,
      content_type: null,
    });
    setFileUpCompLogo({
      file_description: null,
      link: null,
      attachment: null,
      content_type: null,
    });
  }, [props?.open]);
  // useEffect(() => {
  //   setListFile(props?.uploadOtherListData);
  //   alert(JSON.stringify(props?.uploadOtherListData));
  // });
  useEffect(() => {
    var images = [];

    if (Array.isArray(props?.uploadListData?.fileData)) {
      props?.uploadListData?.fileData?.map((item, i) => {
        images.push({
          name: item.attachment,
          progress: 100,
          link: item.link,
          content_type: item.content_type,
          loading: -1,
        });
      });
    }
    if (Array.isArray(props?.uploadOtherListData?.otherFileData)) {
      props?.uploadOtherListData?.otherFileData?.map((item, i) => {
        images.push({
          name: item.label,
          progress: 100,
          link: item.link,
          content_type: item.content_type,
          loading: -1,
        });
      });
    }
    setListFile(images);
  }, [props?.open]);
  const reg = () => {
    props.uploadData(data);
  };
  const getData = (e) => {
    setData(e.target.value);
  };

  const onUploaded = (res, fileInfo) => {
    if (res != null) {
      if (fileInfo == "company_logo") {
        setFileUpCompLogo({
          ...fileUpCompLogo,
          file_description: fileInfo,
          link: res.link,
          attachment: fileInfo + "_" + res.file_name,
          content_type: res.content_type,
          deleted_at: null,
        });
        setData({
          ...data,
          // company_logo_file: {
          file_description: fileInfo,
          link: res.link,
          attachment: fileInfo + "_" + res.file_name,
          content_type: res.content_type,
          deleted_at: null,
          // },
        });
      } else {
        setFileUpCsc({
          ...fileUpCsc,
          file_description: fileInfo,
          link: res.link,
          attachment: fileInfo + "_" + res.file_name,
          content_type: res.content_type,
          deleted_at: null,
        });
        setData({
          ...data,
          // csc_plate_file: {
          file_description: fileInfo,
          link: res.link,
          attachment: fileInfo + "_" + res.file_name,
          content_type: res.content_type,
          deleted_at: null,
          // },
        });
      }
    } else {
      if (fileInfo == "company_logo") {
        setFileUpCompLogo({
          ...fileUpCompLogo,
          file_description: null,
          link: null,
          attachment: null,
          content_type: null,
          deleted_at: null,
        });
        // setData({
        //   ...data,
        //   company_logo_file: {},
        // });
      } else {
        setFileUpCsc({
          ...fileUpCsc,
          file_description: null,
          link: null,
          attachment: null,
          content_type: null,
          deleted_at: null,
        });
        // setData({
        //   ...data,
        //   csc_plate_file: {},
        // });
      }
    }
  };
  const onChangeUpload = (res, name) => {
    var result = [];
    res?.map((row, i) => {
      result.push({
        label: row.name,
        content_type: row.content_type,
        link: row.link,
        thumbnail: null,
      });
    });
    setFileUpOther({ ...fileUpOther, other_order_quote_files: result });

    //setData({ ...data, [name]: result });
  };

  const saveUploadFile = () => {
    var order_quote_files = [];
    if (fileUpCompLogo.link != null) {
      order_quote_files.push(fileUpCompLogo);
    }
    if (fileUpCsc.link != null) {
      order_quote_files.push(fileUpCsc);
    }

    // var other_order_quote_files = [];
    // other_order_quote_files.push(fileUpOther);
    setData({
      order_quote_files,
    });

    setSendDialog(true);
  };

  const sendUpload = () => {
    props.uploadData(data, props?.keyRow);
    props.uploadOtherData(fileUpOther, props?.keyRow);
    setSendDialog(false);
  };

  return (
    <Modal open={props?.open} onClose={closeForm}>
      <Box className="modal-wrapper" style={{ width: "1000px" }}>
        <Card className="modal">
          <Box className="modal-header">
            <h3>Document Upload</h3>

            {/* <TextField onClick={(e) => getData(e)}></TextField>
            <Button onClick={reg}>Register</Button> */}
          </Box>
          <Box className="modal-content">
            <Grid container style={{ marginTop: 10 }}>
              <Grid item xs={4}>
                <Typography
                  variant="body2"
                  style={{ fontWeight: "bold", fontSize: ".8em" }}
                  color="textSecondary"
                  component="p"
                >
                  Upload Company Logo
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <FileUploadSecureComponent
                  label="Company Logo"
                  id="company_logo"
                  path="order_quote/company_logo"
                  fileUploaded={(res) => onUploaded(res, "company_logo")}
                  url={fileUpCompLogo.link}
                  deleteFile={() => onUploaded(null, "company_logo")}
                />
              </Grid>
            </Grid>
            <Grid container style={{ marginTop: 10 }}>
              <Grid item xs={4}>
                <Typography
                  variant="body2"
                  style={{ fontWeight: "bold", fontSize: ".8em" }}
                  color="textSecondary"
                  component="p"
                >
                  Upload CSC
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <FileUploadSecureComponent
                  label="CSC Certified"
                  id="csc_certified"
                  path="order_quote/csc_certified"
                  fileUploaded={(res) => onUploaded(res, "csc_certified")}
                  url={fileUpCsc.link}
                  deleteFile={() => onUploaded(null, "csc_certified")}
                />
              </Grid>
            </Grid>
            <Grid container style={{ marginTop: 10 }}>
              <Grid item xs={12}>
                <InputLabel shrink={true}>Images / Files</InputLabel>
                <DropZoneComponent
                  id="images"
                  exportList={(res) =>
                    onChangeUpload(res, "other_order_quote_files")
                  }
                  data={listFile}
                  // data={[
                  //   {
                  //     name: "check-document.xls",
                  //     progress: 100,
                  //     link: "https://tradecorp-bucket.s3-ap-southeast-1.amazonaws.com/test/order_quote/4356e10a3f947bb6e904b7db2b3d74b3202323145517check-document.xls",
                  //     content_type: "application/vnd.ms-excel",
                  //     loading: -1,
                  //   },
                  // ]}
                  path="order_quote"
                />
              </Grid>
            </Grid>
          </Box>
          <Box className="modal-footer">
            {" "}
            <Button
              variant="outlined"
              onClick={saveUploadFile}
              color="primary"
              autoFocus
            >
              Close
            </Button>
          </Box>
        </Card>
        <AlertDialog
          open={sendDialog}
          cancelAction={() => setSendDialog(false)}
          okAction={() => sendUpload()}
          title="Close confirmation"
          body="Close upload form ?"
        />
      </Box>
    </Modal>
  );
}
