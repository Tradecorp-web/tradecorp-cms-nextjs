import { Card, Container, Divider, Grid, Icon, List, ListItem, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import getRoute from "../../../../helpers/router";
import BaseLayoutDepo from "../../../base_layout/base-layout-depo";

export default function DepoSettingLayout(props) {

    const router = useRouter()
    const depoSlug = router.query.depoSlug
    const generalSettingUrl = getRoute("depo.settings", {depoSlug: depoSlug})
    const operationSettingUrl = getRoute("depo.settings.operation", {depoSlug: depoSlug})
    const layoutSettingUrl = getRoute("depo.settings.layout", {depoSlug: depoSlug})



    var currentMenu = ""
    if(router.pathname.includes("/settings/operation-officer")) {
        currentMenu = "operation"
    } else if(router.pathname.includes("/settings/layout")) {
        currentMenu = "layout"
    } else {
        currentMenu = "general"
    }

    function toOtherMenu(e, slug) {
        e.preventDefault()
        router.push(slug)
    }

    return <BaseLayoutDepo>
        <Container className="pt-5 mt-5 pb-5 mb-5">
            <Grid container>
                <Grid item lg={3} key="1">
                    <Card variant="outlined" className="pt-1 pb-1">
                        <List key="43" component="nav" className="p-0" dense={true} aria-label="main mailbox folders" onClick={(e) => toOtherMenu(e, generalSettingUrl)}>
                            <ListItem button className="pt-2 pb-2" selected={currentMenu == "general"}>
                                <ListItemText primary="General" />
                            </ListItem>
                        </List>
                        <Divider/>
                        <List key="23" component="nav" className="p-0" dense={true} aria-label="secondary mailbox folders" onClick={(e) => toOtherMenu(e, operationSettingUrl)}>
                            <ListItem button className="pt-2 pb-2" selected={currentMenu == "operation"}>
                                <ListItemText primary="Operation Officer" />
                            </ListItem>
                        </List>
                        <Divider/>
                        <List key="21" component="nav" className="p-0" dense={true} aria-label="secondary mailbox folders" onClick={(e) => toOtherMenu(e, layoutSettingUrl)}>
                            <ListItem button className="pt-2 pb-2" selected={currentMenu == "layout"}>
                                <ListItemText primary="Depo Layout" />
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
                <Grid item lg={9} className="ps-5" key="2">
                    {props?.children}
                </Grid>
            </Grid>
        </Container>
    </BaseLayoutDepo>
}