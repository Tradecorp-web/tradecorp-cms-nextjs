import React, { useState, useEffect } from "react";
import {
  Avatar,
  Link,
  Grid,
  Icon,
  Snackbar,
  Slide,
  Button,
  Divider,
  Modal,
  Box,
  Fab,
  Tooltip,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import Head from "next/head";
import {
  LOCAL_STORAGE_MESSAGE,
  LOCAL_STORAGE_MESSAGE_TYPE,
} from "../../../helpers/consts";
import { useRouter } from "next/router";
import getRoute from "../../../helpers/router";
import { accountSwr } from "../../../services/swr/account.swr";
import { logoutAccount } from "../../../services/api/auth.api";
import { getListUserApi } from "../../../services/api/user.api";
import { messageListener } from "../../../helpers/firebase";
import { isPermit } from "../../../helpers/general";
import { getDepoNewsSwr } from "../../../services/swr/depo.swr";
import { isDesktop } from "react-device-detect";
import { Scrollbars } from "react-custom-scrollbars";
import TaskPanel from "../../base_component/task-manager-panel";

const useStyles = makeStyles((theme) => ({
  alertTitle: {
    textTransform: "capitalize",
  },
  alertContainer: {
    minWidth: "250px",
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  subMenu: {
    backgroundColor: "#a9a9a9",
    margin: 10,
  },
}));

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function HomePage() {
  const account = accountSwr();
  const router = useRouter();

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [sub, setSub] = useState({ inventory: false });
  const [state, setState] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "right",
    transition: SlideTransition,
    type: "success",
    title: null,
    message: null,
    hide: null,
  });
  const { vertical, horizontal } = state;
  const messType = localStorage.getItem(LOCAL_STORAGE_MESSAGE_TYPE);
  const message = localStorage.getItem(LOCAL_STORAGE_MESSAGE);
  if (messType != null) {
    setState({
      ...state,
      open: true,
      title: messType,
      message: message,
      type: messType,
    });
    localStorage.removeItem(LOCAL_STORAGE_MESSAGE_TYPE);
    localStorage.removeItem(LOCAL_STORAGE_MESSAGE);
  }

  const openSub = (name, value) => {
    setSub({ ...sub, [name]: value });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  useEffect(() => {
    messageListener()
      .then((payload) => {
        //console.log(payload)
        setState({
          ...state,
          open: true,
          title: payload.notification.title,
          message: payload.notification.body,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [state]);

  const [listUser, setListUser] = useState(null)

  useEffect(async () => {
    try {
       var data = await getListUserApi("", 0, 3, "created_at", "desc")
      setListUser(data.result)
    } catch (err) {
      console.log(err)
    }
  }, [])

  const [depoNews, setDepoNews] = useState(null);
  const depoNewsSwr = getDepoNewsSwr();
  useEffect(() => {
    setDepoNews(depoNewsSwr.data);
  }, [depoNewsSwr.data]);

  const togglePanel = (stat) => {
    setOpen(stat);
  };

  return (
    <Grid container>
      <Head>
        <title>Tradecorp CMS</title>
        <link
          rel="icon"
          href="https://kontainerindonesia.co.id/wp-content/uploads/2021/02/cropped-favicon-tradecorp-32x32.png"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </Head>

      {isDesktop && (
        <Grid item xs={3} lg={2}>
          <div className="side-left">
            <div className="slogan">
              <h2 className="mb-5 pb-5">
                The Complete
                <br />
                Solution
              </h2>
              <div className="accent"></div>
            </div>
            <div className="who-new">
              <h2 className="pb-5">Who's new?</h2>
              <div>
                {listUser?.map((row,key) => (
                  <div className="flext-center mb-3">
                    <Avatar
                      src={row?.photo}
                      style={{ width: 50, height: 50 }}
                    />
                    <div className="ms-2">
                      <strong>{row.name}</strong>
                      <br />
                      <small className="text-muted">{row?.user_position?.position}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5">
              <Button
                onClick={() => router.push(getRoute("company.directory"))}
                variant="outlined"
                color="default"
                fullWidth
              >
                <Icon className="me-2">groups</Icon>Company Directory
              </Button>
            </div>
          </div>
        </Grid>
      )}
      {isDesktop && (
        <Grid item xs={9} lg={10}>
          <div className="grid-home-menu side-right">
            <div
              className="image-bg"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
              }}
            >
              <img
                src="images/bg-container.png"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div className="side-right-content" style={{ paddingTop: 120 }}>
              <div className="ms-3 me-3">
                <Grid container>
                  <Grid item md={8} lg={9} spacing={0}>
                    <Grid container spacing={2} className="grid-menu">
                      {isPermit("menu", "admin") && (
                        <Grid item md={4} lg={3} xl={3}>
                          <a
                            href={getRoute("admin")}
                            className="grid-menu-item"
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>
                                  admin_panel_settings
                                </Icon>
                              </div>
                              <div>Administration</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {(isPermit("menu", "container") ||
                        isPermit("menu", "depo") ||
                        isPermit("menu", "quote_in") ||
                        isPermit("menu", "lease_container")) && (
                        <Grid item md={4} lg={3} xl={3}>
                          <a
                            href="javascript:void(0)"
                            className="grid-menu-item"
                            onClick={() => openSub("inventory", true)}
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>cases</Icon>
                              </div>
                              <div>Inventory</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "3d") && (
                        <Grid item md={4} lg={3} xl={3}>
                          <a href={getRoute("3d")} className="grid-menu-item">
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>view_in_ar</Icon>
                              </div>
                              <div>3D Design</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "product") && (
                        <Grid item md={4} lg={3} xl={3}>
                          <a
                            href={getRoute("material")}
                            className="grid-menu-item"
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>layers</Icon>
                              </div>
                              <div>
                                Product <br />
                                &amp; Material
                              </div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "purchase_order") && (
                        <Grid item md={4} lg={3} xl={3}>
                          <a href={getRoute("po")} className="grid-menu-item">
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>inventory</Icon>
                              </div>
                              <div>Purchase Order</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "wo") && (
                        <Grid item md={4} lg={3} xl={3}>
                          <a href={getRoute("wo")} className="grid-menu-item">
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>assignment</Icon>
                              </div>
                              <div>Work Order</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "trucking") && (
                        <Grid item md={4} lg={3} xl={3}>
                          <a href="#" className="grid-menu-item">
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50, color: "#666" }}>
                                  local_shipping
                                </Icon>
                              </div>
                              <div className="text-muted">Trucking*</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "task_manager") && (
                        <Grid item md={4} lg={3} xl={3}>
                          <a href={getRoute("task")} className="grid-menu-item">
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>task</Icon>
                              </div>
                              <div>Task Manager</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "warehouse") && (
                        <Grid item md={4} lg={3} xl={3}>
                          <a
                            href={getRoute("warehouse")}
                            className="grid-menu-item"
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>
                                  precision_manufacturing
                                </Icon>
                              </div>
                              <div>Warehouse</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "market_research") && (
                        <Grid item md={4} lg={3} xl={3}>
                          <a href="#" className="grid-menu-item">
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50, color: "#666" }}>
                                  insights
                                </Icon>
                              </div>
                              <div className="text-muted">Market Research*</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "accounting") && (
                        <Grid item md={4} lg={3} xl={3}>
                          <a
                            href={getRoute("accounting")}
                            className="grid-menu-item"
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>calculate</Icon>
                              </div>
                              <div>Accounting</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "customer") && (
                        <Grid item md={4} lg={3} xl={3}>
                          <a
                            href={getRoute("customer")}
                            className="grid-menu-item"
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>people_alt</Icon>
                              </div>
                              <div>Customers</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {/*{isPermit("menu", "invoicing") && (*/}
                      {/*  <Grid item md={4} lg={3} xl={3}>*/}
                      {/*    <a*/}
                      {/*      href={getRoute("invoice")}*/}
                      {/*      className="grid-menu-item"*/}
                      {/*    >*/}
                      {/*      <img src="images/box-white.png" />*/}
                      {/*      <div className="text-center grid-menu-item-content">*/}
                      {/*        <div className="icon">*/}
                      {/*          <Icon style={{ fontSize: 50 }}>receipt</Icon>*/}
                      {/*        </div>*/}
                      {/*        <div>Invoicing</div>*/}
                      {/*      </div>*/}
                      {/*    </a>*/}
                      {/*  </Grid>*/}
                      {/*)}*/}
                      {isPermit("menu", "driver") && (
                        <Grid item md={4} lg={3} xl={3}>
                          <a
                            href={getRoute("driver")}
                            className="grid-menu-item"
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>person_pin</Icon>
                              </div>
                              <div>Driver</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "machinery") && (
                        <Grid item md={4} lg={3} xl={3}>
                          <a
                            href={getRoute("vehicle")}
                            className="grid-menu-item"
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>
                                  agriculture
                                </Icon>
                              </div>
                              <div>Machinery &amp; Fleet Management</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "document") && (
                        <Grid item md={4} lg={3} xl={3}>
                          <a
                            href={getRoute("document")}
                            className="grid-menu-item"
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>
                                  picture_as_pdf
                                </Icon>
                              </div>
                              <div>Authorized Document for Distribution</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "files") && (
                        <Grid item md={4} lg={3} xl={3}>
                          <a
                            href={getRoute("files")}
                            className="grid-menu-item"
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>cloud</Icon>
                              </div>
                              <div>My Files</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "password") && (
                        <Grid item md={4} lg={3} xl={3}>
                          <a
                            href={getRoute("pwdman")}
                            className="grid-menu-item"
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>psychology</Icon>
                              </div>
                              <div>HSAM</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "sales") && (
                        <Grid item md={4} lg={3} xl={3}>
                          <a
                            href={getRoute("sales")}
                            className="grid-menu-item"
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>show_chart</Icon>
                              </div>
                              <div>Sales Order</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "sales") && (
                        <Grid item md={4} lg={3} xl={3}>
                          <a
                            href={getRoute("deal_builder")}
                            className="grid-menu-item"
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>
                                  build_circle
                                </Icon>
                              </div>
                              <div>Deal Builder</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "payment") && (
                        <Grid item md={4} lg={3} xl={3}>
                          <a
                            href={getRoute("payment")}
                            className="grid-menu-item"
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>money</Icon>
                              </div>
                              <div>Payment</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                  <Grid item md={4} lg={3}>
                    <Scrollbars
                      autoHide
                      renderView={(props) => (
                        <div {...props} className="news-section" />
                      )}
                    >
                      <h2 className="mb-3">News</h2>
                      <Divider />
                      <div className="mt-2">
                        {depoNews?.map((news) => (
                          <div className="mt-3">
                            <div className="pb-3">
                              <a href={news?.link} target="_blank">
                                <div className="text-hover">
                                  {news?.title?.rendered}
                                </div>
                                <div className="mb-1">
                                  <small>{news?.uagb_excerpt}</small>
                                </div>
                              </a>
                            </div>
                            <Divider />
                          </div>
                        ))}
                      </div>
                    </Scrollbars>
                  </Grid>
                  {isPermit("menu", "task_manager") && (
                    <Fab
                      size="small"
                      aria-label="task"
                      className={classes.fab}
                      onClick={() => togglePanel(true)}
                    >
                      <Tooltip title="Task Manager" placement="top">
                        <Icon>task</Icon>
                      </Tooltip>
                    </Fab>
                  )}
                </Grid>
              </div>
              <div className="user-info">
                <div className="flext-center mb-3">
                  <Link href={getRoute("profile")}>
                    <Avatar
                      src={account?.data?.photo}
                      style={{ width: 50, height: 50 }}
                    />
                  </Link>
                  <div className="ms-2">
                    <Link
                      href={getRoute("profile")}
                      style={{ color: "#FFFFFF" }}
                    >
                      <strong>{account?.data?.name}</strong>
                      <br />
                    </Link>
                    <small
                      className="text-hover"
                      onClick={logoutAccount}
                      style={{ fontWeight: "300 !important" }}
                    >
                      Logout
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Grid>
      )}

      {!isDesktop && (
        <Grid item xs={12}>
          <div
            className="grid-home-menu-mobile side-right"
            style={{
              background:
                "url(images/bg-container.png) center center no-repeat fixed",
            }}
          >
            <div className="side-right-content-mobile">
              <div className="ms-3 me-3">
                <Grid container>
                  <Grid item xs={12}>
                    <Grid container spacing={2} className="grid-menu-mobile">
                      <Grid item xs={12}>
                        <Link
                          onClick={() =>
                            router.push(getRoute("company.directory"))
                          }
                          href={getRoute("company.directory")}
                        >
                          <div
                            style={{
                              backgroundColor: "#ffffff96",
                              padding: "16px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Icon style={{ fontSize: 20, marginRight: "12px" }}>
                              groups
                            </Icon>{" "}
                            Company Directory
                          </div>
                        </Link>
                      </Grid>
                      {isPermit("menu", "admin") && (
                        <Grid item xs={6}>
                          <a
                            href={getRoute("admin")}
                            className="grid-menu-item"
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>
                                  admin_panel_settings
                                </Icon>
                              </div>
                              <div>Administration</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "container") && (
                        <Grid item xs={6}>
                          <a
                            href={getRoute("container")}
                            className="grid-menu-item"
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>
                                  corporate_fare
                                </Icon>
                              </div>
                              <div>Container Stocks</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "depo") && (
                        <Grid item xs={6}>
                          <a href={getRoute("depo")} className="grid-menu-item">
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>view_quilt</Icon>
                              </div>
                              <div>Depo</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "3d") && (
                        <Grid item xs={6}>
                          <a href={getRoute("3d")} className="grid-menu-item">
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>view_in_ar</Icon>
                              </div>
                              <div>3D Design</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "product") && (
                        <Grid item xs={6}>
                          <a
                            href={getRoute("material")}
                            className="grid-menu-item"
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>layers</Icon>
                              </div>
                              <div>
                                Product <br />
                                &amp; Material
                              </div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "purchase_order") && (
                        <Grid item xs={6}>
                          <a href={getRoute("po")} className="grid-menu-item">
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>inventory</Icon>
                              </div>
                              <div>Purchase Order</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "wo") && (
                        <Grid item xs={6}>
                          <a href={getRoute("wo")} className="grid-menu-item">
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>assignment</Icon>
                              </div>
                              <div>Work Order</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "trucking") && (
                        <Grid item xs={6}>
                          <a href="#" className="grid-menu-item">
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50, color: "#666" }}>
                                  local_shipping
                                </Icon>
                              </div>
                              <div className="text-muted">Trucking*</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "task_manager") && (
                        <Grid item xs={6}>
                          <a href={getRoute("task")} className="grid-menu-item">
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>task</Icon>
                              </div>
                              <div>Task Manager</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "warehouse") && (
                        <Grid item xs={6}>
                          <a
                            href={getRoute("warehouse")}
                            className="grid-menu-item"
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>
                                  precision_manufacturing
                                </Icon>
                              </div>
                              <div>Warehouse</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "market_research") && (
                        <Grid item xs={6}>
                          <a href="#" className="grid-menu-item">
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50, color: "#666" }}>
                                  insights
                                </Icon>
                              </div>
                              <div className="text-muted">Market Research*</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "accounting") && (
                        <Grid item xs={6}>
                          <a
                            href={getRoute("accounting")}
                            className="grid-menu-item"
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>calculate</Icon>
                              </div>
                              <div>Accounting</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "customer") && (
                        <Grid item xs={6}>
                          <a
                            href={getRoute("customer")}
                            className="grid-menu-item"
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>people_alt</Icon>
                              </div>
                              <div className="text-muted">Customers</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "invoicing") && (
                        <Grid item xs={6}>
                          <a
                            href={getRoute("invoice")}
                            className="grid-menu-item"
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>receipt</Icon>
                              </div>
                              <div className="text-muted">Invoicing</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "driver") && (
                        <Grid item xs={6}>
                          <a
                            href={getRoute("driver")}
                            className="grid-menu-item"
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>person_pin</Icon>
                              </div>
                              <div>Driver</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "machinery") && (
                        <Grid item xs={6}>
                          <a
                            href={getRoute("vehicle")}
                            className="grid-menu-item"
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>
                                  agriculture
                                </Icon>
                              </div>
                              <div>Machinery &amp; Fleet Management</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "document") && (
                        <Grid item xs={6}>
                          <a
                            href={getRoute("document")}
                            className="grid-menu-item"
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>
                                  picture_as_pdf
                                </Icon>
                              </div>
                              <div>Authorized Document for Distribution</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                      {isPermit("menu", "files") && (
                        <Grid item xs={6}>
                          <a
                            href={getRoute("files")}
                            className="grid-menu-item"
                          >
                            <img src="images/box-white.png" />
                            <div className="text-center grid-menu-item-content">
                              <div className="icon">
                                <Icon style={{ fontSize: 50 }}>cloud</Icon>
                              </div>
                              <div>My Files</div>
                            </div>
                          </a>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <div className="news-section-mobile mb-5">
                      <h2 className="mb-3">News</h2>
                      <Divider />
                      <div className="mt-2" style={{ overflow: "scroll" }}>
                        {depoNews?.map((news) => (
                          <div className="mt-3">
                            <div className="pb-3">
                              <a href={news?.link} target="_blank">
                                <div className="text-hover">
                                  {news?.title?.rendered}
                                </div>
                                <div className="mb-1">
                                  <small>{news?.uagb_excerpt}</small>
                                </div>
                              </a>
                            </div>
                            <Divider />
                          </div>
                        ))}
                      </div>
                    </div>
                  </Grid>
                  {isPermit("menu", "task_manager") && (
                    <Fab
                      size="small"
                      aria-label="task"
                      className={classes.fab}
                      onClick={() => togglePanel(true)}
                    >
                      <Tooltip title="Task Manager" placement="top">
                        <Icon>task</Icon>
                      </Tooltip>
                    </Fab>
                  )}
                </Grid>
              </div>
              <div className="user-info-mobile">
                <div className="flext-center">
                  <Link href={getRoute("profile")}>
                    <Avatar
                      src={account?.data?.photo}
                      style={{ width: 50, height: 50 }}
                    />
                  </Link>
                  <div className="ms-2">
                    <Link
                      href={getRoute("profile")}
                      style={{ color: "#FFFFFF" }}
                    >
                      <strong>{account?.data?.name}</strong>
                      <br />
                    </Link>
                    <small
                      className="text-hover"
                      onClick={logoutAccount}
                      style={{ fontWeight: "300 !important" }}
                    >
                      Logout
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Grid>
      )}

      <style jsx>{`
        .side-left {
          height: calc(100vh);
          background: #efefef;
        }
        .side-left .slogan {
          padding-top: 100px;
          padding-bottom: 100px;
          font-size: 24px;
          font-weight: 600;
          margin-left: 32px;
        }
        .side-left .accent {
          width: 100px;
          height: 10px;
          margin: 0 75px 0 0;
          background: #fcc616;
        }
        .who-new {
          padding: 0 40px;
        }
        .flext-center {
          display: flex !important;
          align-items: center !important;
        }
        .side-right {
          position: relative;
        }
        .side-right .side-right-content {
          position: absolute;
          background: #1212124a;
          width: 100%;
          height: 100%;
        }
        .side-right .side-right-content-mobile {
          width: 100%;
          height: 100%;
        }
        .side-right .slogan {
          padding-top: 100px;
          padding-bottom: 100px;
          font-size: 40px;
          font-weight: 600;
          color: #fff;
        }
        .grid-menu {
          padding: 0 100px;
          width: 100%;
          display: flex;
          flex-wrap: wrap;
        }
        .grid-menu-item img {
          width: 100%;
          opacity: 0.5;
        }
        .grid-menu-item {
          width: 100%;
          height: auto;
          display: flex;
          font-size: 16px;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .grid-menu-item .grid-menu-item-content {
          position: absolute;
        }
        .grid-menu-item .icon {
          margin-bottom: 10px;
        }
        .grid-menu-item:hover img {
          opacity: 0.8;
        }
        .user-info {
          position: absolute;
          top: 32px;
          right: 32px;
          color: #ffffff;
        }
        .user-info-mobile {
          position: absolute;
          top: 32px;
          left: 32px;
          right: 32px;
          background: #0000004f;
          padding: 12px;
          color: #ffffff;
        }
        .news-section {
          color: #000;
          background: #ffffffc9;
          margin: 0 16px;
          padding: 24px;
          height: calc(100vh - 150px);
        }
        .news-section-mobile {
          color: #000;
          background: #ffffffc9;
          margin: 0 16px;
          padding: 24px;
          overflow: auto;
        }
      `}</style>
      <TaskPanel open={open} close={() => togglePanel(false)} />
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={state.open}
        onClose={handleClose}
        TransitionComponent={state.transition}
        message={state.message}
        autoHideDuration={state.hide}
        key={Math.random()}
      >
        <Alert
          variant="filled"
          severity={state.type}
          className={classes.alertContainer}
        >
          <AlertTitle className={classes.alertTitle}>{state.title}</AlertTitle>
          {state.message}
        </Alert>
      </Snackbar>
      {isDesktop && (
        <Modal
          open={sub.inventory}
          onClose={() => openSub("inventory", false)}
          className={classes.modal}
        >
          <Box
            className="modal-wrapper"
            bgcolor="white"
            style={{ width: "1000px" }}
          >
            <Grid container>
              <Grid item md={12} lg={12} spacing={0}>
                <Grid container className="grid-menu" style={{ padding: 15 }}>
                  {isPermit("menu", "container") && (
                    <Grid item md={3} lg={2} xl={2} className={classes.subMenu}>
                      <a
                        href={getRoute("container")}
                        className="grid-menu-item"
                      >
                        <img src="images/box-white.png" />
                        <div className="text-center grid-menu-item-content">
                          <div className="icon">
                            <Icon style={{ fontSize: 50 }}>corporate_fare</Icon>
                          </div>
                          <div>Container Stocks</div>
                        </div>
                      </a>
                    </Grid>
                  )}
                  {isPermit("menu", "depo") && (
                    <Grid item md={3} lg={2} xl={2} className={classes.subMenu}>
                      <a
                        href={getRoute("depo.group")}
                        className="grid-menu-item"
                      >
                        <img src="images/box-white.png" />
                        <div className="text-center grid-menu-item-content">
                          <div className="icon">
                            <Icon style={{ fontSize: 50 }}>view_quilt</Icon>
                          </div>
                          <div>Depot</div>
                        </div>
                      </a>
                    </Grid>
                  )}
                  {isPermit("menu", "quote_in") && (
                    <Grid item md={3} lg={2} xl={2} className={classes.subMenu}>
                      <a href={getRoute("quotein")} className="grid-menu-item">
                        <img src="images/box-white.png" />
                        <div className="text-center grid-menu-item-content">
                          <div className="icon">
                            <Icon style={{ fontSize: 50 }}>request_quote</Icon>
                          </div>
                          <div>New Build Quotes</div>
                        </div>
                      </a>
                    </Grid>
                  )}
                  {isPermit("menu", "quote_in") && (
                    <Grid item md={3} lg={2} xl={2} className={classes.subMenu}>
                      <a
                        href={getRoute("quotein-production")}
                        className="grid-menu-item"
                      >
                        <img src="images/box-white.png" />
                        <div className="text-center grid-menu-item-content">
                          <div className="icon">
                            <Icon style={{ fontSize: 50 }}>settings</Icon>
                          </div>
                          <div>Container in Production</div>
                        </div>
                      </a>
                    </Grid>
                  )}
                  {isPermit("menu", "quote_in") && (
                    <Grid item md={3} lg={2} xl={2} className={classes.subMenu}>
                      <a
                        href={getRoute("quotein-completed")}
                        className="grid-menu-item"
                      >
                        <img src="images/box-white.png" />
                        <div className="text-center grid-menu-item-content">
                          <div className="icon">
                            <Icon style={{ fontSize: 50 }}>view_column</Icon>
                          </div>
                          <div>Completed Production Data</div>
                        </div>
                      </a>
                    </Grid>
                  )}
                  {isPermit("menu", "quote_in") && (
                    <Grid item md={3} lg={2} xl={2} className={classes.subMenu}>
                      <a
                        href={getRoute("master.serial_number")}
                        className="grid-menu-item"
                      >
                        <img src="images/box-white.png" />
                        <div className="text-center grid-menu-item-content">
                          <div className="icon">
                            <Icon style={{ fontSize: 50 }}>call_to_action</Icon>
                          </div>
                          <div>Master Serial Number</div>
                        </div>
                      </a>
                    </Grid>
                  )}
                  {isPermit("menu", "lease_container") && (
                    <Grid item md={3} lg={2} xl={2} className={classes.subMenu}>
                      <a
                        href={getRoute("container.lease")}
                        className="grid-menu-item"
                      >
                        <img src="images/box-white.png" />
                        <div className="text-center grid-menu-item-content">
                          <div className="icon">
                            <Icon style={{ fontSize: 50 }}>text_snippet</Icon>
                          </div>
                          <div>Lease Container</div>
                        </div>
                      </a>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      )}
    </Grid>
  );
}
