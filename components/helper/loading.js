import Grid from '@material-ui/core/Grid'

export default function Loading() {
    return <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: '100vh' }}>
        Loading...
    </Grid>
}