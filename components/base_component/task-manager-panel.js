import React from 'react'
import { makeStyles, SwipeableDrawer, Paper, Box, Typography } from '@material-ui/core'

const useStyles = makeStyles({
    panel: {
        width: 450,
        padding: 20,
    },
    title: {
        textAlign: 'center',
    }
})

export default function TaskPanel(props) {
    const classes = useStyles()
    const anchor = 'right'

    return (
        <SwipeableDrawer anchor={anchor} open={props.open} onClose={() => props.close()} disableBackdropTransition={true}>
            <Box className={classes.panel}>
                <Typography variant="h4" className={classes.title}>Task Manager</Typography>
            </Box>
        </SwipeableDrawer>
    )
}