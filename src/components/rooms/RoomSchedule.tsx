import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/type'
import React, { useEffect, useState } from 'react'
import { getRoomSchedule } from '../../redux/rooms/roomsThunks'
import Schedule from '../ScheduleComponent/Schedule'

const date = new Date()
const y = date.getFullYear()
const m = date.getMonth()

interface RoomScheduleProps {
    roomId?: number
}

function RoomSchedule({ roomId }: RoomScheduleProps) {
    const schedule = useSelector(
        (state: RootState) => state.roomsAPI.room?.schedule
    )

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

    const onRangeChangeHandler = (datesVisible: Date[] | any) => {
        const startVisibleRaw = datesVisible[0]
        const startVisible = new Date(
            Date.UTC(
                startVisibleRaw.getFullYear(),
                startVisibleRaw.getMonth() - 1
            )
        )
        const endVisibleRaw = datesVisible[datesVisible.length - 1]
        const endVisible = new Date(
            Date.UTC(endVisibleRaw.getFullYear(), endVisibleRaw.getMonth() + 2)
        )
        if (startVisible < start) {
            setStart(
                new Date(
                    Date.UTC(
                        startVisible.getFullYear(),
                        startVisible.getMonth()
                    )
                )
            )
        }
        if (endVisible > end) {
            setEnd(
                new Date(
                    Date.UTC(endVisible.getFullYear(), endVisible.getMonth())
                )
            )
        }
    }

    return schedule ? (
        <Schedule
            title="Room Schedule"
            events={schedule}
            onRangeChange={onRangeChangeHandler}
        />
    ) : null
}

export default RoomSchedule
