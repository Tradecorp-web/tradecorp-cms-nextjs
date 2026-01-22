import {
  TextField,
  Modal,
  Card,
  Box,
  Grid,
  Button,
  IconButton,
} from "@material-ui/core";
import { Delete, Add, CallToAction } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import { Autocomplete } from "@material-ui/lab";

import {
  CekSpecValueApi,
  getSpecificationApi,
} from "../../../services/api/ref-specificaton.api";
import { getSpecificationSwr } from "../../../services/swr/ref-specification.swr";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
}));

import { v4 as uuid } from "uuid";

export default function SpecificationForm(props) {
  const classes = useStyles();
  const [data, setData] = useState(false);
  const [otherSpec, setOtherSpec] = useState(false);
  const [specList, setSpecList] = useState([
    {
      specification_id: null,
      specification: null,
    },
  ]);

  var reference = [];
  const clickAddRow = () => {
    if (typeof specList === "undefined") {
      setSpecList([
        {
          specification_id: null,
          specification: null,
        },
      ]);
    } else {
      setSpecList([
        ...specList,
        {
          specification_id: null,
          specification: null,
        },
      ]);
    }
  };
  const clickRemoveRow = (i) => {
    var list = [...specList];
    list.splice(i, 1);
    setSpecList(list);
  };

  // var dataCSpec = props.specListData;

  const handleClose = () => {
    var dataSend = {
      container_specification: specList,
      other_specification: otherSpec,
    };
    // setSpecList([
    //   {
    //     specification_id: null,
    //     specification: null,
    //   },
    // ]);

    // setOtherSpec(null);
    props.specData(dataSend, props?.keyRow);
  };

  const refSpecChange = (value, key) => {
    if (value != null) {
      var list = [...specList];
      list[key]["specification_id"] = uuid();
      list[key]["specification"] = value.toUpperCase();
      setSpecList(list);
    }
  };
  const otherSpecChange = (e) => {
    setOtherSpec(e.target.value);
  };

  var specSwr = getSpecificationSwr();

  getSpec();
  useEffect(() => {
    getSpec();
  }, [specSwr]);

  useEffect(() => {
    if (props?.specListData?.container_specifications != null) {
      setSpecList(props?.specListData?.container_specifications);
    }

    setOtherSpec(props?.specListData?.other_specification);
  }, [props?.open]);

  function getSpec() {
    reference = [];
    specSwr?.data?.result?.map((res) => {
      reference.push({
        title: res.ref_specification,
      });
    });
  }

  return (
    <Modal open={props?.open}>
      <Box className="modal-wrapper" style={{ width: "1000px" }}>
        <Card className="modal">
          <Box className="modal-header">
            <h3>Container Specification</h3>
          </Box>
          <Box className="modal-content">
            {specList?.map((res, key) => (
              <Grid container spacing={0} justify="center" alignItems="center">
                <React.Fragment>
                  <Grid item xs={11}>
                    <Autocomplete
                      onChange={(event, newValue) => {
                        refSpecChange(newValue, key);
                      }}
                      value={specList[key].specification}
                      freeSolo
                      options={reference?.map((option) => option.title)}
                      inputProps={{ style: { textTransform: "uppercase" } }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={"Specification " + (key + 1)}
                          margin="normal"
                          variant="outlined"
                          id="specification"
                          name="specification"
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    ></Autocomplete>
                  </Grid>
                  <Grid item xs={1} sm={1}>
                    {key != 0 && (
                      <IconButton>
                        <Delete onClick={() => clickRemoveRow(key)} />
                      </IconButton>
                    )}
                  </Grid>
                </React.Fragment>
              </Grid>
            ))}
            <Grid container spacing={0} justify="center" alignItems="center">
              <Grid item xs={12} sm={12}>
                <Button variant="outlined" color="secondary">
                  <Add onClick={() => clickAddRow()} />
                </Button>
              </Grid>
            </Grid>

            <Grid container style={{ marginTop: 20 }}>
              <Grid item xs={12}>
                <TextField
                  label="Other Specification"
                  name="other_specification"
                  value={otherSpec}
                  id="other_specification"
                  variant="outlined"
                  onChange={(e) => otherSpecChange(e)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  multiline
                  rows={4}
                  fullWidth
                  inputProps={{ style: { textTransform: "uppercase" } }}
                />
              </Grid>
            </Grid>
          </Box>
          <Box className="modal-footer">
            <Button
              variant="outlined"
              onClick={handleClose}
              color="primary"
              autoFocus
            >
              Close
            </Button>
          </Box>
        </Card>
      </Box>
    </Modal>
  );
}
