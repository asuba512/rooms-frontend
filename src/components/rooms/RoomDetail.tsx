import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import useTheme from '@material-ui/core/styles/useTheme'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import CloseIcon from '@material-ui/icons/Close'
import EventSeatIcon from '@material-ui/icons/EventSeat'
import RoomIcon from '@material-ui/icons/Room'
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'

import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'

import Slide from '@material-ui/core/Slide'
import Zoom from '@material-ui/core/Zoom'
import { TransitionProps } from '@material-ui/core/transitions'

import { IRoomDetail } from '../../redux/rooms/type'
import { mapRoomTypeEnumToString } from '../../redux/rooms/utils'

import './react-big-calendar.css'
import Schedule from './Schedule'
import { editRoom } from '../../redux/rooms/roomsThunks'
import EquipmentTable from './EquipmentTable'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingBottom: theme.spacing(2),
            overflowX: 'hidden',
        },
        appBar: {
            position: 'relative',
        },
        content: {
            padding: 0,
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

interface RoomDetailProps {
    room?: IRoomDetail
    isAdmin: boolean
    handleClose: () => void
}

function RoomDetail({ room, isAdmin, handleClose }: RoomDetailProps) {
    const classes = useStyles()
    const useFullScreen = useMediaQuery(useTheme().breakpoints.down('md'))

    const [isEdit, setIsEdit] = useState(false)
    const [name, setName] = useState(room?.name)
    const [nameInvalid, setNameInvalid] = useState(false)
    const [capacity, setCapacity] = useState(room?.capacity)
    const [capacityInvalid, setCapacityInvalid] = useState(false)
    const [location, setLocation] = useState(room?.location)
    const [locationInvalid, setLocationInvalid] = useState(false)
    const [roomType, setRoomType] = useState(room?.roomType)
    const [roomTypeInvalid, setRoomTypeInvalid] = useState(false)

    const dispatch = useDispatch()

    const setAllValid = () => {
        setNameInvalid(false)
        setCapacityInvalid(false)
        setLocationInvalid(false)
        setRoomTypeInvalid(false)
    }

    const setToOriginalValue = useCallback(() => {
        setName(room?.name)
        setCapacity(room?.capacity)
        setLocation(room?.location)
        setRoomType(room?.roomType)
    }, [room])

    const handleSaveChanges = () => {
        if (!room) {
            return
        }
        if (!name || !capacity || !location || roomType === undefined) {
            setAllValid()
            if (!name) {
                setNameInvalid(true)
            }
            if (!capacity || capacity < 0) {
                setCapacityInvalid(true)
            }
            if (!location) {
                setLocationInvalid(true)
            }
            if (roomType === undefined) {
                setRoomTypeInvalid(true)
            }
            return
        }
        setAllValid()

        dispatch(editRoom({ id: room?.id, name, capacity, location, roomType }))

        setIsEdit(false)
        return
    }

    const handleCancel = useCallback(() => {
        setToOriginalValue()
        setAllValid()
        setIsEdit(false)
    }, [setToOriginalValue])

    useEffect(() => {
        setToOriginalValue()
        return handleCancel
    }, [setToOriginalValue, handleCancel, room])

    return (
        <div>
            <Dialog
                PaperProps={{ className: classes.root }}
                maxWidth="xl"
                fullWidth
                fullScreen={useFullScreen}
                scroll="paper"
                open={room !== undefined}
                onClose={handleClose}
                TransitionComponent={
                    useFullScreen ? SlideTransition : ZoomTransition
                }
            >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            Room Detail
                        </Typography>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <DialogContent className={classes.content}>
                    <Grid container className={classes.gridRow}>
                        <Grid item className={classes.gridColumn}>
                            <div>
                                <Paper className={classes.paper}>
                                    <Toolbar disableGutters variant="dense">
                                        {isEdit ? (
                                            <TextField
                                                fullWidth
                                                error={nameInvalid}
                                                label="Name"
                                                size="medium"
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                            />
                                        ) : (
                                            <Typography
                                                variant="h6"
                                                style={{ padding: '8px 0' }}
                                            >
                                                Room {room?.name}
                                            </Typography>
                                        )}
                                        <div style={{ flexGrow: 1 }} />
                                        {isEdit ? (
                                            <>
                                                <IconButton
                                                    onClick={() =>
                                                        handleSaveChanges()
                                                    }
                                                    color="primary"
                                                >
                                                    <SaveIcon />
                                                </IconButton>
                                                <IconButton
                                                    onClick={handleCancel}
                                                    color="secondary"
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            </>
                                        ) : (
                                            isAdmin && (
                                                <IconButton
                                                    onClick={() =>
                                                        setIsEdit(true)
                                                    }
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            )
                                        )}
                                    </Toolbar>
                                    <List>
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <EventSeatIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            {isEdit ? (
                                                <TextField
                                                    fullWidth
                                                    error={capacityInvalid}
                                                    label="Capacity"
                                                    type="number"
                                                    size="medium"
                                                    value={capacity}
                                                    onChange={(e) =>
                                                        setCapacity(
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                    style={{ margin: '4px 0' }}
                                                />
                                            ) : (
                                                <ListItemText
                                                    primary={room?.capacity}
                                                    secondary="Capacity"
                                                />
                                            )}
                                        </ListItem>
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <RoomIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            {isEdit ? (
                                                <TextField
                                                    fullWidth
                                                    error={locationInvalid}
                                                    label="Location"
                                                    size="medium"
                                                    value={location}
                                                    onChange={(e) =>
                                                        setLocation(
                                                            e.target.value
                                                        )
                                                    }
                                                    style={{ margin: '4px 0' }}
                                                />
                                            ) : (
                                                <ListItemText
                                                    primary={room?.location}
                                                    secondary="Location"
                                                />
                                            )}
                                        </ListItem>
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <MeetingRoomIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            {isEdit ? (
                                                <TextField
                                                    fullWidth
                                                    error={roomTypeInvalid}
                                                    select
                                                    label="Type"
                                                    value={roomType}
                                                    onChange={(e) =>
                                                        setRoomType(
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                    style={{ margin: '4px 0' }}
                                                >
                                                    <MenuItem value={0}>
                                                        {mapRoomTypeEnumToString(
                                                            0
                                                        )}
                                                    </MenuItem>
                                                    <MenuItem value={1}>
                                                        {mapRoomTypeEnumToString(
                                                            1
                                                        )}
                                                    </MenuItem>
                                                    <MenuItem value={2}>
                                                        {mapRoomTypeEnumToString(
                                                            2
                                                        )}
                                                    </MenuItem>
                                                    <MenuItem value={3}>
                                                        {mapRoomTypeEnumToString(
                                                            3
                                                        )}
                                                    </MenuItem>
                                                </TextField>
                                            ) : (
                                                <ListItemText
                                                    primary={mapRoomTypeEnumToString(
                                                        room?.roomType
                                                    )}
                                                    secondary="Type"
                                                />
                                            )}
                                        </ListItem>
                                    </List>
                                </Paper>
                            </div>
                        </Grid>
                        <Grid item className={classes.gridColumn}>
                            <EquipmentTable room={room} isAdmin={isAdmin} />
                        </Grid>
                        <Grid item className={classes.gridColumnFill}>
                            <Paper className={classes.paper}>
                                <Schedule roomId={room?.id} />
                            </Paper>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default RoomDetail
