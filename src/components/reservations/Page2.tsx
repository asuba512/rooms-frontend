import React, { useEffect, useState } from 'react'
import { Button } from '@material-ui/core'
import { IPage1Data } from './ReservationWizard'
import { useDispatch, useSelector } from 'react-redux'
import { getAvailableRooms } from '../../redux/rooms/roomsThunks'
import { RootState } from '../../redux/type'
import wizardStyles from './wizardStyles'
import Grid from '@material-ui/core/Grid'
import TableComponent from '../TableComponent/TableComponent'
import { roomTypesAsObject } from '../../redux/rooms/utils'
import { toast } from 'react-toastify'
import moment from 'moment'

interface Page2Props {
    savePage: (roomIds: number[]) => void
    goBack: () => void
    constraints?: IPage1Data
    data?: number[]
}

function Page2({ savePage, goBack, constraints, data }: Page2Props) {
    const classes = wizardStyles()

    const dispatch = useDispatch()
    useEffect(() => {
        if (constraints) {
            dispatch(
                getAvailableRooms({
                    start: moment.utc(constraints.startDate).toISOString(),
                    end: moment.utc(constraints.endDate).toISOString(),
                    repeatsIn: constraints.isRepeating
                        ? constraints.repeatsIn
                        : 1,
                    numberOfWeeks: constraints.isRepeating
                        ? constraints.numberOfWeeks
                        : 1,
                    capacity: constraints.capacity || 0,
                })
            )
        }
    }, [dispatch, constraints])

    const rooms = useSelector((state: RootState) => state.roomsAPI.rooms) || []
    const cells = {
        name: { title: 'Name' },
        roomType: {
            title: 'Room Type',
            allowedValues: roomTypesAsObject,
        },
        capacity: { title: 'Room Capacity', isNumeric: true },
        location: { title: 'Location', isOptional: true },
    }

    const [selected, setSelected] = useState(data || ([] as number[]))

    const savePageHandler = () => {
        if (selected.length === 0) {
            toast.error('You must select at least one room!')
            return
        }
        toast.dismiss()
        savePage(selected)
    }

    return (
        <Grid container className={classes.gridColumn}>
            <Grid item className={classes.gridRow}>
                <TableComponent
                    title="Available Rooms"
                    rowData={rooms}
                    cells={cells}
                    defaultSort="name"
                    allowSelection
                    setSelectedOutput={setSelected}
                    selectedOutput={selected}
                />
            </Grid>
            <Grid item className={classes.gridRow}>
                <div className={classes.content}>
                    <Button onClick={goBack} variant="contained">
                        Previous Page
                    </Button>
                    <div className={classes.spacer} />
                    <Button onClick={savePageHandler} variant="contained">
                        Next Page
                    </Button>
                </div>
            </Grid>
        </Grid>
    )
}

export default Page2
