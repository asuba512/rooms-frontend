import React, { useEffect } from 'react'
import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import useTheme from '@material-ui/core/styles/useTheme'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import EventSeatIcon from '@material-ui/icons/EventSeat'
import RoomIcon from '@material-ui/icons/Room'
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'

import Slide from '@material-ui/core/Slide'
import Zoom from '@material-ui/core/Zoom'
import { TransitionProps } from '@material-ui/core/transitions'

import { RoomDetailInterface } from '../../redux/rooms/type'
import { mapRoomTypeEnumToString } from '../../redux/rooms/utils'
import TableComponent from '../TableComponent/TableComponent'
import { useDispatch } from 'react-redux'
import { getRoomSchedule } from '../../redux/rooms/roomsThunks'

import './react-big-calendar.css'
import { Card } from '@material-ui/core'

const localizer = momentLocalizer(moment)

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingBottom: theme.spacing(2),
            overflowX: 'hidden',
        },
        appBar: {
            position: 'relative',
        },
        gridRow: {
            width: '100%',
            justifyContent: 'space-evenly',
            [theme.breakpoints.down('sm')]: {
                width: '100%',
            },
        },
        gridColumn: {
            marginTop: theme.spacing(2),
            width: `calc(50% - 1.5*${theme.spacing(2)}px)`,
            [theme.breakpoints.down('sm')]: {
                width: '100vw',
                flexGrow: 1,
            },
        },
        gridColumnFill: {
            marginTop: theme.spacing(2),
            width: `calc(100% - 2*${theme.spacing(2)}px)`,
            [theme.breakpoints.down('sm')]: {
                width: '100vw',
                flexGrow: 1,
            },
        },
        paper: {
            display: 'block',
            padding: theme.spacing(2),
            width: '100%',
            overflowX: 'auto',
        },
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
    })
)

const SlideTransition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />
})

const ZoomTransition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Zoom ref={ref} {...props} />
})

interface FullScreenDialogProps {
    room?: RoomDetailInterface
    handleClose: () => void
}

function RoomDetail({ room, handleClose }: FullScreenDialogProps) {
    const classes = useStyles()
    const useFullScreen = useMediaQuery(useTheme().breakpoints.down('md'))

    const dispatch = useDispatch()
    useEffect(() => {
        if (room) {
            dispatch(
                getRoomSchedule({
                    id: room.id,
                    start: new Date('2020-04-01'),
                    end: new Date('2020-04-30'),
                })
            )
        }
    }, [dispatch, room?.id])

    const scheduleItems =
        room?.schedule?.map((event) => {
            return {
                title: event.subject,
                start: new Date(event.start),
                end: new Date(event.end),
                subtitle: event.name,
                type: event.type,
            }
        }) || []

    // @ts-ignore
    return (
        <div>
            <Dialog
                PaperProps={{ className: classes.root }}
                maxWidth="xl"
                fullWidth
                fullScreen={useFullScreen}
                open={room !== undefined}
                onClose={handleClose}
                TransitionComponent={
                    useFullScreen ? SlideTransition : ZoomTransition
                }
            >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Room Detail
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Grid container className={classes.gridRow}>
                    <Grid item className={classes.gridColumn}>
                        <Paper className={classes.paper}>
                            <Typography variant="h6">
                                Room {room?.name}
                            </Typography>
                            <List>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <EventSeatIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={room?.capacity}
                                        secondary="Capacity"
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <RoomIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={room?.location}
                                        secondary="Location"
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <MeetingRoomIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={mapRoomTypeEnumToString(
                                            room?.roomType
                                        )}
                                        secondary="Type"
                                    />
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item className={classes.gridColumn}>
                        <TableComponent
                            title="Equipment"
                            data={room?.equipment || []}
                            cells={{
                                type: { title: 'Type', isNumeric: false },
                                brand: { title: 'Brand', isNumeric: false },
                                model: { title: 'Model', isNumeric: false },
                                quantity: {
                                    title: 'Quantity',
                                    isNumeric: true,
                                },
                            }}
                            defaultSort="type"
                        />
                    </Grid>
                </Grid>
                <Grid container className={classes.gridRow}>
                    <Grid item className={classes.gridColumnFill}>
                        <Paper className={classes.paper}>
                            <Typography variant="h6">Room Schedule</Typography>
                            <Calendar
                                localizer={localizer}
                                events={scheduleItems}
                                defaultView="week"
                                views={['week']}
                                min={new Date(0, 0, 0, 7)}
                                max={new Date(0, 0, 0, 22)}
                                components={{
                                    event: ({
                                        event,
                                    }: {
                                        event: {
                                            title: string | null
                                            start: Date
                                            end: Date
                                            subtitle: string
                                            type: number
                                        }
                                    }) => {
                                        return (
                                            <div>
                                                <Typography>
                                                    {event.title}
                                                </Typography>
                                                <Typography
                                                    color="textSecondary"
                                                    variant="caption"
                                                >
                                                    {event.subtitle}
                                                </Typography>
                                            </div>
                                        )
                                    },
                                }}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Dialog>
        </div>
    )
}

export default RoomDetail
