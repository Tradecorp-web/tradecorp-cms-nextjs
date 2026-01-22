export default function StockContainerItemList(props) {
    return (
        <div>
            <div className="container-item">
                <span className="color" />
                <strong className="serial-number">{`TIHU1234${props?.data?.id}`}</strong>
                <div className="size-type">
                    <small>Size/Type</small> <br/>
                    <span>20GP</span>
                </div>
                <div className="yom">
                    <small>YOM</small> <br/>
                    <span>06/2006</span>
                </div>
                <div className="condition">
                    <small>Condition</small> <br/>
                    <span>DM / ASIS (90%)</span>
                </div>
                <div className="price">
                    <small>Selling Price</small> <br/>
                    <strong>Rp 40.000.000</strong>
                </div>
                <div className="remarks">
                    <small>Remarks</small> <br/>
                    <span>For some project For some project For some project</span>
                </div>
                <div style={{flexGrow: 1, textAlign: "right"}}>
                    <span className="status">Sale Stock</span>
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
                    width: 160px;
                    font-weight: 600;
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
                    width: 120px;
                }
                .remarks {
                    flex-grow: 1;
                    margin-left: 16px
                }
                .condition {
                    width: 140px
                }
                small {
                    color: #666;
                    font-size: 10px
                }
                .size-type span, .yom span, .price strong, .condition span, .remarks span {
                    font-size: 12px;
                }
            `}</style>
        </div>
    )
}