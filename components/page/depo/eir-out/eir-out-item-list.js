import { Icon, IconButton, Tooltip } from "@material-ui/core";

export default function EirOutItemList(props) {
    return (
        <div>
            <div className="container-item">

                <div className="serial-number" style={{ width: 120 }}>
                    <small>EIR Number</small> <br/>
                    <strong>{`${props?.data?.id}`}</strong>
                </div>
                <div className="size-type" style={{ width: 200 }}>
                    <small>Datetime</small> <br/>
                    <span>20 June 2021 at 16:00 PM</span>
                </div>
                <div className="condition" style={{ width: 140 }}>
                    <small>Container Number</small> <br/>
                    <span>TIHU1234{props?.data?.id}</span>
                </div>
                <div className="condition" style={{ width: 180 }}>
                    <small>Delivery Number</small> <br/>
                    <span>OH.SWIRE/1234/1234</span>
                </div>
                <div className="condition" style={{ width: 200 }}>
                    <small>Shipper</small> <br/>
                    <span>PT Tradecorp Indonesia</span>
                </div>
                <div className="condition" style={{ width: 200 }}>
                    <small>Destintation</small> <br/>
                    <span>PT Icon Line</span>
                </div>
                <div className="condition">
                    <small>Created By</small> <br/>
                    <span>Dika</span>
                </div>
                <div style={{ flexGrow: 1 }}/>
                <div>
                    <Tooltip title="Print Document">
                        <IconButton>
                            <Icon>print</Icon>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="View Detail">
                        <IconButton>
                            <Icon>visibility</Icon>
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <style jsx>{`
                .color {
                    width: 12px;
                    height: 12px;
                    background: #FCC616;
                    border-radius: 50%;
                    margin-right: 16px
                }
                .container-item {
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    width: 100%;
                    justify-content: flex-start;
                    cursor: pointer;
                }
                .container-item:hover {
                    background: #fafafa;
                }
                .serial-number {
                    width: 200px;
                    font-size: 14px
                }
                .status {
                    padding: 8px;
                    background: #efefef;
                    border-radius: 50px;
                    width: 160px;
                    display: block;
                    float: right;
                    text-align: center;
                    font-size: 12px;
                    font-weight: 600;
                    margin-left: 24px;
                    color: #88181B
                }
                .size-type, .yom, .price {
                    width: 200px;
                }
                .remarks {
                    flex-grow: 1;
                    margin-left: 16px
                }
                .condition {
                    width: 200px
                }
                small {
                    color: #666;
                    font-size: 11px
                }
                .size-type span, .yom span, .price strong, .condition span, .remarks span {
                    font-size: 13px;
                }
            `}</style>
        </div>
    )
}