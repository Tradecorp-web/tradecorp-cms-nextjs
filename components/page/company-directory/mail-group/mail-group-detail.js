import { Divider, Typography, Grid, IconButton, Icon, Card, Avatar, Button, Link } from "@material-ui/core";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import BaseLayoutCompanyDirectory from "../../../base_layout/base-layout-company-directory";
import LeaseAgreementForm from "./mail-group-form";
import { getDetailMailGroupSwr } from "../../../../services/swr/mail-groups.swr";
import { updateMailGroupApi } from "../../../../services/api/mail-group.api";

export default function MailGroupDetail() {

    const router = useRouter()
    const mailGroupId = router.query.id

    const [mailGroup, setMailGroup] = useState(null)
    const mailGroupSwr = getDetailMailGroupSwr(mailGroupId)
    useEffect(() => {
        setMailGroup(mailGroupSwr.data)
    }, [mailGroupSwr.data])

    const [openFormEdit, setOpenFormEdit] = useState(false)

    function updateData() {
        updateMailGroupApi(mailGroup, mailGroup?.id).then((res) => {
            setMailGroup(res)
        })
    }
    
    const textAreaRef = useRef(null)
    const [isCoppied, setCoppied] = useState(false)

    function sendAndCopyMailToClipboard() {
        var dummy = document.createElement("textarea")
        document.body.appendChild(dummy)
        dummy.value = getMailList()
        dummy.select()
        document.execCommand("copy")
        document.body.removeChild(dummy)
        setCoppied(true)
        console.log("DDDD")
        setTimeout(() => {
            setCoppied(false)
        }, 500)
        router.push(`mailto:${getMailList()}?subject=${mailGroup?.subject}`)
    }

    function getMailList() {
        var mailList = "";
        mailGroup?.users?.forEach(item => {
            mailList += `${item.user.email};`
        });
        return mailList
    }

    return (
        <BaseLayoutCompanyDirectory serialNumber={mailGroup?.serial_number} title={` ${mailGroup?.group_name}`}>
            <textarea type="hidden" ref={textAreaRef} value='Some text to copy 23' style={{display: "none"}}/>
            <div className="p-5 content-wrapper">
                <Grid container className="page-container" alignItems="center" justify="center" spacing={3}>
                    <Grid item xs={12} lg={10} xl={6}>
                        <h1 className="mb-3">Mail Group Detail</h1>
                        <div variant="outlined" className="p-4 mb-5 card">
                            <div className="container-detail-wrapper">
                                <div className="mb-3">
                                    <div>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Group Name</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body1" gutterBottom>{mailGroup?.group_name}</Typography>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div>
                                        <Typography variant="caption" color="textSecondary" gutterBottom>Subject</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="body1" gutterBottom>{mailGroup?.subject}</Typography>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <Card variant="outlined">
                                        <div className="ps-3 pe-3 pt-2 pb-2 display-space-between">
                                            <Typography variant="h3" color="textSecondary">List Users</Typography>
                                            <div>
                                                <Button variant="outlined" size="small" color="default" onClick={() => setOpenForm(true)}>
                                                    <Icon className="me-2">add</Icon>Add User
                                                </Button>
                                                <Button variant="outlined" className="ms-2" size="small" color="default" onClick={sendAndCopyMailToClipboard}>
                                                    <Icon
                                                        className="me-2"
                                                        color={isCoppied ? "secondary" : "default"}>
                                                        send
                                                    </Icon>
                                                    Send mail to group
                                                    {/* {isCoppied ? "Coppied" : "Copy to Clipboard"} */}
                                                </Button>
                                            </div>
                                        </div>
                                        {mailGroup?.users?.map((item, index) => (
                                            <div>
                                                <Divider />
                                                <div className="ps-3 pe-3 pt-2 pb-2 flex-center">
                                                    <Avatar alt={item?.user?.name} src={item?.user?.photo} />
                                                    <div className="ms-3" style={{flexGrow: 1}}>
                                                        <Typography variant="body1">{item?.user?.name}</Typography>
                                                        <Typography variant="caption">{item?.user?.email}</Typography>
                                                    </div>
                                                    <Link href={`mailto:${item?.user?.email}`}>
                                                        <IconButton 
                                                            className="icon ms-2"
                                                            size="small">
                                                            <Icon>mail</Icon>
                                                        </IconButton>
                                                    </Link>
                                                    <IconButton 
                                                        className="icon ms-2"
                                                        onClick={() => {
                                                            mailGroup.users.splice(index, 1)
                                                            setMailGroup(mailGroup)
                                                            updateData()
                                                        }}>
                                                        <Icon>delete</Icon>
                                                    </IconButton>
                                                </div>
                                            </div>
                                        ))}
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>

            <LeaseAgreementForm 
                open={openFormEdit} 
                closeModal={() => setOpenFormEdit(false)} 
                isEdit={true}
                dataUpdated={mailGroupSwr?.mutate}
                data={mailGroup}/>
        </BaseLayoutCompanyDirectory>
    )
}