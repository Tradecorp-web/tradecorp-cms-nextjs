import { Divider, Fab, Grid, Icon, IconButton, Link, Paper, Tooltip, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import useSWR from "swr";
import EirOutLayout from "./eir-out-layout";

export default function EirOutDetail(props) {

    const fetcher = () => fetch(`https://www.pintarkomputer.com/wp-json/wp/v2/posts/${props?.eirNo}`).then(res => res.json())
    const { data, err } = useSWR(
        (props?.eirNo ?? false) ? props?.eirNo : null, 
        fetcher
    )

    const router = useRouter()

    function back(e) {
        e.preventDefault()
        router.push(containerStockRoute)
    }

    if (!data) return (
        <EirOutLayout eirNo={props?.eirNo}>
            <div>loading...</div>
        </EirOutLayout>
    )

    return (
        <EirOutLayout eirNo={props?.eirNo} title={`EIR OUT: ${data?.id}`}>
            <div className="display-space-between">
                <h1 className="mb-3">EIR NO {data?.id}</h1>
                <div>
                    <IconButton 
                        className="icon"
                        onClick={() => {
                            stocksSelected.remo
                            setStocksSelected(stocksSelected)
                            setTest(stocksSelected.length)
                        }}>
                        <Icon color="primary">email</Icon>
                    </IconButton>
                    <IconButton 
                        className="icon"
                        onClick={() => router.push("/file/do-release.pdf")}>
                        <Icon color="primary">print</Icon>
                    </IconButton>
                </div>
            </div>
            <Divider />
            <Grid container className="mt-5">
                <Grid item xl={3} md={4}>
                    <div className="container-detail-wrapper">
                        <div className="mb-3">
                            <div>
                                <Typography variant="caption" color="textSecondary" gutterBottom>EIR NO</Typography>
                            </div>
                            <div>
                                <Typography variant="body1" gutterBottom>{data?.id}</Typography>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div>
                                <Typography variant="caption" color="textSecondary" gutterBottom>Datetime</Typography>
                            </div>
                            <div>
                                <Typography variant="body1" gutterBottom>20 May 2021 at 13:00 PM</Typography>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div>
                                <Typography variant="caption" color="textSecondary" gutterBottom>Delivery Number</Typography>
                            </div>
                            <div>
                                <Typography variant="body1" gutterBottom>OH.SWIRE/1234/1234</Typography>
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <div>
                            <Typography variant="caption" color="textSecondary" gutterBottom>Shipper</Typography>
                        </div>
                        <div>
                            <Typography variant="body1" gutterBottom>PT Tradecorp Indonesia</Typography>
                        </div>
                    </div>
                    <div className="mb-3">
                        <div>
                            <Typography variant="caption" color="textSecondary" gutterBottom>Vessel/Voy. No</Typography>
                        </div>
                        <div>
                            <Typography variant="body1" gutterBottom>By Truck</Typography>
                        </div>
                    </div>
                    <div className="mb-3">
                        <div>
                            <Typography variant="caption" color="textSecondary" gutterBottom>Destination</Typography>
                        </div>
                        <div>
                            <Typography variant="body1" gutterBottom>PT Icon Line</Typography>
                        </div>
                    </div>
                    <div className="mb-3">
                        <div>
                            <Typography variant="caption" color="textSecondary" gutterBottom>Movement</Typography>
                        </div>
                        <div>
                            <Typography variant="body1" gutterBottom>OUT</Typography>
                        </div>
                    </div>
                    <div className="mb-3">
                        <div>
                            <Typography variant="caption" color="textSecondary" gutterBottom>Trucker</Typography>
                        </div>
                        <div>
                            <Typography variant="body1" gutterBottom>HSP</Typography>
                        </div>
                    </div>
                    <div className="mb-3">
                        <div>
                            <Typography variant="caption" color="textSecondary" gutterBottom>Vehicle No</Typography>
                        </div>
                        <div>
                            <Typography variant="body1" gutterBottom>B 1234 BI</Typography>
                        </div>
                    </div>
                </Grid>
                <Grid item xl={3} md={4}>
                    <h4 className="mb-3">Container</h4>
                    <div className="mb-3">
                        <div>
                            <Typography variant="caption" color="textSecondary" gutterBottom>Container Number</Typography>
                        </div>
                        <div>
                            <Typography variant="body1" gutterBottom>TIHU12346453</Typography>
                        </div>
                    </div>
                    <div className="mb-3">
                        <div>
                            <Typography variant="caption" color="textSecondary" gutterBottom>Size/Type</Typography>
                        </div>
                        <div>
                            <Typography variant="body1" gutterBottom>20/GP</Typography>
                        </div>
                    </div>
                    <div className="mb-3">
                        <div>
                            <Typography variant="caption" color="textSecondary" gutterBottom>Condition</Typography>
                        </div>
                        <div>
                            <Typography variant="body1" gutterBottom>DM</Typography>
                        </div>
                    </div>
                    <div className="mb-3">
                        <div>
                            <Typography variant="caption" color="textSecondary" gutterBottom>Principal</Typography>
                        </div>
                        <div>
                            <Typography variant="body1" gutterBottom>Tradecorp</Typography>
                        </div>
                    </div>
                    <div className="mb-3">
                        <div>
                            <Typography variant="caption" color="textSecondary" gutterBottom>Remark</Typography>
                        </div>
                        <div>
                            <Typography variant="body1" gutterBottom>Off Hire Mentari</Typography>
                        </div>
                    </div>
                </Grid>
                <Grid item xl={3} md={4}>
                    <h4 className="mb-3">Signature</h4>
                    <div className="mb-3">
                        <div>
                            <Typography variant="caption" color="textSecondary" gutterBottom>For Carier</Typography>
                        </div>
                        <div>
                            <Typography variant="body1" gutterBottom>Dika</Typography>
                        </div>
                    </div>
                    <div className="mb-3">
                        <div>
                            <Typography variant="caption" color="textSecondary" gutterBottom>For Depot</Typography>
                        </div>
                        <div>
                            <Typography variant="body1" gutterBottom>Erny</Typography>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </EirOutLayout>
    )
}