import {
  Button,
  Card,
  Grid,
  InputBase,
  InputLabel,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  getDetailCustomerApi,
  insertFileCustomerNpwpApi,
} from "../../../services/api/customer.api";
import { getListCompanyTypeSwr } from "../../../services/swr/customer.swr";
import { CircularProgressCustom } from "../../base_component/spinner";
import { FileUploadSecureComponent } from "../../base_component/file-upload";

export default function CustomerForm(props) {
  /*Start Constanta*/
  const [formState, setFormState] = useState(null);
  const [companyTypeList, setCompanyTypeList] = useState([]);
  const [checkedLease, setCheckedLease] = useState(false);
  const [checkedSale, setCheckedSale] = useState(false);
  const [checkedService, setCheckedService] = useState(false);
  const [errorText, setErrorText] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [deposit, setDeposit] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [fileList, setFileList] = useState(null);
  const [fileUpload, setFileUpload] = useState({
    file_id: null,
    file_description: null,
    link: null,
    attachment: null,
    content_type: null,
    category_file: null,
  });

  const onUploaded = (res) => {
    if (res != null) {
      setFileUpload({
        ...fileUpload,
        file_description: document.getElementById("file_description").value,
        link: res.link,
        attachment: res.file_name,
        content_type: res.content_type,
        category_file: res.category_file,
        deleted_at: null,
      });
      fileListData.push({
        file_id: "",
        file_description: document.getElementById("file_description").value,
        link: res.link,
        attachment: res.attachment,
        content_type: res.content_type,
        category_file: res.category_file,
      });
    }
  };

  const getDesc = () => {
    if (document.getElementById("file_description").value != null) {
      setFileUpload({
        ...fileUpload,
        file_description: document.getElementById("file_description").value,
      });
    }
  };

  const getFileDelete = () => {
    if (document.getElementById("file_description").value != null) {
      setFileUpload({
        ...fileUpload,
        file_description: document.getElementById("file_description").value,
      });
    }
  };

  const sendFile = (id) => {
    insertFileCustomerNpwpApi(id, fileUpload).then((res) => {
      setFileList(res.customer_file);
      setFileUpload({
        file_id: null,
        file_description: null,
        link: null,
        attachment: null,
        content_type: null,
        category_file: null,
      });
      document.getElementById("file_description").value = "";
    });
  };

  const [data, setData] = useState({
    id: null,
    name: null,
    address: null,
    customer_code: null,
    company_type: null,
    company: null,
    phone_number: null,
    email: null,
    npwp_number: null,
    fax_number: null,
    customer_file: null,
  });

  /*End Constanta*/

  let companyTypeSwr = getListCompanyTypeSwr();

  /*Start useEffect*/

  useEffect(() => {
    if (companyTypeSwr?.data) {
      setCompanyTypeList(companyTypeSwr?.data?.result ?? []);
    }
  }, [companyTypeSwr]);

  useEffect(() => {
    if (props?.open) {
      if (props?.isEdit) {
        setFormState({
          name: props?.data?.name,
          company: props?.data?.company,
          address: props?.data?.address,
          phoneNumber: props?.data?.phone_number,
          company_type: props?.data?.company_type,
          customer_code: props?.data?.customer_code,
          email: props?.data?.email,
          npwp_number: props?.data?.npwp_number,
          fax_number: props?.data?.fax_number,
        });
      } else {
        setFormState({
          id: null,
          name: null,
          company: null,
          address: null,
          phoneNumber: null,
          company_type: null,
          customer_code: null,
          email: null,
          npwp_number: null,
          fax_number: null,
          customer_file: null,
        });
      }
    }
  }, [props?.open]);

  useEffect(async () => {
    try {
      let dataTrx = await getDetailCustomerApi(props?.data?.id);
      setFileList(dataTrx.customer_file);
    } catch (err) {
        console.log(err);
    }
  }, []);

  /*End useEffect*/

  function onChangeInput(e) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }

  const onInputChange = (e) => {
    if (e.target.name !== "") {
      setData({
        ...data,
        [e.target.name]: e.target.value,
      });
    }
  };

  function checkValidation() {
    return true;
  }

  // function sendData() {
  //   if (checkValidation()) {
  //     setLoading(true);
  //     let data = {
  //       ...props?.data,
  //       name: formState?.name,
  //       company: formState?.company,
  //       address: formState?.address,
  //       phone_number: formState?.phoneNumber,
  //       company_type: formState?.company_type,
  //       customer_code: formState?.customer_code,
  //       email: formState?.email,
  //
  {/*      // percent_sale_payment: formState?.percent_sale_payment,*/}
  //       // down_payment_sale: formState?.down_payment_sale,
  //       //
  //       // payment_service_description: formState?.payment_service_description,
  //       // payment_service_term: formState?.payment_service_term,
  //       // percent_service_payment: formState?.percent_service_payment,
  //
  //     };
  //     console.log(data)
  //     if (props?.isEdit) {
  //       updateCustomerApi(data, props?.data?.id)
  //         .then((res) => {
  //           setLoading(false);
  //           closeModal();
  //           props?.dataUpdated(res);
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //           setErrorText(err);
  //           setLoading(false);
  //         });
  //     } else {
  //       insertCustomerApi(data)
  //         .then((res) => {
  //           setLoading(false);
  //           closeModal();
  //           props?.dataInserted(res);
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //           setErrorText(err);
  //           setLoading(false);
  //         });
  //     }
  //   }
  // }

  const saveCustomer = () => {
    setLoading(true);
    let dataSave = {
      id: data.id,
      name: data.name,
      address: data.address,
      customer_code: data.customer_code,
      company_type: formState.company_type,
      company: data.company,
      phone_number: data.phone_number,
      email: data.email,
      npwp_number: data.npwp_number,
      fax_number: data.fax_number,
    };
    setLoading(false);
    closeModal()


    // insertCustomerApi(dataSave).then((res)=>{
    //   if (res === data.id) {
    //     alert('Data berhasil disave');
    //     setLoading(false);
    //     closeModal()
    //   }
    // });
  };

  function closeModal() {
    setLoading(false);
    setData(null);
    props?.closeModal();
  }

  return (
    <Modal
      open={props?.open}
      onClose={() => props?.closeModal()}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className="modal-wrapper" style={{ width: "700px" }}>
        <Card className="modal">
          <div className="modal-header">
            <h3>{props?.isEdit ? "Edit Customer" : "Add Customer"}</h3>
          </div>

          <div className="modal-content">
            <div className="mb-3 text-left">
              <InputLabel className="pb-1">
                <Typography variant="caption">Name</Typography>
              </InputLabel>
              <InputBase
                name="name"
                color="secondary"
                className="input"
                value={formState?.name}
                onChange={(e) => onInputChange(e)}
                fullWidth
              ></InputBase>
            </div>
            <div className="mb-3 text-left">
              <InputLabel className="pb-1">
                <Typography variant="caption">Company Type</Typography>
              </InputLabel>
              <TextField
                name="company_type"
                select
                variant="outlined"
                value={formState?.company_type}
                onChange={onChangeInput}
                fullWidth
              >
                <MenuItem value={""}>
                  <em>None</em>
                </MenuItem>
                {companyTypeList?.map((row, key) => {
                  return (
                    <MenuItem value={row.company_type}>
                      {row?.company_type} - {row?.name}
                    </MenuItem>
                  );
                })}
              </TextField>
            </div>
            <div className="mb-3 text-left">
              <InputLabel className="pb-1">
                <Typography variant="caption">Company</Typography>
              </InputLabel>
              <InputBase
                name="company"
                color="secondary"
                className="input"
                value={formState?.company}
                onChange={(e) => onInputChange(e)}
                fullWidth
              ></InputBase>
            </div>
            {/*<div className="mb-3 text-left">*/}
            {/*  <InputLabel className="pb-1">*/}
            {/*<Typography variant="caption">Customer Code</Typography>*/}
            {/*  </InputLabel>*/}
            {/*  <InputBase*/}
            {/*//     disabled*/}
            {/*    name="company"*/}
            {/*    color="secondary"*/}
            {/*    className="input"*/}
            {/*    value={formState?.customer_code}*/}
            {/*    fullWidth*/}
            {/*  ></InputBase>*/}
            {/*</div>*/}
            <div className="mb-3 text-left">
              <InputLabel className="pb-1">
                <Typography variant="caption">Address</Typography>
              </InputLabel>
              <InputBase
                name="address"
                color="secondary"
                className="input"
                value={formState?.address}
                // onChange={onInputChange}
                onChange={(e) => onInputChange(e)}
                fullWidth
                multiline={true}
              ></InputBase>
            </div>
            <div className="mb-3 text-left">
              <InputLabel className="pb-1">
                <Typography variant="caption">Phone Number</Typography>
              </InputLabel>
              <InputBase
                name="phone_number"
                color="secondary"
                className="input"
                value={formState?.phoneNumber}
                onChange={(e) => onInputChange(e)}
                fullWidth
              ></InputBase>
            </div>
            <div className="mb-3 text-left">
              <InputLabel className="pb-1">
                <Typography variant="caption">Email</Typography>
              </InputLabel>
              <InputBase
                name="email"
                color="secondary"
                className="input"
                value={formState?.email}
                onChange={(e) => onInputChange(e)}
                fullWidth
              ></InputBase>
            </div>
            <div className="mb-3 text-left">
              <InputLabel className="pb-1">
                <Typography variant="caption">Taxpayer Identification Number (NPWP)</Typography>
              </InputLabel>
              <InputBase
                  name="npwp_number"
                  color="secondary"
                  className="input"
                  value={formState?.npwp_number}
                  onChange={(e) => onInputChange(e)}
                  fullWidth
              ></InputBase>
            </div>
            <div className="mb-3 text-left">
              <InputLabel className="pb-1">
                <Typography variant="caption">Fax Number</Typography>
              </InputLabel>
              <InputBase
                  name="fax_number"
                  color="secondary"
                  className="input"
                  value={formState?.fax_number}
                  onChange={(e) => onInputChange(e)}
                  fullWidth
              ></InputBase>
            </div>
            <div className="mb-3 text-left">
              <Grid
                  container
                  spacing={2}
                  justify="center"
                  alignItems="center"
                  // className={classes.root}
              >
                <Grid item xs={6} sm={6}>
                  <TextField
                      name="file_description"
                      id="file_description"
                      label="Note"
                      variant="outlined"
                      // defaultValue={data.message}
                      // value={data.message}
                      required
                      // error={errorText.message}
                      // helperText={errorText.message}
                      // onChange={onInputChange}
                      fullWidth
                  />
                </Grid>
                <Grid item xs={5} sm={5}>
                  <FileUploadSecureComponent
                      id="image"
                      path="customer/npwp"
                      fileUploaded={(res) => onUploaded(res)}
                      url={fileUpload.link}
                      deleteFile={() => onUploaded(null)}
                  />
                </Grid>
                <Grid item xs={1} sm={1}>
                  <Button
                      variant="contained"
                      color="secondary"
                      onMouseEnter={() => getDesc()}
                      onFocus={() => getDesc()}
                      onClick={() => sendFile(props?.data?.id)}
                  >
                    Send
                  </Button>
                </Grid>
              </Grid>
            </div>
          </div>

          <div className="modal-footer">
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              // onClick={() => sendData()}
              onClick={() => saveCustomer()}
              disableElevation
            >
              {isLoading ? (
                <CircularProgressCustom size={26} />
              ) : props?.isEdit ? (
                "Edit Customer"
              ) : (
                "Add Customer"
              )}
            </Button>
          </div>
        </Card>
      </div>
    </Modal>
  );
}
