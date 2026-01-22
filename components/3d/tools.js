import React from 'react'
import Image from 'next/image'
import { Grid,Typography,Card,CardActionArea,CardMedia,CardContent } from '@material-ui/core'

class Tools extends React.Component {
    render = () => {
        var classes = {
            container: {
                padding: '10px'
            },
            listTitle: {
                marginTop: '15px',
                textTransform: 'uppercase'
            },
            card: {
                maxWidth: 180,
                margin: '20px auto'
            },
            cardArea: {
                display: 'flex',
                justifyContent: 'left',
                alignItems: 'center',
                padding: '10px 15px'
            },
            cardText: {
                marginLeft: '10px',
                fontSize: '12px'
            }
        }
        return (
            <Grid container>
                <Grid item xs={12} sm={12}>
                    <Typography variant="h4" align="center" style={classes.listTitle}>Title</Typography>
                </Grid>
                <Grid item xs={12} sm={12} style={classes.container}>
                    <Card style={classes.card}>
                        <CardActionArea onClick={this.props.clickDoor}>
                            <CardContent style={classes.cardArea}>
                                <Image width={40} height={50} src="/images/door.png"/>
                                <Typography component="div" style={classes.cardText}>Door</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    <Card style={classes.card}>
                        <CardActionArea onClick={this.props.clickWindow}>
                            <CardContent style={classes.cardArea}>
                                <Image width={40} height={50} src="/images/window.png"/>
                                <Typography component="div" style={classes.cardText}>Window</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    <Card style={classes.card}>
                        <CardActionArea onClick={this.props.clickACOut}>
                            <CardContent style={classes.cardArea}>
                                <Image width={60} height={50} src="/images/ac.png"/>
                                <Typography component="div" style={classes.cardText}>AC</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>
        )
    }
}

export default Tools