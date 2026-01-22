import { Divider, Typography, Grid, Paper, IconButton, Icon, Button, Link, Box, Chip, Collapse, Table, TableHead, TableBody, TableFooter, TableRow, TableCell, TableContainer, Snackbar, Tabs, Tab, Modal, Card, CardMedia, CardActions, makeStyles, CircularProgress, Tooltip, ButtonGroup, Popper, Grow, ClickAwayListener, MenuList, MenuItem, Checkbox, LinearProgress } from "@material-ui/core";
import { Alert, SpeedDial, SpeedDialIcon, SpeedDialAction } from "@material-ui/lab"
import { GetApp, DoneOutline, MoreVert, KeyboardArrowDown, EditAttributes, Send } from '@material-ui/icons'
import { useRouter } from "next/router";
import StockContainerLayout from "./container-layout";
import { countDays, dateFormat, isPermit, rupiah, currency, switchView } from "../../../helpers/general";
import { getDetailContainerStockSwr } from "../../../services/swr/container-stock.swr";
import { updateContainerApi, downloadContainerApi } from "../../../services/api/container-stocks.api";
import React, { useEffect, useState, useRef } from "react";
import StockContainerForm from "./container-form";
import StockContainerAttachmentForm from "./container-attachment-form";
import StockContainerAddAttachmentForm from "./container-attachment-add-form";
import StockContainerMoveAttachmentForm from "./container-attachment-move-form";
import Moment from "moment";
import MasterForm from "../../../admin-components/pages/master/data/form";
import { downloadFileSecApi } from "../../../services/api/file.api";
import Carousel from "react-material-ui-carousel"

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
    title: {
        fontSize: "2em",
        fontWeight: 600,
        display: "inline-flex",
    },
    wrapper: {
        position: 'relative',
    },
    card: {
        height: "90vh",
        width: "70vw",
        margin: "40px auto",
        padding: "20px 5px",
        backgroundColor: "#121212",
    },
    media: {
        objectFit: "contain",
        height: "80vh",
        marginBottom: "20px",
    },
    itemContainer: {
        textAlign: "center",
        position: "relative",
    },
    labelContainer: {
        opacity: 0.3,
    },
    checkContainer: {
        position: "absolute",
        top: 0,
        left: 0,
    },
    pContainer: {
        position: "absolute",
        top: "25%",
        left: "41%",
    },
    pbar: {
        display: "inline-flex",
        position: "relative",
    },
    pbar1: {
        display: "flex",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
    },
    pbar2: {
        display: "flex",
        justifyContent: "center",
        position: "absolute",
    },
    pbar3: {
        display: "flex",
    },
    speedDial: {
        position: 'absolute',
                '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
                bottom: theme.spacing(0),
                right: theme.spacing(0),
            },
                '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
                top: theme.spacing(0),
                left: theme.spacing(0),
            },
    },
}))

export default function StockContainerDetail() {
    const router = useRouter()
    const classes = useStyles()
    const containerId = router.query.id

    const [container, setContainer] = useState(null)
    const [titleBackground, setTitleBackground] = useState("")

    const containerSwr = getDetailContainerStockSwr(containerId)

    useEffect(() => {
        if (containerSwr.data?.stock_reconcile) {
            setTitleBackground("-webkit-linear-gradient(left,#fafafa 0px,#196f3d 50px,#fafafa,#fafafa)")
        } else {
            setTitleBackground("")
        }
        setContainer(containerSwr.data)
    }, [containerSwr.data])

    useEffect(async () => {
        if (container != null) {
            var vw = switchView()
            setView(vw)

            // var prog = []
            // var bl = []
            // var bar = [...displayBar]
            // if (container.images != null) {
            //     for (var i=0; i<container.images.length; i++) {
            //         prog[i] = 0
            //         bar[i] = 0
            //         bl[i] = new Blob()
            //     }
            // }
            // setProgress(prog)
            // setDisplayBar([...bar])
            // setBlob(bl)

            // // setBlobAttach({csc_certificate:new Blob(),specification:new Blob(),contract:new Blob(),invoice:new Blob()})

            // var prog2 = []
            // var bl2 = []
            // var bar2 = [...barDrawing]
            // if (container.drawings != null) {
            //     for (var i=0; i<container.drawings.length; i++) {
            //         prog2[i] = 0
            //         bar2[i] = 0
            //         bl2[i] = new Blob()
            //     }
            // }
            // setProgDrawing(prog2)
            // setBarDrawing([...bar2])
            // setBlobDrawing(bl2)

            // var prog3 = []
            // var bl3 = []
            // var bar3 = [...barSurvey]
            // if (container.surveys != null) {
            //     for (var i=0; i<container.surveys.length; i++) {
            //         prog3[i] = 0
            //         bar3[i] = 0
            //         bl3[i] = new Blob()
            //     }
            // }
            // setProgSurvey(prog3)
            // setBarSurvey([...bar3])
            // setBlobSurvey(bl3)

            // var prog4 = []
            // var bl4 = []
            // var bar4 = [...barOther]
            // if (container.relative_documents != null) {
            //     for (var i=0; i<container.relative_documents.length; i++) {
            //         prog4[i] = 0
            //         bar4[i] = 0
            //         bl4[i] = new Blob()
            //     }
            // }
            // setProgOther(prog4)
            // setBarOther([...bar4])
            // setBlobOther(bl4)

            // var prog5 = []
            // var bl5 = []
            // var bar5 = [...barCSC]
            // if (container.csc_certificates != null) {
            //     for (var i=0; i<container.csc_certificates.length; i++) {
            //         prog5[i] = 0
            //         bar5[i] = 0
            //         bl5[i] = new Blob()
            //     }
            // }
            // setProgCSC(prog5)
            // setBarCSC([...bar5])
            // setBlobCSC(bl5)

            // var prog6 = []
            // var bl6 = []
            // var bar6 = [...barSpec]
            // if (container.specifications != null) {
            //     for (var i=0; i<container.specifications.length; i++) {
            //         prog6[i] = 0
            //         bar6[i] = 0
            //         bl6[i] = new Blob()
            //     }
            // }
            // setProgSpec(prog6)
            // setBarSpec([...bar6])
            // setBlobSpec(bl6)

            // var prog7 = []
            // var bl7 = []
            // var bar7 = [...barContract]
            // if (container.contracts != null) {
            //     for (var i=0; i<container.contracts.length; i++) {
            //         prog7[i] = 0
            //         bar7[i] = 0
            //         bl7[i] = new Blob()
            //     }
            // }
            // setProgContract(prog7)
            // setBarContract([...bar7])
            // setBlobContract(bl7)

            // var prog8 = []
            // var bl8 = []
            // var bar8 = [...barInvoice]
            // if (container.invoices != null) {
            //     for (var i=0; i<container.invoices.length; i++) {
            //         prog8[i] = 0
            //         bar8[i] = 0
            //         bl8[i] = new Blob()
            //     }
            // }
            // setProgInvoice(prog8)
            // setBarInvoice([...bar8])
            // setBlobInvoice(bl8)

            var dialState = {...openDial}
            var hiddenState = {...hidden}
            if (container.images != null) {
                for (var i=0; i<container.images.length; i++) {
                    dialState.image[i] = false
                    hiddenState.image[i] = true
                }
            }
            if (container.drawings != null) {
                for (var i=0; i<container.drawings.length; i++) {
                    dialState.drawing[i] = false
                    hiddenState.drawing[i] = true
                }
            }
            if (container.surveys != null) {
                for (var i=0; i<container.surveys.length; i++) {
                    dialState.survey[i] = false
                    hiddenState.survey[i] = true
                }
            }
            if (container.relative_documents != null) {
                for (var i=0; i<container.relative_documents.length; i++) {
                    dialState.other[i] = false
                    hiddenState.other[i] = true
                }
            }
            if (container.csc_certificates != null) {
                for (var i=0; i<container.csc_certificates.length; i++) {
                    dialState.csc[i] = false
                    hiddenState.csc[i] = true
                }
            }
            if (container.specifications != null) {
                for (var i=0; i<container.specifications.length; i++) {
                    dialState.specification[i] = false
                    hiddenState.specification[i] = true
                }
            }
            if (container.contracts != null) {
                for (var i=0; i<container.contracts.length; i++) {
                    dialState.contract[i] = false
                    hiddenState.contract[i] = true
                }
            }
            if (container.invoices != null) {
                for (var i=0; i<container.invoices.length; i++) {
                    dialState.invoice[i] = false
                    hiddenState.invoice[i] = true
                }
            }
            if (container.original_photos != null) {
                for (var i=0; i<container.original_photos.length; i++) {
                    dialState.original[i] = false
                    hiddenState.original[i] = true
                }
            }
            setOpenDial(dialState)
            setHidden(hiddenState)

            preLoadFile("image", container.images)
            preLoadFile("drawing", container.drawings)
            preLoadFile("survey", container.surveys)
            preLoadFile("other", container.relative_documents)
            preLoadFile("csc", container.csc_certificates)
            preLoadFile("specification", container.specifications)
            preLoadFile("contract", container.contracts)
            preLoadFile("invoice", container.invoices)
            preLoadFile("original", container.original_photos)
        }
    }, [container])

    const [openFormEdit, setOpenFormEdit] = useState(false)

    const [openMaster, setOpenMaster] = useState(false);
    const [master, setMaster] = useState(null);
    const [newOption, setNewOption] = useState(null);

    const addMaster = (category) => {
        setMaster({id: null, name: null, alias: null, category: category})
        setOpenFormEdit(false)
        setOpenMaster(true)
    }

    const refreshMaster = (update) => {
        setNewOption(update)
        setOpenFormEdit(true)
        setOpenMaster(false)
    }

    const [toast, setToast] = useState({show:false,message:""})

    const showToast = (message) => {
        setToast({show:true, message:message})
    }

    const closeToast = (event, reason) => {
        if (reason === "clickaway") {
            return
        }
        setToast({...toast, show:false})
    }

    const [tabValue, setTabValue] = useState(0)

    const handleTabChange = (event, value) => {
        setTabValue(value)
    }

    const [progress, setProgress] = useState([])
    const [displayBar, setDisplayBar] = useState([])
    const [blob, setBlob] = useState([])

    // const [barAttach, setBarAttach] = useState({csc_certificate:-1,specification:-1,contract:-1,invoice:-1})
    // const [blobAttach, setBlobAttach] = useState({csc_certificate:null,specification:null,contract:null,invoice:null})
    // const [typeAttach, setTypeAttach] = useState({csc_certificate:null,specification:null,contract:null,invoice:null})

    const [progCSC, setProgCSC] = useState([])
    const [barCSC, setBarCSC] = useState([])
    const [blobCSC, setBlobCSC] = useState([])

    const [progSpec, setProgSpec] = useState([])
    const [barSpec, setBarSpec] = useState([])
    const [blobSpec, setBlobSpec] = useState([])

    const [progContract, setProgContract] = useState([])
    const [barContract, setBarContract] = useState([])
    const [blobContract, setBlobContract] = useState([])

    const [progInvoice, setProgInvoice] = useState([])
    const [barInvoice, setBarInvoice] = useState([])
    const [blobInvoice, setBlobInvoice] = useState([])

    const [progDrawing, setProgDrawing] = useState([])
    const [barDrawing, setBarDrawing] = useState([])
    const [blobDrawing, setBlobDrawing] = useState([])

    const [progSurvey, setProgSurvey] = useState([])
    const [barSurvey, setBarSurvey] = useState([])
    const [blobSurvey, setBlobSurvey] = useState([])

    const [progOther, setProgOther] = useState([])
    const [barOther, setBarOther] = useState([])
    const [blobOther, setBlobOther] = useState([])

    const [progOriginal, setProgOriginal] = useState([])
    const [barOriginal, setBarOriginal] = useState([])
    const [blobOriginal, setBlobOriginal] = useState([])

    const [selView, setSelView] = useState({content: "", key:null, name:"", tipe:"", blob: null})
    const [openView, setOpenView] = useState(false)

    const preLoadFile = async (tipe,data) => {
        if (data != null) {
            var bl = []
            var prog = []
            var bar = []
            for (var i=0; i<data.length; i++) {
                bl[i] = new Blob()
                prog[i] = 1 //0
                bar[i] = 0
            }
            if (tipe == "image") {
                setBlob([...bl])
                setProgress([...prog])
                setDisplayBar([...bar])
            } else if (tipe == "drawing") {
                setBlobDrawing([...bl])
                setProgDrawing([...prog])
                setBarDrawing([...bar])
            } else if (tipe == "survey") {
                setBlobSurvey([...bl])
                setProgSurvey([...prog])
                setBarSurvey([...bar])
            } else if (tipe == "other") {
                setBlobOther([...bl])
                setProgOther([...prog])
                setBarOther([...bar])
            } else if (tipe == "csc") {
                setBlobCSC([...bl])
                setProgCSC([...prog])
                setBarCSC([...bar])
            } else if (tipe == "specification") {
                setBlobSpec([...bl])
                setProgSpec([...prog])
                setBarSpec([...bar])
            } else if (tipe == "contract") {
                setBlobContract([...bl])
                setProgContract([...prog])
                setBarContract([...bar])
            } else if (tipe == "invoice") {
                setBlobInvoice([...bl])
                setProgInvoice([...prog])
                setBarInvoice([...bar])
            } else if (tipe == "original") {
                setBlobOriginal([...bl])
                setProgOriginal([...prog])
                setBarOriginal([...bar])
            }
            for (var i=0; i<data.length; i++) {
                // prog[i] = 1
                // if (tipe == "image") {
                //     setProgress([...prog])
                // } else if (tipe == "drawing") {
                //     setProgDrawing([...prog])
                // } else if (tipe == "survey") {
                //     setProgSurvey([...prog])
                // } else if (tipe == "other") {
                //     setProgOther([...prog])
                // } else if (tipe == "csc") {
                //     setProgCSC([...prog])
                // } else if (tipe == "specification") {
                //     setProgSpec([...prog])
                // } else if (tipe == "contract") {
                //     setProgContract([...prog])
                // } else if (tipe == "invoice") {
                //     setProgInvoice([...prog])
                // }
                try {
                    var response = await downloadFileSecApi(data[i].link)
                    if (response.status == 200) {
                        var reader = response.body.getReader()
                        var len = parseInt(response.headers.get("Content-Length"))
                        var chunks = []
                        var receiveLen = 0
                        var chunks = []
                        while (true) {
                            const {done, value} = await reader.read()
                            if (done) {
                                break
                            }
                            chunks.push(value)
                            receiveLen += value.length
                            bar[i] = Math.round(parseInt(receiveLen / len * 100))
                            if (tipe == "image") {
                                setDisplayBar([...bar])
                            } else if (tipe == "drawing") {
                                setBarDrawing([...bar])
                            } else if (tipe == "survey") {
                                setBarSurvey([...bar])
                            } else if (tipe == "other") {
                                setBarOther([...bar])
                            } else if (tipe == "csc") {
                                setBarCSC([...bar])
                            } else if (tipe == "specification") {
                                setBarSpec([...bar])
                            } else if (tipe == "contract") {
                                setBarContract([...bar])
                            } else if (tipe == "invoice") {
                                setBarInvoice([...bar])
                            } else if (tipe == "original") {
                                setBarOriginal([...bar])
                            }
                        }
                        bl[i] = new Blob(chunks, {type:data[i].content_type})
                        prog[i] = 0
                        if (tipe == "image") {
                            setProgress([...prog])
                        } else if (tipe == "drawing") {
                            setProgDrawing([...prog])
                        } else if (tipe == "survey") {
                            setProgSurvey([...prog])
                        } else if (tipe == "other") {
                            setProgOther([...prog])
                        } else if (tipe == "csc") {
                            setProgCSC([...prog])
                        } else if (tipe == "specification") {
                            setProgSpec([...prog])
                        } else if (tipe == "contract") {
                            setProgContract([...prog])
                        } else if (tipe == "invoice") {
                            setProgInvoice([...prog])
                        } else if (tipe == "original") {
                            setProgOriginal([...prog])
                        }
                    }
                } catch(err) {
                    console.log(err)
                }
            }
            if (tipe == "image") {
                setBlob(bl)
            } else if (tipe == "drawing") {
                setBlobDrawing(bl)
            } else if (tipe == "survey") {
                setBlobSurvey(bl)
            } else if (tipe == "other") {
                setBlobOther(bl)
            } else if (tipe == "csc") {
                setBlobCSC(bl)
            } else if (tipe == "specification") {
                setBlobSpec(bl)
            } else if (tipe == "contract") {
                setBlobContract(bl)
            } else if (tipe == "invoice") {
                setBlobInvoice(bl)
            } else if (tipe == "original") {
                setBlobOriginal(bl)
            }
        }
    }

    const downloadFile = async (tipe,key,link,mime,name) => {
        var bl = null
        if (tipe == "image") {
            bl = [...blob]
        } else if (tipe == "drawing") {
            bl = [...blobDrawing]
        } else if (tipe == "survey") {
            bl = [...blobSurvey]
        } else if (tipe == "other") {
            bl = [...blobOther]
        } else if (tipe == "csc") {
            bl = [...blobCSC]
        } else if (tipe == "specification") {
            bl = [...blobSpec]
        } else if (tipe == "contract") {
            bl = [...blobContract]
        } else if (tipe == "invoice") {
            bl = [...blobInvoice]
        } else if (tipe == "original") {
            bl = [...blobOriginal]
        }
        if (bl[key].size > 0) {
            if (mime.includes("image/")) {
                setSelView({content: tipe, key:key, name:name, tipe:mime, blob:bl[key]})
                setOpenView(true)
            } else {
                if (openView) {
                    setSelView({content: tipe, key:key, name:name, tipe:mime, blob:bl[key]})
                } else {
                    var url = window.URL.createObjectURL(bl[key])
                    var tmpLink = document.createElement("a")
                    tmpLink.href = url
                    if (mime.includes("application/pdf")) {
                        tmpLink.setAttribute('target','_blank')
                    } else {
                        tmpLink.setAttribute('download', name)
                    }
                    tmpLink.click()
                }
            }
        } else {
            var prog = null
            var bar = null
            if (tipe == "image") {
                prog = [...progress]
                prog[key] = 1
                setProgress([...prog])
                bar = [...displayBar]
            } else if (tipe == "drawing") {
                prog = [...progDrawing]
                prog[key] = 1
                setProgDrawing([...prog])
                bar = [...barDrawing]
            } else if (tipe == "survey") {
                prog = [...progSurvey]
                prog[key] = 1
                setProgSurvey([...prog])
                bar = [...barSurvey]
            } else if (tipe == "other") {
                prog = [...progOther]
                prog[key] = 1
                setProgOther([...prog])
                bar = [...barOther]
            } else if (tipe == "csc") {
                prog = [...progCSC]
                prog[key] = 1
                setProgCSC([...prog])
                bar = [...barCSC]
            } else if (tipe == "specification") {
                prog = [...progSpec]
                prog[key] = 1
                setProgSpec([...prog])
                bar = [...barSpec]
            } else if (tipe == "contract") {
                prog = [...progContract]
                prog[key] = 1
                setProgContract([...prog])
                bar = [...barContract]
            } else if (tipe == "invoice") {
                prog = [...progInvoice]
                prog[key] = 1
                setProgInvoice([...prog])
                bar = [...barInvoice]
            } else if (tipe == "original") {
                prog = [...progOriginal]
                prog[key] = 1
                setProgOriginal([...prog])
                bar = [...barOriginal]
            }
            setSelView({content: tipe, key:key, name:name, tipe:mime, blob:null})
            try {
                var response = await downloadFileSecApi(link)
                if (response.status == 200) {
                    var reader = response.body.getReader()
                    var len = parseInt(response.headers.get("Content-Length"))
                    var receiveLen = 0
                    var chunks = []
                    var bar = [...displayBar]
                    while (true) {
                        const {done, value} = await reader.read()
                        if (done) {
                            break
                        }
                        chunks.push(value)
                        receiveLen += value.length
                        bar[key] = Math.round(parseInt(receiveLen / len * 100))
                        if (tipe == "image") {
                            setDisplayBar([...bar])
                        } else if (tipe == "drawing") {
                            setBarDrawing([...bar])
                        } else if (tipe == "survey") {
                            setBarSurvey([...bar])
                        } else if (tipe == "other") {
                            setBarOther([...bar])
                        } else if (tipe == "csc") {
                            setBarCSC([...bar])
                        } else if (tipe == "specification") {
                            setBarSpec([...bar])
                        } else if (tipe == "contract") {
                            setBarContract([...bar])
                        } else if (tipe == "invoice") {
                            setBarInvoice([...bar])
                        } else if (tipe == "original") {
                            setBarOriginal([...bar])
                        }
                    }
                    bl[key] = new Blob(chunks, {type:mime})
                    if (tipe == "image") {
                        setBlob(bl)
                    } else if (tipe == "drawing") {
                        setBlobDrawing(bl)
                    } else if (tipe == "survey") {
                        setBlobSurvey(bl)
                    } else if (tipe == "other") {
                        setBlobOther(bl)
                    } else if (tipe == "csc") {
                        setBlobCSC(bl)
                    } else if (tipe == "specification") {
                        setBlobSpec(bl)
                    } else if (tipe == "contract") {
                        setBlobContract(bl)
                    } else if (tipe == "invoice") {
                        setBlobInvoice(bl)
                    } else if (tipe == "original") {
                        setBlobOriginal(bl)
                    }
                    if (mime.includes("image/")) {
                        setSelView({content: tipe, key:key, name:name, tipe:mime, blob:bl[key]})
                        setOpenView(true)
                    } else {
                        // prog[key] = 2
                        if (openView) {
                            setSelView({content: tipe, key:key, name:name, tipe:mime, blob:bl[key]})
                        } else {
                            var url = window.URL.createObjectURL(bl[key])
                            var tmpLink = document.createElement("a")
                            tmpLink.href = url
                            if (mime.includes("application/pdf")) {
                                tmpLink.setAttribute('target','_blank')
                            } else {
                                tmpLink.setAttribute('download', name)
                            }
                            tmpLink.click()
                        }
                    }
                }
                prog[key] = 0
                if (tipe == "image") {
                    setProgress([...prog])
                } else if (tipe == "drawing") {
                    setProgDrawing([...prog])
                } else if (tipe == "survey") {
                    setProgSurvey([...prog])
                } else if (tipe == "other") {
                    setProgOther([...prog])
                } else if (tipe == "csc") {
                    setProgCSC([...prog])
                } else if (tipe == "specification") {
                    setProgSpec([...prog])
                } else if (tipe == "contract") {
                    setProgContract([...prog])
                } else if (tipe == "invoice") {
                    setProgInvoice([...prog])
                } else if (tipe == "original") {
                    setProgOriginal([...prog])
                }
            } catch(err) {
                console.log(err)
            }
        }
    }

    const closeForm = () => {
        setOpenView(false)
    }

    const openFile = () => {
        var data = selView.blob
        var url = window.URL.createObjectURL(data)
        var tmpLink = document.createElement("a")
        tmpLink.href = url
        tmpLink.setAttribute('download',selView.name)
        tmpLink.click()
    }

    const nextFile = (content) => {
        var newKey = selView.key + 1
        if (content == "image") {
            if (newKey == container.images.length) {
                newKey = 0
            }
            downloadFile(content,newKey,container.images[newKey].link,container.images[newKey].content_type,container.images[newKey].label)
        } else if (content == "drawing") {
            if (newKey == container.drawings.length) {
                newKey = 0
            }
            downloadFile(content,newKey,container.drawings[newKey].link,container.drawings[newKey].content_type,container.drawings[newKey].label)
        } else if (content == "survey") {
            if (newKey == container.surveys.length) {
                newKey = 0
            }
            downloadFile(content,newKey,container.surveys[newKey].link,container.surveys[newKey].content_type,container.surveys[newKey].label)
        } else if (content == "other") {
            if (newKey == container.relative_documents.length) {
                newKey = 0
            }
            downloadFile(content,newKey,container.relative_documents[newKey].link,container.relative_documents[newKey].content_type,container.relative_documents[newKey].label)
        } else if (content == "csc") {
            if (newKey == container.csc_certificates.length) {
                newKey = 0
            }
            downloadFile(content,newKey,container.csc_certificates[newKey].link,container.csc_certificates[newKey].content_type,container.csc_certificates[newKey].label)
        } else if (content == "specification") {
            if (newKey == container.specifications.length) {
                newKey = 0
            }
            downloadFile(content,newKey,container.specifications[newKey].link,container.specifications[newKey].content_type,container.specifications[newKey].label)
        } else if (content == "contract") {
            if (newKey == container.contracts.length) {
                newKey = 0
            }
            downloadFile(content,newKey,container.contracts[newKey].link,container.contracts[newKey].content_type,container.contracts[newKey].label)
        } else if (content == "invoice") {
            if (newKey == container.invoices.length) {
                newKey = 0
            }
            downloadFile(content,newKey,container.invoices[newKey].link,container.invoices[newKey].content_type,container.invoices[newKey].label)
        } else if (content == "original") {
            if (newKey == container.original_photos.length) {
                newKey = 0
            }
            downloadFile(content,newKey,container.original_photos[newKey].link,container.original_photos[newKey].content_type,container.original_photos[newKey].label)
        }
    }

    const prevFile = (content) => {
        var newKey = selView.key - 1
        if (content == "image") {
            if (newKey < 0) {
                newKey = container.images.length - 1
            }
            downloadFile(content,newKey,container.images[newKey].link,container.images[newKey].content_type,container.images[newKey].label)
        } else if (content == "drawing") {
            if (newKey < 0) {
                newKey = container.drawings.length - 1
            }
            downloadFile(content,newKey,container.drawings[newKey].link,container.drawings[newKey].content_type,container.drawings[newKey].label)
        } else if (content == "survey") {
            if (newKey < 0) {
                newKey = container.surveys.length - 1
            }
            downloadFile(content,newKey,container.surveys[newKey].link,container.surveys[newKey].content_type,container.surveys[newKey].label)
        } else if (content == "other") {
            if (newKey < 0) {
                newKey = container.relative_documents.length - 1
            }
            downloadFile(content,newKey,container.relative_documents[newKey].link,container.relative_documents[newKey].content_type,container.relative_documents[newKey].label)
        } else if (content == "csc") {
            if (newKey < 0) {
                newKey = container.csc_certificates.length - 1
            }
            downloadFile(content,newKey,container.csc_certificates[newKey].link,container.csc_certificates[newKey].content_type,container.csc_certificates[newKey].label)
        } else if (content == "specification") {
            if (newKey < 0) {
                newKey = container.specifications.length - 1
            }
            downloadFile(content,newKey,container.specifications[newKey].link,container.specifications[newKey].content_type,container.specifications[newKey].label)
        } else if (content == "contract") {
            if (newKey < 0) {
                newKey = container.contracts.length - 1
            }
            downloadFile(content,newKey,container.contracts[newKey].link,container.contracts[newKey].content_type,container.contracts[newKey].label)
        } else if (content == "invoice") {
            if (newKey < 0) {
                newKey = container.invoices.length - 1
            }
            downloadFile(content,newKey,container.invoices[newKey].link,container.invoices[newKey].content_type,container.invoices[newKey].label)
        } else if (content == "original") {
            if (newKey < 0) {
                newKey = container.original_photos.length - 1
            }
            downloadFile(content,newKey,container.original_photos[newKey].link,container.original_photos[newKey].content_type,container.original_photos[newKey].label)
        }
    }

    // const downloadAttach = async (link,name) => {
    //     if (blobAttach[name].size > 0) {
    //         if (typeAttach[name].includes("image/")) {
    //             setSelView({key:name, name:name, blob:blobAttach[name]})
    //             setOpenView(true)
    //         } else {
    //             var url = window.URL.createObjectURL(blobAttach[name])
    //             var tmpLink = document.createElement("a")
    //             tmpLink.href = url
    //             tmpLink.setAttribute('target','_blank')
    //             tmpLink.click()
    //         }
    //     } else {
    //         try {
    //             var response = await downloadFileSecApi(link)
    //             if (response.status == 200) {
    //                 var reader = response.body.getReader()
    //                 var contenttype = response.headers.get("Content-Type")
    //                 var len = parseInt(response.headers.get("Content-Length"))
    //                 var receiveLen = 0
    //                 var chunks = []
    //                 var bar = {...barAttach}
    //                 while (true) {
    //                     const {done, value} = await reader.read()
    //                     if (done) {
    //                         break
    //                     }
    //                     chunks.push(value)
    //                     receiveLen += value.length
    //                     bar[name] = Math.round(parseInt(receiveLen / len * 100))
    //                     setBarAttach(bar)
    //                 }
    //                 var bl = {...blobAttach}
    //                 bl[name] = new Blob(chunks, {type:contenttype})
    //                 bar[name] = -1
    //                 setBlobAttach(bl)
    //                 setTypeAttach({...typeAttach, [name]:contenttype})
    //                 setBarAttach(bar)
    //                 if (contenttype.includes("image/")) {
    //                     setSelView({key:name, name:name, blob:bl[name]})
    //                     setOpenView(true)
    //                 } else {
    //                     var url = window.URL.createObjectURL(bl[name])
    //                     var tmpLink = document.createElement("a")
    //                     tmpLink.href = url
    //                     tmpLink.setAttribute('target','_blank')
    //                     tmpLink.click()
    //                 }
    //             }
    //         } catch(err) {
    //             console.log(err)
    //         }
    //     }
    // }

    const keyPress = (e,content) => {
        if (e.code == "ArrowRight") {
            nextFile(content)
        } else if (e.code == "ArrowLeft") {
            prevFile(content)
        }
    }

    const [loadProgress, setLoadProgress] = useState({all:false,image:false,csc:false,specification:false,contract:false,invoice:false,drawing:false,survey:false,other:false,original:false})
    const [loadBar, setLoadBar] = useState({all:0,image:0,csc:0,specification:0,contract:0,invoice:0,drawing:0,survey:0,other:0,original:0})

    const downloadAll = async (cat) => {
        try {
            var progress = {...loadProgress}
            if (cat == "all") {
                if (progress.all) {
                    return
                }
                progress.all = true
            } else if (cat == "images") {
                if (progress.image) {
                    return
                }
                progress.image = true
            } else if (cat == "csc_certificates") {
                if (progress.csc) {
                    return
                }
                progress.csc = true
            } else if (cat == "specifications") {
                if (progress.specification) {
                    return
                }
                progress.specification = true
            } else if (cat == "contracts") {
                if (progress.contract) {
                    return
                }
                progress.contract = true
            } else if (cat == "invoices") {
                if (progress.invoice) {
                    return
                }
                progress.invoice = true
            } else if (cat == "drawings") {
                if (progress.drawing) {
                    return
                }
                progress.drawing = true
            } else if (cat == "surveys") {
                if (progress.survey) {
                    return
                }
                progress.survey = true
            } else if (cat == "relative_documents") {
                if (progress.other) {
                    return
                }
                progress.other = true
            } else if (cat == "original_photos") {
                if (progress.original) {
                    return
                }
                progress.original = true
            }
            setLoadProgress({...progress})
            var param = {list_id:[container.id], tipe:cat}
            var response = await downloadContainerApi(param)
            if (response.status == 200) {
                var reader = response.body.getReader()
                var len = parseInt(response.headers.get("Content-Length"))
                var filename = response.headers.get("X-Filename")
                var receiveLen = 0
                var chunks = []
                var bar = {...loadBar}
                while (true) {
                    const {done, value} = await reader.read()
                    if (done) {
                        break
                    }
                    chunks.push(value)
                    receiveLen += value.length
                    if (cat == "all") {
                        bar.all = Math.round(parseInt(receiveLen / len * 100))
                    } else if (cat == "images") {
                        bar.image = Math.round(parseInt(receiveLen / len * 100))
                    } else if (cat == "csc_certificates") {
                        bar.csc = Math.round(parseInt(receiveLen / len * 100))
                    } else if (cat == "specifications") {
                        bar.specification = Math.round(parseInt(receiveLen / len * 100))
                    } else if (cat == "contracts") {
                        bar.contract = Math.round(parseInt(receiveLen / len * 100))
                    } else if (cat == "invoices") {
                        bar.invoice = Math.round(parseInt(receiveLen / len * 100))
                    } else if (cat == "drawings") {
                        bar.drawing = Math.round(parseInt(receiveLen / len * 100))
                    } else if (cat == "surveys") {
                        bar.survey = Math.round(parseInt(receiveLen / len * 100))
                    } else if (cat == "relative_documents") {
                        bar.other = Math.round(parseInt(receiveLen / len * 100))
                    } else if (cat == "original_photos") {
                        bar.original = Math.round(parseInt(receiveLen / len * 100))
                    }
                    setLoadBar({...bar})
                }
                if (cat == "all") {
                    bar.all = 0
                    progress.all = false
                } else if (cat == "images") {
                    bar.image = 0
                    progress.image = false
                } else if (cat == "csc_certificates") {
                    bar.csc = 0
                    progress.csc = false
                } else if (cat == "specifications") {
                    bar.specification = 0
                    progress.specification = false
                } else if (cat == "contracts") {
                    bar.contract = 0
                    progress.contract = false
                } else if (cat == "invoices") {
                    bar.invoice = 0
                    progress.invoice = false
                } else if (cat == "drawings") {
                    bar.drawing = 0
                    progress.drawing = false
                } else if (cat == "surveys") {
                    bar.survey = 0
                    progress.survey = false
                } else if (cat == "relative_documents") {
                    bar.other = 0
                    progress.other = false
                } else if (cat == "original_photos") {
                    bar.original = 0
                    progress.original = false
                }
                var bl = new Blob(chunks, {type:"application/zip"})
                var url = window.URL.createObjectURL(bl)
                var tmpLink = document.createElement("a")
                tmpLink.href = url
                tmpLink.setAttribute('download',filename)
                tmpLink.click()
                setLoadBar({...bar})
                setLoadProgress({...progress})
            } else {
                if (cat == "all") {
                    bar.all = 0
                    progress.all = false
                } else if (cat == "images") {
                    bar.image = 0
                    progress.image = false
                } else if (cat == "csc_certificates") {
                    bar.csc = 0
                    progress.csc = false
                } else if (cat == "specifications") {
                    bar.specification = 0
                    progress.specification = false
                } else if (cat == "contracts") {
                    bar.contract = 0
                    progress.contract = false
                } else if (cat == "invoices") {
                    bar.invoice = 0
                    progress.invoice = false
                } else if (cat == "drawings") {
                    bar.drawing = 0
                    progress.drawing = false
                } else if (cat == "surveys") {
                    bar.survey = 0
                    progress.survey = false
                } else if (cat == "relative_documents") {
                    bar.other = 0
                    progress.other = false
                } else if (cat == "original_photos") {
                    bar.original = 0
                    progress.original = false
                }
                setLoadBar({...bar})
                setLoadProgress({...progress})
            }
        } catch(err) {
            console.log(err)
        }
    }

    const [openMenu, setOpenMenu] = useState(false);
    const anchorRef = useRef(null);

    const handleMenuItemClick = async (e) => {
        e.preventDefault()
        if (!loadProgress.all) {
            await downloadAll("all")
            setOpenMenu(false)
        }
    }
    
    const handleToggle = () => {
        if (!loadProgress.all) {
            setOpenMenu(!openMenu)
        }
    }

    const handleClose = (event) => {
        if (!loadProgress.all) {
            if (anchorRef.current && anchorRef.current.contains(event.target)) {
                return
            }
            setOpenMenu(false)
        }
    }

    const [hidden, setHidden] = useState({image:[],csc:[],specification:[],contract:[],invoice:[],drawing:[],survey:[],other:[],original:[]})
    const [openDial, setOpenDial] = useState({image:[],csc:[],specification:[],contract:[],invoice:[],drawing:[],survey:[],other:[],original:[]})

    const handleHidden = (tipe, key, state) => {
        var hiddenState = {...hidden}
        for (var i=0; i<hidden[tipe].length; i++) {
            hiddenState[tipe][i] = true
        }
        hiddenState[tipe][key] = state
        setHidden(hiddenState)
    }

    const handleOpenDial = (tipe, key, state) => {
        var dialState = {...openDial}
        dialState[tipe][key] = state
        setOpenDial(dialState)
    }

    const [openLabel, setOpenLabel] = useState(false)
    const [record, setRecord] = useState({field:null,key:null,link:null,label:null})

    const editLabel = (field, key, link, label) => {
        setRecord({field:field,key:key,link:link,label:label})
        // if (field == "images") {
        //     handleOpenDial("image",key,false)
        // } else if (field == "csc_certificates") {
        //     handleOpenDial("csc",key,false)
        // } else if (field == "specifications") {
        //     handleOpenDial("specification",key,false)
        // } else if (field == "contracts") {
        //     handleOpenDial("contract",key,false)
        // } else if (field == "invoices") {
        //     handleOpenDial("invoice",key,false)
        // } else if (field == "drawings") {
        //     handleOpenDial("drawing",key,false)
        // } else if (field == "surveys") {
        //     handleOpenDial("survey",key,false)
        // } else if (field == "relative_documents") {
        //     handleOpenDial("other",key,false)
        // }
        setOpenLabel(true)
    }

    const closeEditLabel = () => {
        setOpenLabel(false)
        if (record.field == "images") {
            handleOpenDial("image",record.key,false)
            handleHidden("image",record.key,true)
        } else if (record.field == "csc_certificates") {
            handleOpenDial("csc",record.key,false)
            handleHidden("csc",record.key,true)
        } else if (record.field == "specifications") {
            handleOpenDial("specification",record.key,false)
            handleHidden("specification",record.key,true)
        } else if (record.field == "contracts") {
            handleOpenDial("contract",record.key,false)
            handleHidden("contract",record.key,true)
        } else if (record.field == "invoices") {
            handleOpenDial("invoice",record.key,false)
            handleHidden("invoice",record.key,true)
        } else if (record.field == "drawings") {
            handleOpenDial("drawing",record.key,false)
            handleHidden("drawing",record.key,true)
        } else if (record.field == "surveys") {
            handleOpenDial("survey",record.key,false)
            handleHidden("survey",record.key,true)
        } else if (record.field == "relative_documents") {
            handleOpenDial("other",record.key,false)
            handleHidden("other",record.key,true)
        } else if (record.field == "original_photos") {
            handleOpenDial("original",record.key,false)
            handleHidden("original",record.key,true)
        }
    }

    const [openAttach, setOpenAttach] = useState(false)
    const [field, setField] = useState(null)

    const addAttachment = (fld) => {
        setField(fld)
        setOpenAttach(true)
    }

    const closeAttachment = () => {
        setOpenAttach(false)
    }

    const [movePick, setMovePick] = useState({image:false,csc:false,specification:false,contract:false,invoice:false,drawing:false,survey:false,other:false,original:false})
    const [listKey, setListKey] = useState({image:[],csc:[],specification:[],contract:[],invoice:[],drawing:[],survey:[],other:[],original:[]})
    const [listCheck, setListCheck] = useState({image:[],csc:[],specification:[],contract:[],invoice:[],drawing:[],survey:[],other:[],original:[]})
    const [openMove, setOpenMove] = useState(false)
    const [origin, setOrigin] = useState("")
    const [list, setList] = useState([])

    const togglePick = (tipe) => {
        if (movePick[tipe]) {
            var check = {...listCheck}
            for (var i=0; i<check[tipe].length; i++) {
                check[tipe][i] = false
            }
            setListKey({...listKey, [tipe]:[]})
            setListCheck(check)
        }
        setMovePick({...movePick, [tipe]:!movePick[tipe]})
    }

    const onCheckChange = (event,key,tipe) => {
        var list = {...listKey}
        var check = {...listCheck}
        check[tipe][key] = event.target.checked
        if (event.target.checked) {
            list[tipe].push(key)
        } else {
            for (var j=0; j<list[tipe].length; j++) {
                if (list[tipe][j] == key) {
                    list[tipe].splice(j,1)
                }
            }
        }
        setListKey(list)
        setListCheck(check)
    }

    const moveAttachment = (tipe) => {
        if (container[tipe] != null) {
            if (container[tipe].length > 0) {
                if (tipe == "images") {
                    setList(listKey.image)
                } else if (tipe == "csc_certificates") {
                    setList(listKey.csc)
                } else if (tipe == "specifications") {
                    setList(listKey.specification)
                } else if (tipe == "contracts") {
                    setList(listKey.contract)
                } else if (tipe == "invoices") {
                    setList(listKey.invoice)
                } else if (tipe == "drawings") {
                    setList(listKey.drawing)
                } else if (tipe == "surveys") {
                    setList(listKey.survey)
                } else if (tipe == "relative_documents") {
                    setList(listKey.other)
                } else if (tipe == "original_photos") {
                    setList(listKey.original)
                }
                setOrigin(tipe)
                setOpenMove(true)
            } else {
                showToast("No attachment")
            }
        } else {
            showToast("No attachment")
        }
    }

    const closeMove = () => {
        if (origin == "images") {
            var check = {...listCheck}
            for (var i=0; i<check.image.length; i++) {
                check.image[i] = false
            }
            setListKey({...listKey, image:[]})
            setListCheck(check)
            setMovePick({...movePick, image:false})
        } else if (origin == "csc_certificates") {
            var check = {...listCheck}
            for (var i=0; i<check.csc.length; i++) {
                check.csc[i] = false
            }
            setListKey({...listKey, csc:[]})
            setListCheck(check)
            setMovePick({...movePick, csc:false})
        } else if (origin == "specifications") {
            var check = {...listCheck}
            for (var i=0; i<check.specification.length; i++) {
                check.specification[i] = false
            }
            setListKey({...listKey, specification:[]})
            setListCheck(check)
            setMovePick({...movePick, specification:false})
        } else if (origin == "contracts") {
            var check = {...listCheck}
            for (var i=0; i<check.contract.length; i++) {
                check.contract[i] = false
            }
            setListKey({...listKey, contract:[]})
            setListCheck(check)
            setMovePick({...movePick, contract:false})
        } else if (origin == "invoices") {
            var check = {...listCheck}
            for (var i=0; i<check.invoice.length; i++) {
                check.invoice[i] = false
            }
            setListKey({...listKey, invoice:[]})
            setListCheck(check)
            setMovePick({...movePick, invoice:false})
        } else if (origin == "drawings") {
            var check = {...listCheck}
            for (var i=0; i<check.drawing.length; i++) {
                check.drawing[i] = false
            }
            setListKey({...listKey, drawing:[]})
            setListCheck(check)
            setMovePick({...movePick, drawing:false})
        } else if (origin == "surveys") {
            var check = {...listCheck}
            for (var i=0; i<check.survey.length; i++) {
                check.survey[i] = false
            }
            setListKey({...listKey, survey:[]})
            setListCheck(check)
            setMovePick({...movePick, survey:false})
        } else if (origin == "relative_documents") {
            var check = {...listCheck}
            for (var i=0; i<check.other.length; i++) {
                check.other[i] = false
            }
            setListKey({...listKey, other:[]})
            setListCheck(check)
            setMovePick({...movePick, other:false})
        } else if (origin == "original_photos") {
            var check = {...listCheck}
            for (var i=0; i<check.original.length; i++) {
                check.original[i] = false
            }
            setListKey({...listKey, original:[]})
            setListCheck(check)
            setMovePick({...movePick, original:false})
        }
        setList([])
        setOrigin("")
        setOpenMove(false)
    }

    const [view, setView] = useState("")

    const changeView = (vw) => {
        switchView(vw)
        setView(vw)
    }

    return (
        <StockContainerLayout serialNumber={container?.serial_number} title={`Stock: ${container?.serial_number}`}>
            <Box className="display-space-between mb-3" style={{backgroundImage:titleBackground}}>
                <Box className="mb-3" style={{marginTop:15}}>
                    <Box className={classes.title}>{container?.serial_number.substring(0,10)}</Box>
                    {container?.check_digit == true &&
                    <Box className={classes.title}>{container?.serial_number.substring(10)}</Box>}
                    {container?.check_digit != true &&
                    <Tooltip title="Invalid check digit" placement="right">
                        <Box className={classes.title} style={{color:"red"}}>{container?.serial_number.substring(10)}</Box>
                    </Tooltip>}
                </Box>
                <ButtonGroup variant="outlined" color="default" ref={anchorRef} aria-label="split button">
                    <Button
                        variant="outlined" 
                        size="small"
                        onClick={() => setOpenFormEdit(true)}
                        color="default">
                        <Icon className="me-2">edit</Icon>Edit Stock
                    </Button>
                    <Button
                          size="small"
                          aria-controls={openMenu ? 'split-button-menu' : undefined}
                          aria-expanded={openMenu ? 'true' : undefined}
                          onClick={handleToggle}
                          aria-label="select merge strategy"
                          aria-haspopup="menu">
                          <Icon>arrow_drop_down</Icon>
                      </Button>
                </ButtonGroup>
                <Popper open={openMenu} anchorEl={anchorRef.current} role={undefined} transition disablePortal className={classes.popper}>
                {({ TransitionProps, placement }) => (
                    <Grow {...TransitionProps} style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}>
                    <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                            <MenuList id="split-button-menu">
                                <MenuItem onClick={(e) => handleMenuItemClick(e)}>
                                    {loadProgress.all ? <React.Fragment><CircularProgress variant="determinate" size={26} value={loadBar.all} />&nbsp;{`${loadBar.all}%`}, please wait...</React.Fragment> : <React.Fragment><GetApp />&nbsp;Download Data</React.Fragment>}
                                </MenuItem>
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                    </Grow>
                )}
                </Popper>
            </Box>
            <Divider />
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="simple tabs">
                <Tab label="Detail" id="simple-tab-0" aria-controls="simple-tabpanel-0" />
                <Tab label="Images" id="simple-tab-1" aria-controls="simple-tabpanel-1" />
                <Tab label="Attachment" id="simple-tab-2" aria-controls="simple-tabpanel-2" />
                <Tab label="Movement History" id="simple-tab-3" aria-controls="simple-tabpanel-3" />
                <Tab label="Stock Status History" id="simple-tab-4" aria-controls="simple-tabpanel-4" />
                <Tab label="Condition History" id="simple-tab-5" aria-controls="simple-tabpanel-5" />
                <Tab label="Repair History" id="simple-tab-6" aria-controls="simple-tabpanel-6" />
            </Tabs>
            <Box role="tabpanel" hidden={tabValue !== 0} id="simple-tabpanel-0" aria-labelledby="simple-tab-0">
                <Box variant="outlined" className="p-4 mb-5 card">
                    <Box className="container-detail-wrapper mb-3">
                        <Grid container>
                            <Grid item md={4}>
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Size/Type</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{container?.size?.name}ft {container?.type?.name}</Typography>
                                    </Box>
                                </Box>
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Status</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>
                                            {container?.stock_status?.name}
                                            {(container?.stock_status_id == 1005)? " ("+container?.available_status.join(",")+")" : ""}
                                            {(container?.stock_status_id == 1001)? " until "+Moment(container?.hold_end_date).format("LL") : ""}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Date In Stock</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{container?.date_in_stock? Moment(container?.date_in_stock).format("LLL") : "-"}</Typography>
                                    </Box>
                                </Box>
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Gate In</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{(container?.stock_status_id != 1002 && container?.stock_status_id != 1003 && container?.gate_in_date != null)? Moment(container?.gate_in_date).format("LLL") : "-"} {(container?.stock_status_id != 1002 && container?.stock_status_id != 1003 && container?.gate_in_date != null)? "("+countDays(container?.gate_in_date)+")" : ""}</Typography>
                                    </Box>
                                </Box>
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Condition</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{container?.condition_id? container?.condition?.name : "-"} ({container?.percentage ?? 0}%)</Typography>
                                    </Box>
                                </Box>
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Delivery Status</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{container?.delivery_status_id? container?.delivery_status?.name : "-"}</Typography>
                                    </Box>
                                </Box>
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Location</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{container?.country_id? container?.country?.name : "-"}{container?.city_id? ", "+container?.city.name : ""}</Typography>
                                    </Box>
                                </Box>
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Supplier Invoice</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{container?.supplier_invoice? container.supplier_invoice : "-"}</Typography>
                                    </Box>
                                </Box>
                                {isPermit("component","selling_price_container") &&
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Selling Price</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{currency(container?.selling_price, container?.selling_currency+" ")}</Typography>
                                    </Box>
                                </Box>}
                                {isPermit("component","cost_price_container") &&
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Depot Fee</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{currency(container?.depo_fee_cost, container?.depo_fee_currency+" ")}</Typography>
                                    </Box>
                                </Box>}
                                {isPermit("component","cost_price_container") &&
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Trucking Cost</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{currency(container?.trucking_cost, container?.trucking_currency+" ")}</Typography>
                                    </Box>
                                </Box>}
                                {isPermit("component","cost_price_container") &&
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Custom Clearance</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{currency(container?.custom_clearance_cost, container?.custom_clearance_currency+" ")}</Typography>
                                    </Box>
                                </Box>}
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Depot Release</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{container?.depo_release? container.depo_release : "-"}</Typography>
                                    </Box>
                                </Box>
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Owner</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{container?.owner? container.owner : "-"}</Typography>
                                    </Box>
                                </Box>
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Remarks</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{container?.remarks? container.remarks : "-"}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item md={4}>
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Color</Typography>
                                    </Box>
                                    <Box>
                                        {container?.color_code &&
                                        <Chip label={container?.color_name} style={{backgroundColor:container?.color.html_code}} />}
                                        {!container?.color_code &&
                                        <Typography variant="body1" gutterBottom>{container?.color_name? container.color_name : "-"}</Typography>}
                                    </Box>
                                </Box>
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>YOM</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{container?.yom_year? Moment(container?.yom_month+"-"+container?.yom_year,"MM-YYYY").format("MMMM YYYY") : "-"}</Typography>
                                    </Box>
                                </Box>
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Date Out Stock</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{container?.date_out_stock? Moment(container?.date_out_stock).format("LLL") : "-"}</Typography>
                                    </Box>
                                </Box>
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Gate Out</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{((container?.stock_status_id == 1002 || container?.stock_status_id == 1003) && container?.gate_out_date != null)? Moment(container?.gate_out_date).format("LLL") : "-"}</Typography>
                                    </Box>
                                </Box>
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Status Repair</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{container?.repair_status_id? container.repair_status.name : "-"}</Typography>
                                    </Box>
                                </Box>
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Carrier</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{container?.carrier? container.carrier : "-"}</Typography>
                                    </Box>
                                </Box>
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Depot</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{container?.depo_id? container?.depo?.name : "-"}</Typography>
                                    </Box>
                                </Box>
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Supplier Release</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{container?.supplier_release? container.supplier_release : "-"}</Typography>
                                    </Box>
                                </Box>
                                {isPermit("component","cost_price_container") &&
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Cost Price</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{currency(container?.cost_price, container?.cost_currency+" ")}</Typography>
                                    </Box>
                                </Box>}
                                {isPermit("component","cost_price_container") &&
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Survey Cost</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{currency(container?.survey_cost, container?.survey_currency+" ")}</Typography>
                                    </Box>
                                </Box>}
                                {isPermit("component","cost_price_container") &&
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Shipping Cost</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{currency(container?.shipping_cost, container?.shipping_currency+" ")}</Typography>
                                    </Box>
                                </Box>}
                                {isPermit("component","cost_price_container") &&
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>&nbsp;</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>&nbsp;</Typography>
                                    </Box>
                                </Box>}
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>One Way Ref</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{container?.one_way_ref? container.one_way_ref : "-"}</Typography>
                                    </Box>
                                </Box>
                                <Box className="mb-3">
                                    <Box>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Redelivery Ref</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body1" gutterBottom>{container?.redelivery_ref? container.redelivery_ref : "-"}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item md={4}>
                                <Box className="display-space-between mb-3">
                                    <Box></Box>
                                    <Box>
                                        {container?.stock_reconcile &&
                                        <DoneOutline style={{color:"green",fontSize:60}} />}
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>  
                    </Box>
                </Box>
            </Box>
            <Box role="tabpanel" hidden={tabValue !== 1} id="simple-tabpanel-1" aria-labelledby="simple-tab-1">
                <Box variant="outlined" className="p-4 mb-5 card">
                    <Box className="container-detail-wrapper mb-3">
                        <Grid container className="page-container" spacing={5}>
                            <Grid item xs={12} md={12}>
                                <Box className="display-space-between">
                                    <Box display="flex">
                                        <Typography variant="subtitle1" color="textSecondary">Container Images</Typography>
                                        <Tooltip title="Add new Image" placement="top">
                                            <IconButton onClick={() => addAttachment("images")} size="small">
                                                <Icon>add</Icon>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Move Image" placement="top">
                                            <IconButton onClick={() => togglePick("image")} aria-label="move" size="small">
                                                <Icon>library_add_check</Icon>
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Box>
                                        <ButtonGroup variant="contained" color="default" aria-label="split button">
                                            <Tooltip title="List View" placement="top">
                                                <Button onClick={() => changeView("list") }>
                                                    <Icon>view_list</Icon>
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Grid View" placement="top">
                                                <Button onClick={() => changeView("grid") }>
                                                    <Icon>grid_view</Icon>
                                                </Button>
                                            </Tooltip>
                                            {movePick.image &&
                                            <Button onClick={() => moveAttachment("images")} startIcon={<Send />}>Move selected to</Button>}
                                            {(container?.images?.length > 0 && !movePick.image) &&
                                            <Button onClick={() => downloadAll("images")} startIcon={!loadProgress.image ? <GetApp /> : ""}>{loadProgress.image ? <React.Fragment><CircularProgress variant="determinate" size={26} value={loadBar.image} />&nbsp;{`${loadBar.image}%`}</React.Fragment> : "Download All Images"}</Button>}
                                        </ButtonGroup>
                                    </Box>
                                </Box>
                            </Grid>
                            {(view == "list" && container?.images?.length > 0) &&
                            <Grid item xs={12} md={12} className={classes.wrapper}>
                                <TableContainer>
                                    <Table size="small" aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell width={12}></TableCell>
                                                <TableCell width={12}></TableCell>
                                                <TableCell>File Name</TableCell>
                                                <TableCell width={12} />
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {container?.images?.map((item, key) => (
                                            <TableRow>
                                                <TableCell>
                                                    {movePick.image &&
                                                        <Checkbox
                                                        checked={listCheck.image[key]}
                                                        onClick={(e) => onCheckChange(e,key,"image")}
                                                        color="primary"
                                                    />}
                                                </TableCell>
                                                <TableCell>
                                                    {progress[key] == 0 &&
                                                    <Tooltip title={`Open ${item.label}`} placement="top">
                                                        <Link onClick={() => downloadFile("image",key,item.link,item.content_type,item.label)}><Icon>insert_drive_file</Icon></Link>
                                                    </Tooltip>}
                                                    {progress[key] == 1  &&
                                                    <Icon color="primary">insert_drive_file</Icon>}
                                                </TableCell>
                                                <TableCell>
                                                    {progress[key] == 0 &&
                                                    <Tooltip title={`Open ${item.label}`} placement="top">
                                                        <Link onClick={() => downloadFile("image",key,item.link,item.content_type,item.label)}>{item.label}</Link>
                                                    </Tooltip>}
                                                    {progress[key] == 1 &&
                                                    <Box>
                                                        <Typography color="primary" variant="body2">{item.label}</Typography>
                                                        <Box className={classes.pbar3} alignItems="center">
                                                            <Box width="100%" mr={1}>
                                                                <LinearProgress variant="determinate" value={displayBar[key]} />
                                                            </Box>
                                                            <Box minWidth={35}>
                                                                <Typography variant="body2" color="textSecondary">{`${displayBar[key]}%`}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>}
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title="Rename" placement="top">
                                                        <IconButton>
                                                            <EditAttributes onClick={() => editLabel("images",key,item.link,item.label)} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>}
                            {view == "grid" &&
                            <React.Fragment>
                            {container?.images?.map((item, key) => {
                                return <Grid item xs={12} md={2} className={classes.wrapper}>
                                    <Box className="card-small" onMouseEnter={() => handleHidden("image",key,false)} onMouseLeave={() => handleHidden("image",key,true)}>
                                        {movePick.image &&
                                        <Box class={classes.checkContainer}>
                                            <Checkbox
                                                checked={listCheck.image[key]}
                                                onClick={(e) => onCheckChange(e,key,"image")}
                                                color="primary"
                                            />
                                        </Box>}
                                        {progress[key] == 0 &&
                                        <Link onClick={() => downloadFile("image",key,item.link,item.content_type,item.label)}>
                                            <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                <img src={`data:image/jpeg;base64,${item.thumbnail}`} />
                                                <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                            </Box>
                                        </Link>}
                                        {progress[key] == 1 &&
                                        <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                            <Box class={classes.labelContainer}>
                                                <img src={`data:image/jpeg;base64,${item.thumbnail}`} />
                                                <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                            </Box>
                                            <Box class={classes.pContainer}>
                                                <Box class={classes.pbar}>
                                                    <CircularProgress variant="determinate" value={displayBar[key]} />
                                                    <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                                                        <Typography variant="body2" color="textSecondary">{`${displayBar[key]}%`}</Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>}
                                        <SpeedDial
                                            ariaLabel="Action"
                                            className={classes.speedDial}
                                            icon={<SpeedDialIcon icon={<MoreVert />} openIcon={<KeyboardArrowDown />} />}
                                            FabProps={{ size: "small" }}
                                            hidden={hidden.image[key]}
                                            direction="up"
                                            open={openDial.image[key]}
                                            onOpen={() => handleOpenDial("image",key,true)}
                                            onClose={() => handleOpenDial("image",key,false)}
                                        >
                                            <SpeedDialAction
                                                key="Rename"
                                                icon={<EditAttributes />}
                                                tooltipTitle="Rename"
                                                onClick={() => editLabel("images",key,item.link,item.label)}
                                            />
                                        </SpeedDial>
                                    </Box>
                                </Grid>
                            })}
                            </React.Fragment>}
                        </Grid>  
                    </Box>
                </Box>
            </Box>
            <Box role="tabpanel" hidden={tabValue !== 2} id="simple-tabpanel-2" aria-labelledby="simple-tab-2">
                <Box variant="outlined" className="p-4 mb-5 card">
                    <Box className="container-detail-wrapper mb-3">
                        <Grid container className="page-container" spacing={5}>
                            <Grid item md={12}>
                                <Box className="mb-3 display-space-between">
                                    <Box display="flex">
                                        <Typography variant="subtitle1" color="textSecondary">CSC Certificate</Typography>
                                        <Tooltip title="Add new CSC Certificate" placement="top">
                                            <IconButton onClick={() => addAttachment("csc_certificates")} size="small">
                                                <Icon>add</Icon>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Move CSC Certificate" placement="top">
                                            <IconButton onClick={() => togglePick("csc")} aria-label="move" size="small">
                                                <Icon>library_add_check</Icon>
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Box>
                                        <ButtonGroup variant="contained" color="default" aria-label="split button">
                                            <Tooltip title="List View" placement="top">
                                                <Button onClick={() => changeView("list") }>
                                                    <Icon>view_list</Icon>
                                                </Button>
                                            </Tooltip>
                                            <Tooltip title="Grid View" placement="top">
                                                <Button onClick={() => changeView("grid") }>
                                                    <Icon>grid_view</Icon>
                                                </Button>
                                            </Tooltip>
                                            {movePick.csc &&
                                            <Button onClick={() => moveAttachment("csc_certificates")} startIcon={<Send />}>Move selected to</Button>}
                                            {(container?.csc_certificates?.length > 0 && !movePick.csc) &&
                                            <Button onClick={() => downloadAll("csc_certificates")} startIcon={!loadProgress.csc ? <GetApp /> : ""}>{loadProgress.csc ? <React.Fragment><CircularProgress variant="determinate" size={26} value={loadBar.csc} />&nbsp;{`${loadBar.csc}%`}</React.Fragment> : "Download All CSC Certificates"}</Button>}
                                        </ButtonGroup>
                                    </Box>
                                </Box>
                            </Grid>
                            {/* <Grid item md={9}>
                                <Box className="mb-3">
                                    {barAttach.csc_certificate >= 0 &&
                                    <Box class={classes.pbar}>
                                        <CircularProgress variant="determinate" value={barAttach.csc_certificate} />
                                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                                            <Typography variant="caption" color="textSecondary">{`${barAttach.csc_certificate}%`}</Typography>
                                        </Box>
                                    </Box>}
                                    {barAttach.csc_certificate < 0 &&
                                    <Button variant="contained" disabled={container?.csc_certificate == ""? true : false} onClick={() => downloadAttach(container?.csc_certificate,"csc_certificate")} startIcon={<GetApp />}>Open</Button>}
                                </Box>
                            </Grid> */}
                            {(view == "list" && container?.csc_certificates?.length > 0) &&
                            <Grid item xs={12} md={12} className={classes.wrapper}>
                                <TableContainer>
                                    <Table size="small" aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell width={12}></TableCell>
                                                <TableCell width={12}></TableCell>
                                                <TableCell>File Name</TableCell>
                                                <TableCell width={12} />
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {container?.csc_certificates?.map((item, key) => (
                                            <TableRow>
                                                <TableCell>
                                                    {movePick.csc &&
                                                        <Checkbox
                                                        checked={listCheck.csc[key]}
                                                        onClick={(e) => onCheckChange(e,key,"csc")}
                                                        color="primary"
                                                    />}
                                                </TableCell>
                                                <TableCell>
                                                    {progCSC[key] == 0 &&
                                                    <Tooltip title={`Open ${item.label}`} placement="top">
                                                        <Link onClick={() => downloadFile("csc",key,item.link,item.content_type,item.label)}><Icon>insert_drive_file</Icon></Link>
                                                    </Tooltip>}
                                                    {progCSC[key] == 1  &&
                                                    <Icon color="primary">insert_drive_file</Icon>}
                                                </TableCell>
                                                <TableCell>
                                                    {progCSC[key] == 0 &&
                                                    <Tooltip title={`Open ${item.label}`} placement="top">
                                                        <Link onClick={() => downloadFile("csc",key,item.link,item.content_type,item.label)}>{item.label}</Link>
                                                    </Tooltip>}
                                                    {progCSC[key] == 1 &&
                                                    <Box>
                                                        <Typography color="primary" variant="body2">{item.label}</Typography>
                                                        <Box className={classes.pbar3} alignItems="center">
                                                            <Box width="100%" mr={1}>
                                                                <LinearProgress variant="determinate" value={barCSC[key]} />
                                                            </Box>
                                                            <Box minWidth={35}>
                                                                <Typography variant="body2" color="textSecondary">{`${barCSC[key]}%`}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>}
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title="Rename" placement="top">
                                                        <IconButton>
                                                            <EditAttributes onClick={() => editLabel("csc_certificates",key,item.link,item.label)} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>}
                            {view == "grid" &&
                            <React.Fragment>
                            {container?.csc_certificates?.map((item, key) => {
                                return <Grid item xs={12} md={2} className={classes.wrapper}>
                                    <Box className="card-small" onMouseEnter={() => handleHidden("csc",key,false)} onMouseLeave={() => handleHidden("csc",key,true)}>
                                        {movePick.csc &&
                                        <Box class={classes.checkContainer}>
                                            <Checkbox
                                                checked={listCheck.csc[key]}
                                                onClick={(e) => onCheckChange(e,key,"csc")}
                                                color="primary"
                                            />
                                        </Box>}
                                        {progCSC[key] == 0 &&
                                        <Link onClick={() => downloadFile("csc",key,item.link,item.content_type,item.label)}>
                                                {item.thumbnail == "" &&
                                                <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                    <Icon style={{fontSize: 50}}>insert_drive_file</Icon>
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>}
                                                {item.thumbnail != "" &&
                                                <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                    <img src={`data:image/jpeg;base64,${item.thumbnail}`} />
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>}
                                        </Link>}
                                        {progCSC[key] == 1 &&
                                        <React.Fragment>
                                            {item.thumbnail == "" &&
                                            <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                <Box class={classes.labelContainer}>
                                                    <Icon style={{fontSize: 50}}>insert_drive_file</Icon>
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>
                                                <Box class={classes.pContainer}>
                                                    <Box class={classes.pbar}>
                                                        <CircularProgress variant="determinate" value={barCSC[key]} />
                                                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                                                            <Typography variant="body2" color="textSecondary">{`${barCSC[key]}%`}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>}
                                            {item.thumbnail != "" &&
                                            <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                <Box class={classes.labelContainer}>
                                                    <img src={`data:image/jpeg;base64,${item.thumbnail}`} />
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>
                                                <Box class={classes.pContainer}>
                                                    <Box class={classes.pbar}>
                                                        <CircularProgress variant="determinate" value={barCSC[key]} />
                                                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                                                            <Typography variant="body2" color="textSecondary">{`${barCSC[key]}%`}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>}
                                        </React.Fragment>}
                                        <SpeedDial
                                            ariaLabel="Action"
                                            className={classes.speedDial}
                                            icon={<SpeedDialIcon icon={<MoreVert />} openIcon={<KeyboardArrowDown />} />}
                                            FabProps={{ size: "small" }}
                                            hidden={hidden.csc[key]}
                                            direction="up"
                                            open={openDial.csc[key]}
                                            onOpen={() => handleOpenDial("csc",key,true)}
                                            onClose={() => handleOpenDial("csc",key,false)}
                                        >
                                            <SpeedDialAction
                                                key="Rename"
                                                icon={<EditAttributes />}
                                                tooltipTitle="Rename"
                                                onClick={() => editLabel("csc_certificates",key,item.link,item.label)}
                                            />
                                        </SpeedDial>
                                    </Box>
                                </Grid>
                            })}
                            </React.Fragment>}
                            <Grid item md={12}>
                                <Divider />
                            </Grid>
                            <Grid item md={12}>
                                <Box className="mb-3 display-space-between">
                                    <Box display="flex">
                                        <Typography variant="subtitle1" color="textSecondary">Specification</Typography>
                                        <Tooltip title="Add new Specification" placement="top">
                                            <IconButton onClick={() => addAttachment("specifications")} size="small">
                                                <Icon>add</Icon>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Move Specification" placement="top">
                                            <IconButton onClick={() => togglePick("specification")} aria-label="move" size="small">
                                                <Icon>library_add_check</Icon>
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Box>
                                        {movePick.specification &&
                                        <Button variant="contained" onClick={() => moveAttachment("specifications")} startIcon={<Send />}>Move selected to</Button>}
                                        {(container?.specifications?.length > 0 && !movePick.specification) &&
                                        <Button variant="contained" onClick={() => downloadAll("specifications")} startIcon={!loadProgress.specification ? <GetApp /> : ""}>{loadProgress.specification ? <React.Fragment><CircularProgress variant="determinate" size={26} value={loadBar.specification} />&nbsp;{`${loadBar.specification}%`}</React.Fragment> : "Download All Specifications"}</Button>}
                                    </Box>
                                </Box>
                            </Grid>
                            {/* <Grid item md={9}>
                                <Box className="mb-3">
                                    {barAttach.specification >= 0 &&
                                    <Box class={classes.pbar}>
                                        <CircularProgress variant="determinate" value={barAttach.specification} />
                                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                                            <Typography variant="caption" color="textSecondary">{`${barAttach.specification}%`}</Typography>
                                        </Box>
                                    </Box>}
                                    {barAttach.specification < 0 &&
                                    <Button variant="contained" disabled={container?.specification == ""? true : false} onClick={() => downloadAttach(container?.specification,"specification")} startIcon={<GetApp />}>Open</Button>}
                                </Box>
                            </Grid> */}
                            {(view == "list" && container?.specifications?.length > 0) &&
                            <Grid item xs={12} md={12} className={classes.wrapper}>
                                <TableContainer>
                                    <Table size="small" aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell width={12}></TableCell>
                                                <TableCell width={12}></TableCell>
                                                <TableCell>File Name</TableCell>
                                                <TableCell width={12} />
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {container?.specifications?.map((item, key) => (
                                            <TableRow>
                                                <TableCell>
                                                    {movePick.specification &&
                                                        <Checkbox
                                                        checked={listCheck.specification[key]}
                                                        onClick={(e) => onCheckChange(e,key,"specification")}
                                                        color="primary"
                                                    />}
                                                </TableCell>
                                                <TableCell>
                                                    {progSpec[key] == 0 &&
                                                    <Tooltip title={`Open ${item.label}`} placement="top">
                                                        <Link onClick={() => downloadFile("specification",key,item.link,item.content_type,item.label)}><Icon>insert_drive_file</Icon></Link>
                                                    </Tooltip>}
                                                    {progSpec[key] == 1  &&
                                                    <Icon color="primary">insert_drive_file</Icon>}
                                                </TableCell>
                                                <TableCell>
                                                    {progSpec[key] == 0 &&
                                                    <Tooltip title={`Open ${item.label}`} placement="top">
                                                        <Link onClick={() => downloadFile("specification",key,item.link,item.content_type,item.label)}>{item.label}</Link>
                                                    </Tooltip>}
                                                    {progSpec[key] == 1 &&
                                                    <Box>
                                                        <Typography color="primary" variant="body2">{item.label}</Typography>
                                                        <Box className={classes.pbar3} alignItems="center">
                                                            <Box width="100%" mr={1}>
                                                                <LinearProgress variant="determinate" value={barSpec[key]} />
                                                            </Box>
                                                            <Box minWidth={35}>
                                                                <Typography variant="body2" color="textSecondary">{`${barSpec[key]}%`}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>}
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title="Rename" placement="top">
                                                        <IconButton>
                                                            <EditAttributes onClick={() => editLabel("specifications",key,item.link,item.label)} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>}
                            {view == "grid" &&
                            <React.Fragment>
                            {container?.specifications?.map((item, key) => {
                                return <Grid item xs={12} md={2} className={classes.wrapper}>
                                    <Box className="card-small" onMouseEnter={() => handleHidden("specification",key,false)} onMouseLeave={() => handleHidden("specification",key,true)}>
                                        {movePick.specification &&
                                        <Box class={classes.checkContainer}>
                                            <Checkbox
                                                checked={listCheck.specification[key]}
                                                onClick={(e) => onCheckChange(e,key,"specification")}
                                                color="primary"
                                            />
                                        </Box>}
                                        {progSpec[key] == 0 &&
                                        <Link onClick={() => downloadFile("specification",key,item.link,item.content_type,item.label)}>
                                                {item.thumbnail == "" &&
                                                <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                    <Icon style={{fontSize: 50}}>insert_drive_file</Icon>
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>}
                                                {item.thumbnail != "" &&
                                                <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                    <img src={`data:image/jpeg;base64,${item.thumbnail}`} />
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>}
                                        </Link>}
                                        {progSpec[key] == 1 &&
                                        <React.Fragment>
                                            {item.thumbnail == "" &&
                                            <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                <Box class={classes.labelContainer}>
                                                    <Icon style={{fontSize: 50}}>insert_drive_file</Icon>
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>
                                                <Box class={classes.pContainer}>
                                                    <Box class={classes.pbar}>
                                                        <CircularProgress variant="determinate" value={barSpec[key]} />
                                                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                                                            <Typography variant="body2" color="textSecondary">{`${barSpec[key]}%`}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>}
                                            {item.thumbnail != "" &&
                                            <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                <Box class={classes.labelContainer}>
                                                    <img src={`data:image/jpeg;base64,${item.thumbnail}`} />
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>
                                                <Box class={classes.pContainer}>
                                                    <Box class={classes.pbar}>
                                                        <CircularProgress variant="determinate" value={barSpec[key]} />
                                                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                                                            <Typography variant="body2" color="textSecondary">{`${barSpec[key]}%`}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>}
                                        </React.Fragment>}
                                        <SpeedDial
                                            ariaLabel="Action"
                                            className={classes.speedDial}
                                            icon={<SpeedDialIcon icon={<MoreVert />} openIcon={<KeyboardArrowDown />} />}
                                            FabProps={{ size: "small" }}
                                            hidden={hidden.specification[key]}
                                            direction="up"
                                            open={openDial.specification[key]}
                                            onOpen={() => handleOpenDial("specification",key,true)}
                                            onClose={() => handleOpenDial("specification",key,false)}
                                        >
                                            <SpeedDialAction
                                                key="Rename"
                                                icon={<EditAttributes />}
                                                tooltipTitle="Rename"
                                                onClick={() => editLabel("specifications",key,item.link,item.label)}
                                            />
                                        </SpeedDial>
                                    </Box>
                                </Grid>
                            })}
                            </React.Fragment>}
                            <Grid item md={12}>
                                <Divider />
                            </Grid>
                            <Grid item md={12}>
                                <Box className="mb-3 display-space-between">
                                    <Box display="flex">
                                        <Typography variant="subtitle1" color="textSecondary">Contract</Typography>
                                        <Tooltip title="Add new Contract" placement="top">
                                            <IconButton onClick={() => addAttachment("contracts")} size="small">
                                                <Icon>add</Icon>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Move Contract" placement="top">
                                            <IconButton onClick={() => togglePick("contract")} aria-label="move" size="small">
                                                <Icon>library_add_check</Icon>
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Box>
                                        {movePick.contract &&
                                        <Button variant="contained" onClick={() => moveAttachment("contracts")} startIcon={<Send />}>Move selected to</Button>}
                                        {(container?.contracts?.length > 0 && !movePick.contract) &&
                                        <Button variant="contained" onClick={() => downloadAll("contracts")} startIcon={!loadProgress.contract ? <GetApp /> : ""}>{loadProgress.contract ? <React.Fragment><CircularProgress variant="determinate" size={26} value={loadBar.contract} />&nbsp;{`${loadBar.contract}%`}</React.Fragment> : "Download All Contracts"}</Button>}
                                    </Box>
                                </Box>
                            </Grid>
                            {/* <Grid item md={9}>
                                <Box className="mb-3">
                                    {barAttach.contract >= 0 &&
                                    <Box class={classes.pbar}>
                                        <CircularProgress variant="determinate" value={barAttach.contract} />
                                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                                            <Typography variant="caption" color="textSecondary">{`${barAttach.contract}%`}</Typography>
                                        </Box>
                                    </Box>}
                                    {barAttach.contract < 0 &&
                                    <Button variant="contained" disabled={container?.contract == ""? true : false} onClick={() => downloadAttach(container?.contract,"contract")} startIcon={<GetApp />}>Open</Button>}
                                </Box>
                            </Grid> */}
                            {(view == "list" && container?.contracts?.length > 0) &&
                            <Grid item xs={12} md={12} className={classes.wrapper}>
                                <TableContainer>
                                    <Table size="small" aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell width={12}></TableCell>
                                                <TableCell width={12}></TableCell>
                                                <TableCell>File Name</TableCell>
                                                <TableCell width={12} />
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {container?.contracts?.map((item, key) => (
                                            <TableRow>
                                                <TableCell>
                                                    {movePick.contract &&
                                                        <Checkbox
                                                        checked={listCheck.contract[key]}
                                                        onClick={(e) => onCheckChange(e,key,"contract")}
                                                        color="primary"
                                                    />}
                                                </TableCell>
                                                <TableCell>
                                                    {progContract[key] == 0 &&
                                                    <Tooltip title={`Open ${item.label}`} placement="top">
                                                        <Link onClick={() => downloadFile("contract",key,item.link,item.content_type,item.label)}><Icon>insert_drive_file</Icon></Link>
                                                    </Tooltip>}
                                                    {progContract[key] == 1  &&
                                                    <Icon color="primary">insert_drive_file</Icon>}
                                                </TableCell>
                                                <TableCell>
                                                    {progContract[key] == 0 &&
                                                    <Tooltip title={`Open ${item.label}`} placement="top">
                                                        <Link onClick={() => downloadFile("contract",key,item.link,item.content_type,item.label)}>{item.label}</Link>
                                                    </Tooltip>}
                                                    {progContract[key] == 1 &&
                                                    <Box>
                                                        <Typography color="primary" variant="body2">{item.label}</Typography>
                                                        <Box className={classes.pbar3} alignItems="center">
                                                            <Box width="100%" mr={1}>
                                                                <LinearProgress variant="determinate" value={barContract[key]} />
                                                            </Box>
                                                            <Box minWidth={35}>
                                                                <Typography variant="body2" color="textSecondary">{`${barContract[key]}%`}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>}
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title="Rename" placement="top">
                                                        <IconButton>
                                                            <EditAttributes onClick={() => editLabel("contracts",key,item.link,item.label)} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>}
                            {view == "grid" &&
                            <React.Fragment>
                            {container?.contracts?.map((item, key) => {
                                return <Grid item xs={12} md={2} className={classes.wrapper}>
                                    <Box className="card-small" onMouseEnter={() => handleHidden("contract",key,false)} onMouseLeave={() => handleHidden("contract",key,true)}>
                                        {movePick.contract &&
                                        <Box class={classes.checkContainer}>
                                            <Checkbox
                                                checked={listCheck.contract[key]}
                                                onClick={(e) => onCheckChange(e,key,"contract")}
                                                color="primary"
                                            />
                                        </Box>}
                                        {progContract[key] == 0 &&
                                        <Link onClick={() => downloadFile("contract",key,item.link,item.content_type,item.label)}>
                                                {item.thumbnail == "" &&
                                                <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                    <Icon style={{fontSize: 50}}>insert_drive_file</Icon>
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>}
                                                {item.thumbnail != "" &&
                                                <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                    <img src={`data:image/jpeg;base64,${item.thumbnail}`} />
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>}
                                        </Link>}
                                        {progContract[key] == 1 &&
                                        <React.Fragment>
                                            {item.thumbnail == "" &&
                                            <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                <Box class={classes.labelContainer}>
                                                    <Icon style={{fontSize: 50}}>insert_drive_file</Icon>
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>
                                                <Box class={classes.pContainer}>
                                                    <Box class={classes.pbar}>
                                                        <CircularProgress variant="determinate" value={barContract[key]} />
                                                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                                                            <Typography variant="body2" color="textSecondary">{`${barContract[key]}%`}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>}
                                            {item.thumbnail != "" &&
                                            <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                <Box class={classes.labelContainer}>
                                                    <img src={`data:image/jpeg;base64,${item.thumbnail}`} />
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>
                                                <Box class={classes.pContainer}>
                                                    <Box class={classes.pbar}>
                                                        <CircularProgress variant="determinate" value={barContract[key]} />
                                                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                                                            <Typography variant="body2" color="textSecondary">{`${barContract[key]}%`}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>}
                                        </React.Fragment>}
                                        <SpeedDial
                                            ariaLabel="Action"
                                            className={classes.speedDial}
                                            icon={<SpeedDialIcon icon={<MoreVert />} openIcon={<KeyboardArrowDown />} />}
                                            FabProps={{ size: "small" }}
                                            hidden={hidden.contract[key]}
                                            direction="up"
                                            open={openDial.contract[key]}
                                            onOpen={() => handleOpenDial("contract",key,true)}
                                            onClose={() => handleOpenDial("contract",key,false)}
                                        >
                                            <SpeedDialAction
                                                key="Rename"
                                                icon={<EditAttributes />}
                                                tooltipTitle="Rename"
                                                onClick={() => editLabel("contracts",key,item.link,item.label)}
                                            />
                                        </SpeedDial>
                                    </Box>
                                </Grid>
                            })}
                            </React.Fragment>}
                            <Grid item md={12}>
                                <Divider />
                            </Grid>
                            <Grid item md={12}>
                                <Box className="mb-3 display-space-between">
                                    <Box display="flex">
                                        <Typography variant="subtitle1" color="textSecondary">Invoice</Typography>
                                        <Tooltip title="Add new Invoice" placement="top">
                                            <IconButton onClick={() => addAttachment("invoices")} size="small">
                                                <Icon>add</Icon>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Move Invoice" placement="top">
                                            <IconButton onClick={() => togglePick("invoice")} aria-label="move" size="small">
                                                <Icon>library_add_check</Icon>
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Box>
                                        {movePick.invoice &&
                                        <Button variant="contained" onClick={() => moveAttachment("invoices")} startIcon={<Send />}>Move selected to</Button>}
                                        {(container?.invoices?.length > 0 && !movePick.invoice) &&
                                        <Button variant="contained" onClick={() => downloadAll("invoices")} startIcon={!loadProgress.invoice ? <GetApp /> : ""}>{loadProgress.invoice ? <React.Fragment><CircularProgress variant="determinate" size={26} value={loadBar.invoice} />&nbsp;{`${loadBar.invoice}%`}</React.Fragment> : "Download All Invoices"}</Button>}
                                    </Box>
                                </Box>
                            </Grid>
                            {/* <Grid item md={9}>
                                <Box className="mb-3">
                                    {barAttach.invoice >= 0 &&
                                    <Box class={classes.pbar}>
                                        <CircularProgress variant="determinate" value={barAttach.invoice} />
                                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                                            <Typography variant="caption" color="textSecondary">{`${barAttach.invoice}%`}</Typography>
                                        </Box>
                                    </Box>}
                                    {barAttach.invoice < 0 &&
                                    <Button variant="contained" disabled={container?.invoice == ""? true : false} onClick={() => downloadAttach(container?.invoice,"invoice")} startIcon={<GetApp />}>Open</Button>}
                                </Box>
                            </Grid> */}
                            {(view == "list" && container?.invoices?.length > 0) &&
                            <Grid item xs={12} md={12} className={classes.wrapper}>
                                <TableContainer>
                                    <Table size="small" aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell width={12}></TableCell>
                                                <TableCell width={12}></TableCell>
                                                <TableCell>File Name</TableCell>
                                                <TableCell width={12} />
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {container?.invoices?.map((item, key) => (
                                            <TableRow>
                                                <TableCell>
                                                    {movePick.invoice &&
                                                        <Checkbox
                                                        checked={listCheck.invoice[key]}
                                                        onClick={(e) => onCheckChange(e,key,"invoice")}
                                                        color="primary"
                                                    />}
                                                </TableCell>
                                                <TableCell>
                                                    {progInvoice[key] == 0 &&
                                                    <Tooltip title={`Open ${item.label}`} placement="top">
                                                        <Link onClick={() => downloadFile("invoice",key,item.link,item.content_type,item.label)}><Icon>insert_drive_file</Icon></Link>
                                                    </Tooltip>}
                                                    {progInvoice[key] == 1  &&
                                                    <Icon color="primary">insert_drive_file</Icon>}
                                                </TableCell>
                                                <TableCell>
                                                    {progInvoice[key] == 0 &&
                                                    <Tooltip title={`Open ${item.label}`} placement="top">
                                                        <Link onClick={() => downloadFile("invoice",key,item.link,item.content_type,item.label)}>{item.label}</Link>
                                                    </Tooltip>}
                                                    {progInvoice[key] == 1 &&
                                                    <Box>
                                                        <Typography color="primary" variant="body2">{item.label}</Typography>
                                                        <Box className={classes.pbar3} alignItems="center">
                                                            <Box width="100%" mr={1}>
                                                                <LinearProgress variant="determinate" value={barInvoice[key]} />
                                                            </Box>
                                                            <Box minWidth={35}>
                                                                <Typography variant="body2" color="textSecondary">{`${barInvoice[key]}%`}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>}
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title="Rename" placement="top">
                                                        <IconButton>
                                                            <EditAttributes onClick={() => editLabel("invoices",key,item.link,item.label)} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>}
                            {view == "grid" &&
                            <React.Fragment>
                            {container?.invoices?.map((item, key) => {
                                return <Grid item xs={12} md={2} className={classes.wrapper}>
                                    <Box className="card-small" onMouseEnter={() => handleHidden("invoice",key,false)} onMouseLeave={() => handleHidden("invoice",key,true)}>
                                        {movePick.invoice &&
                                        <Box class={classes.checkContainer}>
                                            <Checkbox
                                                checked={listCheck.invoice[key]}
                                                onClick={(e) => onCheckChange(e,key,"invoice")}
                                                color="primary"
                                            />
                                        </Box>}
                                        {progInvoice[key] == 0 &&
                                        <Link onClick={() => downloadFile("invoice",key,item.link,item.content_type,item.label)}>
                                                {item.thumbnail == "" &&
                                                <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                    <Icon style={{fontSize: 50}}>insert_drive_file</Icon>
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>}
                                                {item.thumbnail != "" &&
                                                <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                    <img src={`data:image/jpeg;base64,${item.thumbnail}`} />
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>}
                                        </Link>}
                                        {progInvoice[key] == 1 &&
                                        <React.Fragment>
                                            {item.thumbnail == "" &&
                                            <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                <Box class={classes.labelContainer}>
                                                    <Icon style={{fontSize: 50}}>insert_drive_file</Icon>
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>
                                                <Box class={classes.pContainer}>
                                                    <Box class={classes.pbar}>
                                                        <CircularProgress variant="determinate" value={barInvoice[key]} />
                                                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                                                            <Typography variant="body2" color="textSecondary">{`${barInvoice[key]}%`}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>}
                                            {item.thumbnail != "" &&
                                            <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                <Box class={classes.labelContainer}>
                                                    <img src={`data:image/jpeg;base64,${item.thumbnail}`} />
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>
                                                <Box class={classes.pContainer}>
                                                    <Box class={classes.pbar}>
                                                        <CircularProgress variant="determinate" value={barInvoice[key]} />
                                                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                                                            <Typography variant="body2" color="textSecondary">{`${barInvoice[key]}%`}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>}
                                        </React.Fragment>}
                                        <SpeedDial
                                            ariaLabel="Action"
                                            className={classes.speedDial}
                                            icon={<SpeedDialIcon icon={<MoreVert />} openIcon={<KeyboardArrowDown />} />}
                                            FabProps={{ size: "small" }}
                                            hidden={hidden.invoice[key]}
                                            direction="up"
                                            open={openDial.invoice[key]}
                                            onOpen={() => handleOpenDial("invoice",key,true)}
                                            onClose={() => handleOpenDial("invoice",key,false)}
                                        >
                                            <SpeedDialAction
                                                key="Rename"
                                                icon={<EditAttributes />}
                                                tooltipTitle="Rename"
                                                onClick={() => editLabel("invoices",key,item.link,item.label)}
                                            />
                                        </SpeedDial>
                                    </Box>
                                </Grid>
                            })}
                            </React.Fragment>}
                            <Grid item md={12}>
                                <Divider />
                            </Grid>
                            <Grid item md={12}>
                                <Box className="mb-3 display-space-between">
                                    <Box display="flex">
                                        <Typography variant="subtitle1" color="textSecondary">Drawings</Typography>
                                        <Tooltip title="Add new Drawing" placement="top">
                                            <IconButton onClick={() => addAttachment("drawings")} size="small">
                                                <Icon>add</Icon>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Move Drawing" placement="top">
                                            <IconButton onClick={() => togglePick("drawing")} aria-label="move" size="small">
                                                <Icon>library_add_check</Icon>
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Box>
                                        {movePick.drawing &&
                                        <Button variant="contained" onClick={() => moveAttachment("drawings")} startIcon={<Send />}>Move selected to</Button>}
                                        {(container?.drawings?.length > 0 && !movePick.drawing) &&
                                        <Button variant="contained" onClick={() => downloadAll("drawings")} startIcon={!loadProgress.drawing ? <GetApp /> : ""}>{loadProgress.drawing ? <React.Fragment><CircularProgress variant="determinate" size={26} value={loadBar.drawing} />&nbsp;{`${loadBar.drawing}%`}</React.Fragment> : "Download All Drawings"}</Button>}
                                    </Box>
                                </Box>
                            </Grid>
                            {(view == "list" && container?.drawings?.length > 0) &&
                            <Grid item xs={12} md={12} className={classes.wrapper}>
                                <TableContainer>
                                    <Table size="small" aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell width={12}></TableCell>
                                                <TableCell width={12}></TableCell>
                                                <TableCell>File Name</TableCell>
                                                <TableCell width={12} />
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {container?.drawings?.map((item, key) => (
                                            <TableRow>
                                                <TableCell>
                                                    {movePick.drawing &&
                                                        <Checkbox
                                                        checked={listCheck.drawing[key]}
                                                        onClick={(e) => onCheckChange(e,key,"drawing")}
                                                        color="primary"
                                                    />}
                                                </TableCell>
                                                <TableCell>
                                                    {progDrawing[key] == 0 &&
                                                    <Tooltip title={`Open ${item.label}`} placement="top">
                                                        <Link onClick={() => downloadFile("drawing",key,item.link,item.content_type,item.label)}><Icon>insert_drive_file</Icon></Link>
                                                    </Tooltip>}
                                                    {progDrawing[key] == 1  &&
                                                    <Icon color="primary">insert_drive_file</Icon>}
                                                </TableCell>
                                                <TableCell>
                                                    {progDrawing[key] == 0 &&
                                                    <Tooltip title={`Open ${item.label}`} placement="top">
                                                        <Link onClick={() => downloadFile("drawing",key,item.link,item.content_type,item.label)}>{item.label}</Link>
                                                    </Tooltip>}
                                                    {progDrawing[key] == 1 &&
                                                    <Box>
                                                        <Typography color="primary" variant="body2">{item.label}</Typography>
                                                        <Box className={classes.pbar3} alignItems="center">
                                                            <Box width="100%" mr={1}>
                                                                <LinearProgress variant="determinate" value={barDrawing[key]} />
                                                            </Box>
                                                            <Box minWidth={35}>
                                                                <Typography variant="body2" color="textSecondary">{`${barDrawing[key]}%`}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>}
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title="Rename" placement="top">
                                                        <IconButton>
                                                            <EditAttributes onClick={() => editLabel("drawings",key,item.link,item.label)} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>}
                            {view == "grid" &&
                            <React.Fragment>
                            {container?.drawings?.map((item, key) => {
                                return <Grid item xs={12} md={2} className={classes.wrapper}>
                                    <Box className="card-small" onMouseEnter={() => handleHidden("drawing",key,false)} onMouseLeave={() => handleHidden("drawing",key,true)}>
                                        {movePick.drawing &&
                                        <Box class={classes.checkContainer}>
                                            <Checkbox
                                                checked={listCheck.drawing[key]}
                                                onClick={(e) => onCheckChange(e,key,"drawing")}
                                                color="primary"
                                            />
                                        </Box>}
                                        {progDrawing[key] == 0 &&
                                        <Link onClick={() => downloadFile("drawing",key,item.link,item.content_type,item.label)}>
                                                {item.thumbnail == "" &&
                                                <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                    <Icon style={{fontSize: 50}}>insert_drive_file</Icon>
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>}
                                                {item.thumbnail != "" &&
                                                <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                    <img src={`data:image/jpeg;base64,${item.thumbnail}`} />
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>}
                                        </Link>}
                                        {progDrawing[key] == 1 &&
                                        <React.Fragment>
                                            {item.thumbnail == "" &&
                                            <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                <Box class={classes.labelContainer}>
                                                    <Icon style={{fontSize: 50}}>insert_drive_file</Icon>
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>
                                                <Box class={classes.pContainer}>
                                                    <Box class={classes.pbar}>
                                                        <CircularProgress variant="determinate" value={barDrawing[key]} />
                                                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                                                            <Typography variant="body2" color="textSecondary">{`${barDrawing[key]}%`}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>}
                                            {item.thumbnail != "" &&
                                            <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                <Box class={classes.labelContainer}>
                                                    <img src={`data:image/jpeg;base64,${item.thumbnail}`} />
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>
                                                <Box class={classes.pContainer}>
                                                    <Box class={classes.pbar}>
                                                        <CircularProgress variant="determinate" value={barDrawing[key]} />
                                                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                                                            <Typography variant="body2" color="textSecondary">{`${barDrawing[key]}%`}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>}
                                        </React.Fragment>}
                                        <SpeedDial
                                            ariaLabel="Action"
                                            className={classes.speedDial}
                                            icon={<SpeedDialIcon icon={<MoreVert />} openIcon={<KeyboardArrowDown />} />}
                                            FabProps={{ size: "small" }}
                                            hidden={hidden.drawing[key]}
                                            direction="up"
                                            open={openDial.drawing[key]}
                                            onOpen={() => handleOpenDial("drawing",key,true)}
                                            onClose={() => handleOpenDial("drawing",key,false)}
                                        >
                                            <SpeedDialAction
                                                key="Rename"
                                                icon={<EditAttributes />}
                                                tooltipTitle="Rename"
                                                onClick={() => editLabel("drawings",key,item.link,item.label)}
                                            />
                                        </SpeedDial>
                                    </Box>
                                </Grid>
                            })}
                            </React.Fragment>}
                            <Grid item md={12}>
                                <Divider />
                            </Grid>
                            <Grid item md={12}>
                                <Box className="mb-3 display-space-between">
                                    <Box display="flex">
                                        <Typography variant="subtitle1" color="textSecondary">Surveys</Typography>
                                        <Tooltip title="Add new Survey" placement="top">
                                            <IconButton onClick={() => addAttachment("surveys")} size="small">
                                                <Icon>add</Icon>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Move Survey" placement="top">
                                            <IconButton onClick={() => togglePick("survey")} aria-label="move" size="small">
                                                <Icon>library_add_check</Icon>
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Box>
                                        {movePick.survey &&
                                        <Button variant="contained" onClick={() => moveAttachment("surveys")} startIcon={<Send />}>Move selected to</Button>}
                                        {(container?.surveys?.length > 0 && !movePick.survey) &&
                                        <Button variant="contained" onClick={() => downloadAll("surveys")} startIcon={!loadProgress.survey ? <GetApp /> : ""}>{loadProgress.survey ? <React.Fragment><CircularProgress variant="determinate" size={26} value={loadBar.survey} />&nbsp;{`${loadBar.survey}%`}</React.Fragment> : "Download All Surveys"}</Button>}
                                    </Box>
                                </Box>
                            </Grid>
                            {(view == "list" && container?.surveys?.length > 0) &&
                            <Grid item xs={12} md={12} className={classes.wrapper}>
                                <TableContainer>
                                    <Table size="small" aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell width={12}></TableCell>
                                                <TableCell width={12}></TableCell>
                                                <TableCell>File Name</TableCell>
                                                <TableCell width={12} />
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {container?.surveys?.map((item, key) => (
                                            <TableRow>
                                                <TableCell>
                                                    {movePick.survey &&
                                                        <Checkbox
                                                        checked={listCheck.survey[key]}
                                                        onClick={(e) => onCheckChange(e,key,"survey")}
                                                        color="primary"
                                                    />}
                                                </TableCell>
                                                <TableCell>
                                                    {progSurvey[key] == 0 &&
                                                    <Tooltip title={`Open ${item.label}`} placement="top">
                                                        <Link onClick={() => downloadFile("survey",key,item.link,item.content_type,item.label)}><Icon>insert_drive_file</Icon></Link>
                                                    </Tooltip>}
                                                    {progSurvey[key] == 1  &&
                                                    <Icon color="primary">insert_drive_file</Icon>}
                                                </TableCell>
                                                <TableCell>
                                                    {progSurvey[key] == 0 &&
                                                    <Tooltip title={`Open ${item.label}`} placement="top">
                                                        <Link onClick={() => downloadFile("survey",key,item.link,item.content_type,item.label)}>{item.label}</Link>
                                                    </Tooltip>}
                                                    {progSurvey[key] == 1 &&
                                                    <Box>
                                                        <Typography color="primary" variant="body2">{item.label}</Typography>
                                                        <Box className={classes.pbar3} alignItems="center">
                                                            <Box width="100%" mr={1}>
                                                                <LinearProgress variant="determinate" value={barSurvey[key]} />
                                                            </Box>
                                                            <Box minWidth={35}>
                                                                <Typography variant="body2" color="textSecondary">{`${barSurvey[key]}%`}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>}
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title="Rename" placement="top">
                                                        <IconButton>
                                                            <EditAttributes onClick={() => editLabel("surveys",key,item.link,item.label)} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>}
                            {view == "grid" &&
                            <React.Fragment>
                            {container?.surveys?.map((item, key) => {
                                return <Grid item xs={12} md={2} className={classes.wrapper}>
                                    <Box className="card-small" onMouseEnter={() => handleHidden("survey",key,false)} onMouseLeave={() => handleHidden("survey",key,true)}>
                                        {movePick.survey &&
                                        <Box class={classes.checkContainer}>
                                            <Checkbox
                                                checked={listCheck.survey[key]}
                                                onClick={(e) => onCheckChange(e,key,"survey")}
                                                color="primary"
                                            />
                                        </Box>}
                                        {progSurvey[key] == 0 &&
                                        <Link onClick={() => downloadFile("survey",key,item.link,item.content_type,item.label)}>
                                                {item.thumbnail == "" &&
                                                <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                    <Icon style={{fontSize: 50}}>insert_drive_file</Icon>
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>}
                                                {item.thumbnail != "" &&
                                                <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                    <img src={`data:image/jpeg;base64,${item.thumbnail}`} />
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>}
                                        </Link>}
                                        {progSurvey[key] == 1 &&
                                        <React.Fragment>
                                            {item.thumbnail == "" &&
                                            <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                <Box class={classes.labelContainer}>
                                                    <Icon style={{fontSize: 50}}>insert_drive_file</Icon>
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>
                                                <Box class={classes.pContainer}>
                                                    <Box class={classes.pbar}>
                                                        <CircularProgress variant="determinate" value={barSurvey[key]} />
                                                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                                                            <Typography variant="body2" color="textSecondary">{`${barSurvey[key]}%`}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>}
                                            {item.thumbnail != "" &&
                                            <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                <Box class={classes.labelContainer}>
                                                    <img src={`data:image/jpeg;base64,${item.thumbnail}`} />
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>
                                                <Box class={classes.pContainer}>
                                                    <Box class={classes.pbar}>
                                                        <CircularProgress variant="determinate" value={barSurvey[key]} />
                                                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                                                            <Typography variant="body2" color="textSecondary">{`${barSurvey[key]}%`}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>}
                                        </React.Fragment>}
                                        <SpeedDial
                                            ariaLabel="Action"
                                            className={classes.speedDial}
                                            icon={<SpeedDialIcon icon={<MoreVert />} openIcon={<KeyboardArrowDown />} />}
                                            FabProps={{ size: "small" }}
                                            hidden={hidden.survey[key]}
                                            direction="up"
                                            open={openDial.survey[key]}
                                            onOpen={() => handleOpenDial("survey",key,true)}
                                            onClose={() => handleOpenDial("survey",key,false)}
                                        >
                                            <SpeedDialAction
                                                key="Rename"
                                                icon={<EditAttributes />}
                                                tooltipTitle="Rename"
                                                onClick={() => editLabel("surveys",key,item.link,item.label)}
                                            />
                                        </SpeedDial>
                                    </Box>
                                </Grid>
                            })}
                            </React.Fragment>}
                            <Grid item md={12}>
                                <Divider />
                            </Grid>
                            <Grid item md={12}>
                                <Box className="mb-3 display-space-between">
                                    <Box display="flex">
                                        <Typography variant="subtitle1" color="textSecondary">Relative Documents</Typography>
                                        <Tooltip title="Add new Relative Document" placement="top">
                                            <IconButton onClick={() => addAttachment("relative_documents")} size="small">
                                                <Icon>add</Icon>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Move Relative Document" placement="top">
                                            <IconButton onClick={() => togglePick("other")} aria-label="move" size="small">
                                                <Icon>library_add_check</Icon>
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Box>
                                        {movePick.other &&
                                        <Button variant="contained" onClick={() => moveAttachment("relative_documents")} startIcon={<Send />}>Move selected to</Button>}
                                        {(container?.relative_documents?.length > 0 && !movePick.other) &&
                                        <Button variant="contained" onClick={() => downloadAll("relative_documents")} startIcon={!loadProgress.other ? <GetApp /> : ""}>{loadProgress.other ? <React.Fragment><CircularProgress variant="determinate" size={26} value={loadBar.other} />&nbsp;{`${loadBar.other}%`}</React.Fragment> : "Download All Relative Documents"}</Button>}
                                    </Box>
                                </Box>
                            </Grid>
                            {(view == "list" && container?.relative_documents?.length > 0) &&
                            <Grid item xs={12} md={12} className={classes.wrapper}>
                                <TableContainer>
                                    <Table size="small" aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell width={12}></TableCell>
                                                <TableCell width={12}></TableCell>
                                                <TableCell>File Name</TableCell>
                                                <TableCell width={12} />
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {container?.relative_documents?.map((item, key) => (
                                            <TableRow>
                                                <TableCell>
                                                    {movePick.other &&
                                                        <Checkbox
                                                        checked={listCheck.other[key]}
                                                        onClick={(e) => onCheckChange(e,key,"other")}
                                                        color="primary"
                                                    />}
                                                </TableCell>
                                                <TableCell>
                                                    {progOther[key] == 0 &&
                                                    <Tooltip title={`Open ${item.label}`} placement="top">
                                                        <Link onClick={() => downloadFile("other",key,item.link,item.content_type,item.label)}><Icon>insert_drive_file</Icon></Link>
                                                    </Tooltip>}
                                                    {progOther[key] == 1  &&
                                                    <Icon color="primary">insert_drive_file</Icon>}
                                                </TableCell>
                                                <TableCell>
                                                    {progOther[key] == 0 &&
                                                    <Tooltip title={`Open ${item.label}`} placement="top">
                                                        <Link onClick={() => downloadFile("other",key,item.link,item.content_type,item.label)}>{item.label}</Link>
                                                    </Tooltip>}
                                                    {progOther[key] == 1 &&
                                                    <Box>
                                                        <Typography color="primary" variant="body2">{item.label}</Typography>
                                                        <Box className={classes.pbar3} alignItems="center">
                                                            <Box width="100%" mr={1}>
                                                                <LinearProgress variant="determinate" value={barOther[key]} />
                                                            </Box>
                                                            <Box minWidth={35}>
                                                                <Typography variant="body2" color="textSecondary">{`${barOther[key]}%`}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>}
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title="Rename" placement="top">
                                                        <IconButton>
                                                            <EditAttributes onClick={() => editLabel("relative_documents",key,item.link,item.label)} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>}
                            {view == "grid" &&
                            <React.Fragment>
                            {container?.relative_documents?.map((item, key) => {
                                return <Grid item xs={12} md={2} className={classes.wrapper}>
                                    <Box className="card-small" onMouseEnter={() => handleHidden("other",key,false)} onMouseLeave={() => handleHidden("other",key,true)}>
                                        {movePick.other &&
                                        <Box class={classes.checkContainer}>
                                            <Checkbox
                                                checked={listCheck.other[key]}
                                                onClick={(e) => onCheckChange(e,key,"other")}
                                                color="primary"
                                            />
                                        </Box>}
                                        {progOther[key] == 0 &&
                                        <Link onClick={() => downloadFile("other",key,item.link,item.content_type,item.label)}>
                                                {item.thumbnail == "" &&
                                                <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                    <Icon style={{fontSize: 50}}>insert_drive_file</Icon>
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>}
                                                {item.thumbnail != "" &&
                                                <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                    <img src={`data:image/jpeg;base64,${item.thumbnail}`} />
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>}
                                        </Link>}
                                        {progOther[key] == 1 &&
                                        <React.Fragment>
                                            {item.thumbnail == "" &&
                                            <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                <Box class={classes.labelContainer}>
                                                    <Icon style={{fontSize: 50}}>insert_drive_file</Icon>
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>
                                                <Box class={classes.pContainer}>
                                                    <Box class={classes.pbar}>
                                                        <CircularProgress variant="determinate" value={barOther[key]} />
                                                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                                                            <Typography variant="body2" color="textSecondary">{`${barOther[key]}%`}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>}
                                            {item.thumbnail != "" &&
                                            <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                <Box class={classes.labelContainer}>
                                                    <img src={`data:image/jpeg;base64,${item.thumbnail}`} />
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>
                                                <Box class={classes.pContainer}>
                                                    <Box class={classes.pbar}>
                                                        <CircularProgress variant="determinate" value={barOther[key]} />
                                                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                                                            <Typography variant="body2" color="textSecondary">{`${barOther[key]}%`}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>}
                                        </React.Fragment>}
                                        <SpeedDial
                                            ariaLabel="Action"
                                            className={classes.speedDial}
                                            icon={<SpeedDialIcon icon={<MoreVert />} openIcon={<KeyboardArrowDown />} />}
                                            FabProps={{ size: "small" }}
                                            hidden={hidden.other[key]}
                                            direction="up"
                                            open={openDial.other[key]}
                                            onOpen={() => handleOpenDial("other",key,true)}
                                            onClose={() => handleOpenDial("other",key,false)}
                                        >
                                            <SpeedDialAction
                                                key="Rename"
                                                icon={<EditAttributes />}
                                                tooltipTitle="Rename"
                                                onClick={() => editLabel("relative_documents",key,item.link,item.label)}
                                            />
                                        </SpeedDial>
                                    </Box>
                                </Grid>
                            })}
                            </React.Fragment>}
                            <Grid item md={12}>
                                <Divider />
                            </Grid>
                            <Grid item md={12}>
                                <Box className="mb-3 display-space-between">
                                    <Box display="flex">
                                        <Typography variant="subtitle1" color="textSecondary">Original Photos</Typography>
                                        <Tooltip title="Add new Original Photo" placement="top">
                                            <IconButton onClick={() => addAttachment("original_photos")} size="small">
                                                <Icon>add</Icon>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Move Original Photo" placement="top">
                                            <IconButton onClick={() => togglePick("original")} aria-label="move" size="small">
                                                <Icon>library_add_check</Icon>
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Box>
                                        {movePick.original &&
                                        <Button variant="contained" onClick={() => moveAttachment("original_photos")} startIcon={<Send />}>Move selected to</Button>}
                                        {(container?.original_photos?.length > 0 && !movePick.original) &&
                                        <Button variant="contained" onClick={() => downloadAll("original_photos")} startIcon={!loadProgress.original ? <GetApp /> : ""}>{loadProgress.original ? <React.Fragment><CircularProgress variant="determinate" size={26} value={loadBar.original} />&nbsp;{`${loadBar.original}%`}</React.Fragment> : "Download All Original Photos"}</Button>}
                                    </Box>
                                </Box>
                            </Grid>
                            {(view == "list" && container?.original_photos?.length > 0) &&
                            <Grid item xs={12} md={12} className={classes.wrapper}>
                                <TableContainer>
                                    <Table size="small" aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell width={12}></TableCell>
                                                <TableCell width={12}></TableCell>
                                                <TableCell>File Name</TableCell>
                                                <TableCell width={12} />
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {container?.original_photos?.map((item, key) => (
                                            <TableRow>
                                                <TableCell>
                                                    {movePick.original &&
                                                        <Checkbox
                                                        checked={listCheck.original[key]}
                                                        onClick={(e) => onCheckChange(e,key,"original")}
                                                        color="primary"
                                                    />}
                                                </TableCell>
                                                <TableCell>
                                                    {progOriginal[key] == 0 &&
                                                    <Tooltip title={`Open ${item.label}`} placement="top">
                                                        <Link onClick={() => downloadFile("original",key,item.link,item.content_type,item.label)}><Icon>insert_drive_file</Icon></Link>
                                                    </Tooltip>}
                                                    {progOriginal[key] == 1  &&
                                                    <Icon color="primary">insert_drive_file</Icon>}
                                                </TableCell>
                                                <TableCell>
                                                    {progOriginal[key] == 0 &&
                                                    <Tooltip title={`Open ${item.label}`} placement="top">
                                                        <Link onClick={() => downloadFile("original",key,item.link,item.content_type,item.label)}>{item.label}</Link>
                                                    </Tooltip>}
                                                    {progOriginal[key] == 1 &&
                                                    <Box>
                                                        <Typography color="primary" variant="body2">{item.label}</Typography>
                                                        <Box className={classes.pbar3} alignItems="center">
                                                            <Box width="100%" mr={1}>
                                                                <LinearProgress variant="determinate" value={barOriginal[key]} />
                                                            </Box>
                                                            <Box minWidth={35}>
                                                                <Typography variant="body2" color="textSecondary">{`${barOriginal[key]}%`}</Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>}
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip title="Rename" placement="top">
                                                        <IconButton>
                                                            <EditAttributes onClick={() => editLabel("original_photos",key,item.link,item.label)} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>}
                            {view == "grid" &&
                            <React.Fragment>
                            {container?.original_photos?.map((item, key) => {
                                return <Grid item xs={12} md={2} className={classes.wrapper}>
                                    <Box className="card-small" onMouseEnter={() => handleHidden("original",key,false)} onMouseLeave={() => handleHidden("original",key,true)}>
                                        {movePick.original &&
                                        <Box class={classes.checkContainer}>
                                            <Checkbox
                                                checked={listCheck.original[key]}
                                                onClick={(e) => onCheckChange(e,key,"original")}
                                                color="primary"
                                            />
                                        </Box>}
                                        {progOriginal[key] == 0 &&
                                        <Link onClick={() => downloadFile("original",key,item.link,item.content_type,item.label)}>
                                                {item.thumbnail == "" &&
                                                <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                    <Icon style={{fontSize: 50}}>insert_drive_file</Icon>
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>}
                                                {item.thumbnail != "" &&
                                                <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                    <img src={`data:image/jpeg;base64,${item.thumbnail}`} />
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>}
                                        </Link>}
                                        {progOriginal[key] == 1 &&
                                        <React.Fragment>
                                            {item.thumbnail == "" &&
                                            <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                <Box class={classes.labelContainer}>
                                                    <Icon style={{fontSize: 50}}>insert_drive_file</Icon>
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>
                                                <Box class={classes.pContainer}>
                                                    <Box class={classes.pbar}>
                                                        <CircularProgress variant="determinate" value={barOriginal[key]} />
                                                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                                                            <Typography variant="body2" color="textSecondary">{`${barOriginal[key]}%`}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>}
                                            {item.thumbnail != "" &&
                                            <Box class={classes.itemContainer} justifyContent="center" alignItems="center">
                                                <Box class={classes.labelContainer}>
                                                    <img src={`data:image/jpeg;base64,${item.thumbnail}`} />
                                                    <Typography variant="h4" component="h4" style={{wordWrap:"anywhere",marginLeft:"0px"}}>{item.label}</Typography>
                                                </Box>
                                                <Box class={classes.pContainer}>
                                                    <Box class={classes.pbar}>
                                                        <CircularProgress variant="determinate" value={barOriginal[key]} />
                                                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                                                            <Typography variant="body2" color="textSecondary">{`${barOriginal[key]}%`}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>}
                                        </React.Fragment>}
                                        <SpeedDial
                                            ariaLabel="Action"
                                            className={classes.speedDial}
                                            icon={<SpeedDialIcon icon={<MoreVert />} openIcon={<KeyboardArrowDown />} />}
                                            FabProps={{ size: "small" }}
                                            hidden={hidden.original[key]}
                                            direction="up"
                                            open={openDial.original[key]}
                                            onOpen={() => handleOpenDial("original",key,true)}
                                            onClose={() => handleOpenDial("original",key,false)}
                                        >
                                            <SpeedDialAction
                                                key="Rename"
                                                icon={<EditAttributes />}
                                                tooltipTitle="Rename"
                                                onClick={() => editLabel("original_photos",key,item.link,item.label)}
                                            />
                                        </SpeedDial>
                                    </Box>
                                </Grid>
                            })}
                            </React.Fragment>}
                        </Grid>  
                    </Box>
                </Box>
            </Box>
            <Box role="tabpanel" hidden={tabValue !== 3} id="simple-tabpanel-3" aria-labelledby="simple-tab-3">
                <Box variant="outlined" className="p-4 mb-5 card">
                    <Box className="container-detail-wrapper mb-3">
                        <Grid container>
                            <Grid item md={6}>
                                <Table size="small" aria-label="depo-history">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Depo</TableCell>
                                            <TableCell>By</TableCell>
                                            <TableCell>At</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {container?.depo_history?.map((item, key) => {
                                            return <React.Fragment>
                                                {item.depo_id != "" &&
                                                <TableRow key={key}>
                                                    <TableCell>{item.depo.name}</TableCell>
                                                    <TableCell>{item.change_user.name}</TableCell>
                                                    <TableCell>{Moment(item.change_at).format("LLL")}</TableCell>
                                                </TableRow>}
                                            </React.Fragment>
                                        })}
                                    </TableBody>
                                    <TableFooter>
                                        
                                    </TableFooter>
                                </Table>
                            </Grid>
                        </Grid>  
                    </Box>
                </Box>
            </Box>
            <Box role="tabpanel" hidden={tabValue !== 4} id="simple-tabpanel-4" aria-labelledby="simple-tab-4">
                <Box variant="outlined" className="p-4 mb-5 card">
                    <Box className="container-detail-wrapper mb-3">
                        <Grid container>
                            <Grid item md={6}>
                                <Table size="small" aria-label="status-history">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Status</TableCell>
                                            <TableCell>By</TableCell>
                                            <TableCell>At</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {container?.stock_status_history?.map((item, key) => {
                                            return <React.Fragment>
                                                {item.status_id > 0 &&
                                                <TableRow key={key}>
                                                    <TableCell>{item.status.name}</TableCell>
                                                    <TableCell>{item.status_user.name}</TableCell>
                                                    <TableCell>{Moment(item.status_at).format("LLL")}</TableCell>
                                                </TableRow>}
                                            </React.Fragment>
                                        })}
                                    </TableBody>
                                    <TableFooter>
                                        
                                    </TableFooter>
                                </Table>
                            </Grid>
                        </Grid>  
                    </Box>
                </Box>
            </Box>
            <Box role="tabpanel" hidden={tabValue !== 5} id="simple-tabpanel-5" aria-labelledby="simple-tab-5">
                <Box variant="outlined" className="p-4 mb-5 card">
                    <Box className="container-detail-wrapper mb-3">
                        <Grid container>
                            <Grid item md={6}>
                                <Table size="small" aria-label="condition-history">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Status</TableCell>
                                            <TableCell>By</TableCell>
                                            <TableCell>At</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {container?.condition_history?.map((item, key) => {
                                            return <React.Fragment>
                                                {item.condition_id > 0 &&
                                                <TableRow key={key}>
                                                    <TableCell>{item.condition.name} ({item.condition_percentage ?? 0}%)</TableCell>
                                                    <TableCell>{item.condition_user.name}</TableCell>
                                                    <TableCell>{Moment(item.condition_at).format("LLL")}</TableCell>
                                                </TableRow>}
                                            </React.Fragment>
                                        })}
                                    </TableBody>
                                    <TableFooter>
                                        
                                    </TableFooter>
                                </Table>
                            </Grid>
                        </Grid>  
                    </Box>
                </Box>
            </Box>
            <Box role="tabpanel" hidden={tabValue !== 6} id="simple-tabpanel-6" aria-labelledby="simple-tab-6">
                <Box variant="outlined" className="p-4 mb-5 card">
                    <Box className="container-detail-wrapper mb-3">
                        <Grid container>
                            <Grid item md={6}>
                                <Table size="small" aria-label="repair-history">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Status</TableCell>
                                            <TableCell>By</TableCell>
                                            <TableCell>At</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {container?.repair_status_history?.map((item, key) => {
                                            return <React.Fragment>
                                                {item.repair_id > 0 &&
                                                <TableRow key={key}>
                                                    <TableCell>{item.repair.name}</TableCell>
                                                    <TableCell>{item.repair_user.name}</TableCell>
                                                    <TableCell>{Moment(item.repair_at).format("LLL")}</TableCell>
                                                </TableRow>}
                                            </React.Fragment>
                                        })}
                                    </TableBody>
                                    <TableFooter>
                                        
                                    </TableFooter>
                                </Table>
                            </Grid>
                        </Grid>  
                    </Box>
                </Box>
            </Box>
            <StockContainerForm 
                open={openFormEdit} 
                closeModal={() => setOpenFormEdit(false)} 
                dataRefresh={containerSwr?.mutate}
                data={container}
                addMaster={(category) => addMaster(category)}
                newOption={newOption} 
                alert={(msg) => showToast(msg)} />
            <MasterForm open={openMaster} closeModal={(updated) => refreshMaster(updated)} master={master} category={master?.category} />
            <Modal open={openView} onClose={closeForm} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description" onKeyDown={(e) => keyPress(e,selView.content)}>
                <Card className={classes.card}>
                    {selView.blob instanceof Blob &&
                    <Carousel navButtonsAlwaysVisible={true} fullHeightHover={false} height="80vh" autoPlay={false} indicators={false} prev={(e) => keyPress(e,selView.content)} next={() => nextFile(selView.content)}>
                        <CardMedia className={classes.media} component="img" src={selView.tipe.includes("image/") ? window.URL.createObjectURL(selView.blob) : "/images/no_image.jpg"} title={selView.name} />
                    </Carousel>}
                    {(selView.content == "image" && progress[selView.key] == 1) &&
                    <Box class={classes.pbar1}>
                        <CircularProgress variant="determinate" color="secondary" size={68} value={displayBar[selView.key]} />
                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                            <Typography variant="body2" style={{color:'#ffffff'}}>{`${displayBar[selView.key]}%`}</Typography>
                        </Box>
                    </Box>}
                    {(selView.content == "drawing" && progDrawing[selView.key] == 1) &&
                    <Box class={classes.pbar1}>
                        <CircularProgress variant="determinate" color="secondary" size={68} value={barDrawing[selView.key]} />
                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                            <Typography variant="body2" style={{color:'#ffffff'}}>{`${barDrawing[selView.key]}%`}</Typography>
                        </Box>
                    </Box>}
                    {(selView.content == "survey" && progSurvey[selView.key] == 1) &&
                    <Box class={classes.pbar1}>
                        <CircularProgress variant="determinate" color="secondary" size={68} value={barSurvey[selView.key]} />
                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                            <Typography variant="body2" style={{color:'#ffffff'}}>{`${barSurvey[selView.key]}%`}</Typography>
                        </Box>
                    </Box>}
                    {(selView.content == "other" && progOther[selView.key] == 1) &&
                    <Box class={classes.pbar1}>
                        <CircularProgress variant="determinate" color="secondary" size={68} value={barOther[selView.key]} />
                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                            <Typography variant="body2" style={{color:'#ffffff'}}>{`${barOther[selView.key]}%`}</Typography>
                        </Box>
                    </Box>}
                    {(selView.content == "csc" && progCSC[selView.key] == 1) &&
                    <Box class={classes.pbar1}>
                        <CircularProgress variant="determinate" color="secondary" size={68} value={barCSC[selView.key]} />
                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                            <Typography variant="body2" style={{color:'#ffffff'}}>{`${barCSC[selView.key]}%`}</Typography>
                        </Box>
                    </Box>}
                    {(selView.content == "specification" && progSpec[selView.key] == 1) &&
                    <Box class={classes.pbar1}>
                        <CircularProgress variant="determinate" color="secondary" size={68} value={barSpec[selView.key]} />
                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                            <Typography variant="body2" style={{color:'#ffffff'}}>{`${barSpec[selView.key]}%`}</Typography>
                        </Box>
                    </Box>}
                    {(selView.content == "contract" && progContract[selView.key] == 1) &&
                    <Box class={classes.pbar1}>
                        <CircularProgress variant="determinate" color="secondary" size={68} value={barContract[selView.key]} />
                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                            <Typography variant="body2" style={{color:'#ffffff'}}>{`${barContract[selView.key]}%`}</Typography>
                        </Box>
                    </Box>}
                    {(selView.content == "invoice" && progInvoice[selView.key] == 1) &&
                    <Box class={classes.pbar1}>
                        <CircularProgress variant="determinate" color="secondary" size={68} value={barInvoice[selView.key]} />
                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                            <Typography variant="body2" style={{color:'#ffffff'}}>{`${barInvoice[selView.key]}%`}</Typography>
                        </Box>
                    </Box>}
                    {(selView.content == "original" && progOriginal[selView.key] == 1) &&
                    <Box class={classes.pbar1}>
                        <CircularProgress variant="determinate" color="secondary" size={68} value={barOriginal[selView.key]} />
                        <Box top={0} left={0} bottom={0} right={0} alignItems="center" className={classes.pbar2}>
                            <Typography variant="body2" style={{color:'#ffffff'}}>{`${barOriginal[selView.key]}%`}</Typography>
                        </Box>
                    </Box>}
                    {selView.blob instanceof Blob &&
                    <CardActions>
                        <Button variant="contained" onClick={openFile} startIcon={<GetApp />}>{selView.name}</Button>
                    </CardActions>}
                </Card>
            </Modal>
            <StockContainerAttachmentForm open={openLabel} data={container} record={record} closeModal={closeEditLabel} dataRefresh={containerSwr?.mutate} alert={(msg) => showToast(msg)} />
            <StockContainerAddAttachmentForm open={openAttach} data={container} field={field} closeModal={closeAttachment} dataRefresh={containerSwr?.mutate} alert={(msg) => showToast(msg)} />
            <StockContainerMoveAttachmentForm open={openMove} data={container} origin={origin} list={list} closeModal={closeMove} dataRefresh={containerSwr?.mutate} alert={(msg) => showToast(msg)} />
            <Snackbar open={toast.show} autoHideDuration={2000} onClose={closeToast}>
                <Alert onClose={closeToast} severity="error">{toast.message}</Alert>
            </Snackbar>
        </StockContainerLayout>
    )
}