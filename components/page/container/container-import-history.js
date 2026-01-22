import { Button, Card, Icon, Link, Modal, InputBase, Paper, MenuItem, Typography, Select, makeStyles, Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableFooter, TablePagination, Tooltip, IconButton, Collapse } from "@material-ui/core";
import { useRouter } from 'next/router';
import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";
import Moment from "moment";
import React, { useEffect, useState } from "react";
import { getListImportHistoryApi }  from "../../../services/api/import-history.api";
import { deleteMultiContainersApi } from "../../../services/api/container-stocks.api";
import { countDays, dateFormat } from '../../../helpers/general';
import { LOCAL_STORAGE_API_TOKEN, LOCAL_STORAGE_USER_ID } from "../../../helpers/consts";

const useStyles = makeStyles((theme) => ({
    root: {
      "& > *": {
        borderBottom: "unset",
      },
    },
  }));

function Row(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            <TableRow key={props.keys} hover className={classes.root}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell>{props.keys + 1 + props.page * props.rowsPerPage}</TableCell>
                <TableCell>{props.row.user.name}</TableCell>
                <TableCell>{Moment(props.row.import_date).format("LL")}</TableCell>
                <TableCell>{props.row.total_data}</TableCell>
                <TableCell>
                    <Tooltip title="Undo Import" placement="top">
                        <Button 
                            variant="contained"
                            color="secondary"
                            onClick={() => props.clickAction()}
                            disableElevation>
                            Undo Import
                        </Button>
                    </Tooltip>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h3" gutterBottom component="div">
                                Container Data
                            </Typography>
                            <Table size="small" aria-label="containers">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Serial Number</TableCell>
                                        <TableCell>Size</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Repair Status</TableCell>
                                        <TableCell>Condition</TableCell>
                                        <TableCell>Percentage</TableCell>
                                        <TableCell>YOM</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {props.row.data?.map((item, key) => (
                                    <TableRow key={key}>
                                        <TableCell>{item.serial_number}</TableCell>
                                        <TableCell>{item.size?.name}</TableCell>
                                        <TableCell>{item.type?.name}</TableCell>
                                        <TableCell>{item.repair_status?.name}</TableCell>
                                        <TableCell>{item.condition?.name}</TableCell>
                                        <TableCell>{item.percentage ?? 0}%</TableCell>
                                        <TableCell>{item.yom_month}-{item.yom_year}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function ContainerImportHistory(props) {
    const router = useRouter();

    const classes = useStyles();
    const [listData, setListData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [rowCount, setRowCount] = useState(0);

    function openDetail(e, url) {
        e.preventDefault();
        router.push(url);
    }

    useEffect(async () => {
        try {
            var data = await getListImportHistoryApi("container");

            setRowCount(data.total);
            setListData(data.result);
            setPage(0);
        } catch (err) {
            console.log(err);
        }
    }, []);

    const handleChangePage = async (event, newPage) => {
        try {
            var data = await getListImportHistoryApi("container", newPage, rowsPerPage);
            setRowCount(data.total);
            setListData(data.result);
            setPage(newPage);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChangeRowsPerPage = async (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        try {
            var data = await getListImportHistoryApi("container", 0, parseInt(event.target.value, 10));
            setRowCount(data.total);
            setListData(data.result);
            setPage(0);
        } catch (err) {
            console.log(err);
        }
    };

    const refreshListHistory = async () => {
        try {
            var data = await getListImportHistoryApi("container", page, rowsPerPage);
            setRowCount(data.total);
            setListData(data.result);
        } catch (err) {
            console.log(err);
        }
    };

    const undoImport = async (id) => {
        var result = await deleteMultiContainersApi(id);
        props?.dataRefresh(id)
        props?.closeModal()
    };

    return <Modal
        open={props?.open}
        onClose={() => props?.closeModal()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <Box className="modal-wrapper" style={{width: "1000px"}}>
            <Card className="modal">
                <Box className="modal-header">
                    <h3>Import History</h3>
                </Box>
                <Box className="modal-content">
                    <TableContainer component={Card}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell width={12} />
                                    <TableCell width={12}>No</TableCell>
                                    <TableCell>User Import</TableCell>
                                    <TableCell>Date Import</TableCell>
                                    <TableCell>Total Data Imported</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {listData?.map((row, key) => (
                                    <Row
                                        keys={key}
                                        row={row}
                                        clickAction={() => undoImport(row.batch_id)}
                                        page={page}
                                        rowsPerPage={rowsPerPage}
                                    />
                                ))}
                                {listData?.length == 0 && 
                                    <TableRow>
                                        <TableCell colspan={6} className="text-center text-muted" align="center">No data to show</TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[20, 50, 100]}
                                        colSpan={6}
                                        count={rowCount}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        SelectProps={{
                                            inputProps: { 'aria-label': 'rows per page' },
                                            native: true,
                                        }}
                                        onChangePage={handleChangePage}
                                        onChangeRowsPerPage={handleChangeRowsPerPage}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </Box>
            </Card>
        </Box>
    </Modal>
}