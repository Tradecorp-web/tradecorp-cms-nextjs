import {
  Button,
  Card,
  Icon,
  IconButton,
  Tooltip,
  InputBase,
  Link,
  makeStyles,
  Typography,
  Box,
  LinearProgress,
  CircularProgress,
} from "@material-ui/core";
import React, { useState } from "react";
import {
  uploadFileApi,
  uploadFileDocApi,
  deleteFileApi,
  uploadFileSecApi,
  downloadFileSecApi,
  uploadFileSecListenerApi,
  uploadFileImageApi,
} from "../../services/api/file.api";
import { CircularProgressCustom } from "./spinner";
import { DropzoneArea } from "material-ui-dropzone";

const useStyles = makeStyles((theme) => ({
  linkFile: {
    color: "#7e61ef",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  fusBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
    borderRadius: 4,
    "&:hover": {
      borderColor: "rgba(0,0,0,0.87)",
    },
  },
  dzBox: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
    borderRadius: 4,
    padding: 2,
    "&:hover": {
      borderColor: "rgba(0,0,0,0.87)",
    },
  },
  dzProgress: {
    marginTop: 5,
    marginBottom: 5,
  },
  dzFlex: {
    display: "flex",
    paddingTop: 5,
    paddingBottom: 5,
  },
  dzFlex2: {
    display: "flex",
    paddingTop: 0,
    paddingBottom: 0,
  },
  dzMgLeft: {
    marginLeft: 12,
  },
  dzMgLeft2: {
    marginLeft: 2,
  },
  dzPbar: {
    display: "inline-flex",
    position: "relative",
  },
  dzPbar2: {
    display: "flex",
    justifyContent: "center",
    position: "absolute",
  },
}));

export function FileUploadComponent1({
  id,
  fileUploaded,
  url,
  path,
  deleteFile,
}) {
  const classes = useStyles();

  const [isLoading, setLoading] = useState(false);

  const uploadFileProccess = async (e) => {
    const file = e.target.files[0];
    path = path ?? "general";
    setLoading(true);
    try {
      var response = await uploadFileApi(path, file);
      setLoading(false);
      fileUploaded(response);
      document.getElementById(id).value = null;
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const deleteFileProcess = async (link) => {
    setLoading(true);
    try {
      var response = await deleteFileApi(link);
      setLoading(false);
      deleteFile();
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <Card variant="outlined" className="display-space-between">
      <div className="flex-center">
        <Button
          variant="contained"
          disableElevation
          className="me-3"
          style={{ borderRadius: 0, width: 130 }}
          onClick={() => document.getElementById(id).click()}
        >
          <Icon style={{ fontSize: 16 }} className="me-1">
            upload
          </Icon>
          Select File
        </Button>
        <div
          style={{
            overflow: "hidden",
            flexGrow: 1,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            width: "calc(100% - 220px)",
          }}
        >
          {url != null && url != "" && (
            <Link
              target="_blank"
              className={classes.linkFile}
              href={url}
              rel="noopener noreferrer"
            >
              <small className={url == null ? "text-muted" : ""}>
                <strong>Open File</strong>
              </small>
            </Link>
          )}
          {(url == null || url == "") && (
            <small className="text-muted">Upload File</small>
          )}
        </div>
      </div>
      <div>
        {url != null && url != "" && !isLoading && (
          <Tooltip title="Delete File" placement="top">
            <IconButton
              onClick={() => deleteFileProcess(url)}
              size="small"
              className="ms-2"
            >
              <Icon>close</Icon>
            </IconButton>
          </Tooltip>
        )}
        {isLoading && (
          <div className="me-2">
            <CircularProgressCustom size={24} />
          </div>
        )}
      </div>
      <InputBase
        onChange={uploadFileProccess}
        style={{ display: "none" }}
        id={id}
        type="file"
        accept="image/png, image/jpeg"
      />
    </Card>
  );
}

export function FileViewComponent1({
  id,
  name,
  url,
  path,
  fileUploaded,
  deleteFile,
}) {
  const [isLoading, setLoading] = useState(false);

  const uploadFileProccess = async (e) => {
    const file = e.target.files[0];
    path = path ?? "general";
    try {
      console.log(path);
      console.log(file);
      var response = await uploadFileApi(path, file);
      fileUploaded(response);
      document.getElementById(id).value = null;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card variant="outlined" className="p-3 display-space-between">
      <div>{name}</div>
      <div>
        {url != null && url != "" && (
          <Tooltip title="Open File" placement="top">
            <Link href={url} target="_blank">
              <IconButton className="ms-3" size="small">
                <Icon>open_in_new</Icon>
              </IconButton>
            </Link>
          </Tooltip>
        )}
        {url != null && url != "" && (
          <Tooltip title="Delete File" placement="top">
            <IconButton
              color="primary"
              className="ms-3"
              size="small"
              onClick={() => deleteFile()}
            >
              <Icon>close</Icon>
            </IconButton>
          </Tooltip>
        )}
        {(url == null || url == "") && (
          <div>
            {isLoading && <CircularProgressCustom size={24} />}
            {!isLoading && (
              <Tooltip title="Select File" placement="top">
                <Button
                  variant="contained"
                  disableElevation
                  size="small"
                  onClick={() => document.getElementById(id).click()}
                >
                  <Icon style={{ fontSize: 16 }} className="me-1">
                    upload
                  </Icon>
                  Select File
                </Button>
              </Tooltip>
            )}
          </div>
        )}
      </div>
      <InputBase
        onChange={uploadFileProccess}
        style={{ display: "none" }}
        id={id}
        type="file"
        accept="image/png, image/jpeg"
      />
    </Card>
  );
}

export function ImageUploadArea({ id, fileUploaded, url, path }) {
  const [isLoading, setLoading] = useState(false);

  const uploadFileProccess = async (e) => {
    const file = e.target.files[0];
    path = path ?? "general";
    setLoading(true);
    try {
      var response = await uploadFileApi(path, file);
      setLoading(false);
      fileUploaded(response);
      document.getElementById(id).value = null;
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <Card
      className="text-center mb-5 p-5"
      variant="outlined"
      style={{
        height: 300,
        justifyContent: "space-between",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexGrow: 1, alignItems: "center" }}>
        {url == null && (
          <Icon style={{ fontSize: 100, color: "#ddd" }}>image</Icon>
        )}
        {url != null && (
          <img
            src={url}
            style={{ width: 100, height: 100, objectFit: "contain" }}
          />
        )}
      </div>
      <Button
        variant="contained"
        onClick={() => document.getElementById(id).click()}
        disableElevation
      >
        {isLoading ? <CircularProgressCustom size={26} /> : "Select Image"}
      </Button>
      <InputBase
        onChange={uploadFileProccess}
        style={{ display: "none" }}
        id={id}
        type="file"
        accept="image/png, image/jpeg"
      />
    </Card>
  );
}

export function FileDocLinkUploadComponent({
  id,
  fileUploaded,
  url,
  path,
  deleteFile,
}) {
  const classes = useStyles();

  const [isLoading, setLoading] = useState(false);

  const uploadFileProccess = async (e) => {
    const file = e.target.files[0];
    path = path ?? "general";
    setLoading(true);
    try {
      var response = await uploadFileDocApi(path, file);
      setLoading(false);
      fileUploaded(response);
      document.getElementById(id).value = null;
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const deleteFileProcess = async (link) => {
    setLoading(true);
    try {
      var response = await deleteFileApi(link);
      setLoading(false);
      deleteFile();
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <Card variant="outlined" className="display-space-between">
      <div className="flex-center">
        <Button
          variant="contained"
          disableElevation
          className="me-3"
          style={{ borderRadius: 0, width: 130 }}
          onClick={() => document.getElementById(id).click()}
        >
          <Icon style={{ fontSize: 16 }} className="me-1">
            upload
          </Icon>
          Select File
        </Button>
        <div
          style={{
            overflow: "hidden",
            flexGrow: 1,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            width: "calc(100% - 220px)",
          }}
        >
          {url != null && url != "" && (
            <Link
              target="_blank"
              className={classes.linkFile}
              href={url}
              rel="noopener noreferrer"
            >
              <small className={url == null ? "text-muted" : ""}>
                <strong>Open File</strong>
              </small>
            </Link>
          )}
          {(url == null || url == "") && (
            <small className="text-muted">Upload File</small>
          )}
        </div>
      </div>
      <div>
        {url != null && url != "" && !isLoading && (
          <Tooltip title="Delete File" placement="top">
            <IconButton
              onClick={() => deleteFileProcess(url)}
              size="small"
              className="ms-2"
            >
              <Icon>close</Icon>
            </IconButton>
          </Tooltip>
        )}
        {isLoading && (
          <div className="me-2">
            <CircularProgressCustom size={24} />
          </div>
        )}
      </div>
      <InputBase
        onChange={uploadFileProccess}
        style={{ display: "none" }}
        id={id}
        type="file"
        accept="image/png, image/jpeg"
      />
    </Card>
  );
}

export function FileDocNoLinkUploadComponent({
  id,
  fileUploaded,
  url,
  path,
  deleteFile,
}) {
  const classes = useStyles();

  const [isLoading, setLoading] = useState(false);
  const [filename, setFilename] = useState(null);

  const uploadFileProccess = async (e) => {
    const file = e.target.files[0];
    path = path ?? "general";
    setLoading(true);
    try {
      var response = await uploadFileDocApi(path, file);
      setFilename(response.file_name);
      setLoading(false);
      fileUploaded(response);
      document.getElementById(id).value = null;
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const deleteFileProcess = async (link) => {
    setLoading(true);
    try {
      var response = await deleteFileApi(link);
      setLoading(false);
      deleteFile();
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <Card variant="outlined" className="display-space-between">
      <div className="flex-center">
        <Button
          variant="contained"
          disableElevation
          className="me-3"
          style={{ borderRadius: 0, width: 130 }}
          onClick={() => document.getElementById(id).click()}
        >
          <Icon style={{ fontSize: 16 }} className="me-1">
            upload
          </Icon>
          Select File
        </Button>
        <div
          style={{
            overflow: "hidden",
            flexGrow: 1,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            width: "calc(100% - 220px)",
          }}
        >
          {url != null && url != "" && (
            <small className={url == null ? "text-muted" : ""}>
              <strong>{filename}</strong>
            </small>
          )}
          {(url == null || url == "") && (
            <small className="text-muted">Upload File</small>
          )}
        </div>
      </div>
      <div>
        {url != null && url != "" && !isLoading && (
          <Tooltip title="Delete File" placement="top">
            <IconButton
              onClick={() => deleteFileProcess(url)}
              size="small"
              className="ms-2"
            >
              <Icon>close</Icon>
            </IconButton>
          </Tooltip>
        )}
        {isLoading && (
          <div className="me-2">
            <CircularProgressCustom size={24} />
          </div>
        )}
      </div>
      <InputBase
        onChange={uploadFileProccess}
        style={{ display: "none" }}
        id={id}
        type="file"
        accept="image/png, image/jpeg"
      />
    </Card>
  );
}

export function FileUploadSecureComponent({
  id,
  fileUploaded,
  url,
  path,
  deleteFile,
  mime,
}) {
  const classes = useStyles();

  const [isLoading, setLoading] = useState(false);

  mime = mime ?? "*";

  const uploadFileProccess = async (e) => {
    const file = e.target.files[0];
    path = path ?? "general";
    setLoading(true);
    try {
      if (url != null && url != "") {
        await deleteFileApi(url);
      }
      var response = await uploadFileSecApi(path, file);
      setLoading(false);
      fileUploaded(response);
      document.getElementById(id).value = null;
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const deleteFileProcess = async (link) => {
    setLoading(true);
    try {
      var response = await deleteFileApi(link);
      setLoading(false);
      deleteFile();
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const downloadFileProcess = async (link) => {
    setLoading(true);
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
        setLoading(false);
        var content = new Blob(chunks, { type: contenttype });
        var url = window.URL.createObjectURL(content);
        var tmpLink = document.createElement("a");
        tmpLink.href = url;
        tmpLink.setAttribute("target", "_blank");
        tmpLink.click();
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <Card variant="outlined" className={classes.fusBox}>
      <div className="flex-center">
        <Button
          variant="contained"
          disableElevation
          className="me-3"
          style={{ borderRadius: 0, width: 130 }}
          onClick={() => document.getElementById(id).click()}
        >
          <Icon style={{ fontSize: 16 }} className="me-1">
            upload
          </Icon>
          Select File
        </Button>
        <div
          style={{
            overflow: "hidden",
            flexGrow: 1,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            width: "calc(100% - 220px)",
          }}
        >
          {url != null && url != "" && (
            <Link
              className={classes.linkFile}
              onClick={() => downloadFileProcess(url)}
              rel="noopener noreferrer"
            >
              <small className={url == null ? "text-muted" : ""}>
                <strong>Open File</strong>
              </small>
            </Link>
          )}
          {(url == null || url == "") && (
            <small className="text-muted">Upload File</small>
          )}
        </div>
      </div>
      <div>
        {url != null && url != "" && !isLoading && (
          <Tooltip title="Delete File" placement="top">
            <IconButton
              onClick={() => deleteFileProcess(url)}
              size="small"
              className="ms-2"
            >
              <Icon>close</Icon>
            </IconButton>
          </Tooltip>
        )}
        {isLoading && (
          <div className="me-2">
            <CircularProgressCustom size={24} />
          </div>
        )}
      </div>
      <InputBase
        onChange={uploadFileProccess}
        style={{ display: "none" }}
        id={id}
        type="file"
        accept={mime}
      />
    </Card>
  );
}

export function FileUploadImageComponent({
  id,
  fileUploaded,
  url,
  path,
  deleteFile,
  thumbnail,
}) {
  const classes = useStyles();

  const [isLoading, setLoading] = useState(false);
  const [href, setHref] = useState(url);
  const [thumb, setThumb] = useState(thumbnail);

  const uploadFileProccess = async (e) => {
    const file = e.target.files[0];
    path = path ?? "general";
    setLoading(true);
    try {
      if (href != null && href != "") {
        await deleteFileApi(href);
      }
      var response = await uploadFileImageApi(path, file);
      setLoading(false);
      setHref(response.link);
      setThumb(response.thumbnail);
      fileUploaded(response);
      document.getElementById(id).value = null;
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const deleteFileProcess = async (link) => {
    setLoading(true);
    try {
      var response = await deleteFileApi(link);
      setHref(null);
      setThumb(null);
      setLoading(false);
      deleteFile();
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const downloadFileProcess = async (link) => {
    setLoading(true);
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
        setLoading(false);
        var content = new Blob(chunks, { type: contenttype });
        var url = window.URL.createObjectURL(content);
        var tmpLink = document.createElement("a");
        tmpLink.href = url;
        tmpLink.setAttribute("target", "_blank");
        tmpLink.click();
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <Card variant="outlined" className={classes.fusBox}>
      <Box className="flex-center">
        <Button
          variant="contained"
          disableElevation
          className="me-3"
          style={{ borderRadius: 0, width: 130 }}
          onClick={() => document.getElementById(id).click()}
        >
          <Icon style={{ fontSize: 16 }} className="me-1">
            upload
          </Icon>
          Select File
        </Button>
        <Box
          style={{
            overflow: "hidden",
            flexGrow: 1,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            width: "calc(100% - 220px)",
          }}
        >
          {href != null && href != "" && (
            <Link
              className={classes.linkFile}
              onClick={() => downloadFileProcess(href)}
              rel="noopener noreferrer"
            >
              <img src={`data:image/jpeg;base64,${thumb}`} />
            </Link>
          )}
          {(href == null || href == "") && (
            <small className="text-muted">Upload File</small>
          )}
        </Box>
      </Box>
      <Box>
        {href != null && href != "" && !isLoading && (
          <Tooltip title="Delete File" placement="top">
            <IconButton
              onClick={() => deleteFileProcess(href)}
              size="small"
              className="ms-2"
            >
              <Icon>close</Icon>
            </IconButton>
          </Tooltip>
        )}
        {isLoading && (
          <Box className="me-2">
            <CircularProgressCustom size={24} />
          </Box>
        )}
      </Box>
      <InputBase
        onChange={uploadFileProccess}
        style={{ display: "none" }}
        id={id}
        type="file"
        accept="image/*"
      />
    </Card>
  );
}

export function DropZoneComponent({
  id,
  exportList,
  data=[],
  path,
  mime,
  maxFiles,
  maxFileSize,
}) {
  const classes = useStyles();

  const [dzKey, setDzKey] = useState(0);
  const [listProgress, setListProgress] = useState(data);

  mime = mime ?? [];
  maxFiles = maxFiles ?? 1000;
  maxFileSize = maxFileSize ?? 10000000000;

  const uploadFileProccess = (files) => {
    path = path ?? "general";
    var fileList = [...listProgress];
    var initialList = listProgress.length;
    var countUp = 0;
    if (files.length > 0) {
      for (var i = 0; i < files.length; i++) {
        fileList.push({
          name: files[i].name,
          progress: 0,
          link: null,
          content_type: null,
          loading: -1,
        });
      }
      setListProgress([...fileList]);
      files.map((file, i) => {
        uploadFileSecListenerApi(
          path,
          file,
          (event) => {
            var persen = Math.round((event.loaded / event.total) * 100);
            for (var i = initialList; i < fileList.length; i++) {
              if (fileList[i].name == file.name) {
                fileList[i].progress = persen;
                break;
              }
            }
            setListProgress([...fileList]);
          },
          (event) => {
            var tmp = JSON.parse(event.target.response);
            var response = tmp.data;
            for (var i = initialList; i < fileList.length; i++) {
              if (fileList[i].name == response.file_name) {
                fileList[i].link = response.link;
                fileList[i].content_type = response.content_type;
                break;
              }
            }
            setListProgress([...fileList]);
            countUp++;
            if (countUp == files.length) {
              exportList(fileList);
              setDzKey(dzKey + 1);
            }
          },
          (event) => {
            var tmp = JSON.parse(event.target.response);
            var err = tmp.message;
            console.log(err);
            for (var i = initialList; i < fileList.length; i++) {
              if (fileList[i].name == file.name) {
                fileList[i].progress = -1;
              }
            }
            setListProgress([...fileList]);
          }
        );
      });
    }
  };

  const deleteFileProcess = async (link) => {
    try {
      await deleteFileApi(link);
      var uploaded = [...listProgress];
      for (var i = 0; i < uploaded.length; i++) {
        if (uploaded[i].link == link) {
          uploaded.splice(i, 1);
        }
      }
      setListProgress([...uploaded]);
      exportList(uploaded);
    } catch (err) {
      console.log(err);
    }
  };

  const downloadFileProcess = async (link) => {
    try {
      var response = await downloadFileSecApi(link);
      if (response.status == 200) {
        var fileList = [...listProgress];
        var pos = null;
        fileList.map((item, i) => {
          if (item.link == link) {
            pos = i;
          }
        });
        var reader = response.body.getReader();
        var contenttype = response.headers.get("Content-Type");
        var len = parseInt(response.headers.get("Content-Length"));
        var receiveLen = 0;
        var chunks = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          receiveLen += value.length;
          chunks.push(value);
          fileList[pos].loading = Math.round(
            parseInt((receiveLen / len) * 100)
          );
          setListProgress([...fileList]);
        }
        fileList[pos].loading = -1;
        setListProgress([...fileList]);
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

  return (
    <Box className={classes.dzBox}>
      {listProgress?.map((item, key) => (
        <Box className={classes.dzProgress}>
          {item.link != null && (
            <React.Fragment>
              {item.loading != -1 && (
                <Box className={classes.dzFlex2} alignItems="center">
                  <Box class={classes.dzPbar}>
                    <CircularProgress
                      variant="determinate"
                      value={item.loading}
                    />
                    <Box
                      top={0}
                      left={0}
                      bottom={0}
                      right={0}
                      alignItems="center"
                      className={classes.dzPbar2}
                    >
                      <Typography
                        variant="caption"
                        color="textSecondary"
                      >{`${item.loading}%`}</Typography>
                    </Box>
                  </Box>
                  <Box className={classes.dzMgLeft2}>
                    <Typography variant="body2">{item.name}</Typography>
                  </Box>
                </Box>
              )}
              {item.loading == -1 && (
                <Box className={classes.dzFlex} alignItems="center">
                  <Tooltip title="Delete File" placement="top">
                    <IconButton
                      size="small"
                      onClick={() => deleteFileProcess(item.link)}
                    >
                      <Icon>delete</Icon>
                    </IconButton>
                  </Tooltip>
                  <Link
                    onClick={() => downloadFileProcess(item.link)}
                    rel="noopener noreferrer"
                    className={classes.dzMgLeft}
                  >
                    <Typography variant="body2">{item.name}</Typography>
                  </Link>
                </Box>
              )}
            </React.Fragment>
          )}
          {item.progress >= 0 && item.link == null && (
            <Box className={classes.dzFlex} alignItems="center">
              <Typography variant="body2">{item.name}</Typography>
              <Box width="100%" mr={1} className={classes.dzMgLeft}>
                <LinearProgress variant="determinate" value={item.progress} />
              </Box>
              <Box minWidth={35}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                >{`${item.progress}%`}</Typography>
              </Box>
            </Box>
          )}
        </Box>
      ))}
      <DropzoneArea
        key={id + "-" + dzKey}
        acceptedFiles={mime}
        maxFileSize={maxFileSize}
        showAlerts={["error"]}
        filesLimit={maxFiles}
        showPreviewsInDropzone={false}
        onChange={uploadFileProccess}
      />
    </Box>
  );
}
