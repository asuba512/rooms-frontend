import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getReservations } from '../redux/reservation/reservationsThunks'
import { RootState } from '../redux/type'
import Schedule from './ScheduleComponent/Schedule'
import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            padding: theme.spacing(2),
        },
    })
)

function FullSchedule() {
    const classes = useStyles()
    const dispatch = useDispatch()
    const reservationState = useSelector(
        (state: RootState) => state.reservationsAPI
    )

    useEffect(() => {
        dispatch(getReservations())
    }, [dispatch])

    return (
        <Paper className={classes.content}>
            <Schedule
                title="Schedule"
                events={reservationState?.reservations || []}
                onRangeChange={undefined}
            />
        </Paper>
    )
}

export default FullSchedule
