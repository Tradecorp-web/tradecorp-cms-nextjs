import { Icon, IconButton, Tooltip } from "@material-ui/core";

export default function DOReleaseItemList(props) {
    return (
        <div>
            <div className="container-item">

                <div className="serial-number">
                    <small>Release Number</small> <br/>
                    <strong>{`${props?.data?.id}/21/05/2021`}</strong>
                </div>
                <div className="size-type">
                    <small>Release Date</small> <br/>
                    <span>20 June 2021</span>
                </div>
                <div className="size-type">
                    <small>Expiration Date</small> <br/>
                    <span>20 June 2021</span>
                </div>
                <div className="condition">
                    <small>Party</small> <br/>
                    <span>20x20GP</span>
                </div>
                <div className="condition">
                    <small>Customer</small> <br/>
                    <span>PT Pentawira</span>
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
                    font-size: 14px;
                }
            `}</style>
        </div>
    )
}