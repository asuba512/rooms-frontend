import Typography from '@material-ui/core/Typography'
import {Calendar, momentLocalizer} from 'react-big-calendar'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {getRoomSchedule} from '../../redux/rooms/roomsThunks'
import {RootState} from '../../redux/type'
import moment from 'moment'


const localizer = momentLocalizer(moment)

interface ScheduleProps {
    roomId?: number
}

const date = new Date()
const y = date.getFullYear()
const m = date.getMonth()

function Schedule({roomId}: ScheduleProps) {
    const schedule = useSelector((state: RootState) => state.roomsAPI.room?.schedule)

    const [start, setStart] = useState(new Date(Date.UTC(y, m - 2)))
    const [end, setEnd] = useState(new Date(Date.UTC(y, m + 2)))

    const dispatch = useDispatch()
    useEffect(() => {
        if (roomId) {
            dispatch(
                getRoomSchedule({
                    id: roomId,
                    start: start.toISOString(),
                    end: end.toISOString(),
                })
            )
        }
    }, [dispatch, roomId, start, end])

    const handleRangeChanged = (datesVisible:Date[] | any) => {
        const startVisibleRaw = datesVisible[0]
        const startVisible = new Date(Date.UTC(startVisibleRaw.getFullYear(), startVisibleRaw.getMonth() - 1))
        const endVisibleRaw = datesVisible[datesVisible.length - 1]
        const endVisible = new Date(Date.UTC(endVisibleRaw.getFullYear(), endVisibleRaw.getMonth() + 2))
        if(startVisible < start) {
            setStart(new Date(Date.UTC(startVisible.getFullYear(), startVisible.getMonth())))
        }
        if(endVisible > end) {
            setEnd(new Date(Date.UTC(endVisible.getFullYear(), endVisible.getMonth())))
        }
    }

    const scheduleItems =
        schedule?.map((event) => {
            return {
                title: event.subject?.abbreviation,
                start: new Date(event.start),
                end: new Date(event.end),
                subtitle: event.name,
                type: event.type,
            }
        }) || []

    return (
        <>
        <Typography variant="h6">Room Schedule</Typography>
        <Calendar
            localizer={localizer}
            events={scheduleItems}
            defaultView="week"
            views={['week']}
            min={new Date(0, 0, 0, 7)}
            max={new Date(0, 0, 0, 22)}
            onRangeChange={handleRangeChanged}
            components={{
                event: ({
                            event,
                        }: {
                    event: {
                        title: string | undefined
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
    </>
    )
}

export default Schedule