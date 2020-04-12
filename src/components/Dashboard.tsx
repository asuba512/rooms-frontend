import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getReservations } from '../redux/reservation/reservationsThunks'
import { RootState } from '../redux/type'
import Schedule from './ScheduleComponent/Schedule'

function Dashboard() {
    const dispatch = useDispatch()
    const reservationState = useSelector(
        (state: RootState) => state.reservationsAPI
    )

    useEffect(() => {
        dispatch(getReservations())
    }, [dispatch])

    return (
        <div>
            <Schedule
                title="Schedule for all rooms"
                events={reservationState?.reservations || []}
                onRangeChange={undefined}
            />
        </div>
    )
}

export default Dashboard
