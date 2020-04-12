import React, { useState } from 'react'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Paper from '@material-ui/core/Paper'
import Page1 from './Page1'
import Page2 from './Page2'
import Page3 from './Page3'
import wizardStyles from './wizardStyles'
import { createReservation } from '../../redux/reservation/reservationsThunks'
import { useDispatch } from 'react-redux'
import { Button } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import moment, { Moment } from 'moment'

export interface IPage1Data {
    startDate: Moment
    endDate: Moment
    isRepeating: boolean
    repeatsIn: number
    numberOfWeeks: number
    capacity: number
}

export interface IPage3Data {
    name: string
    reservationType: number
    courseId: number
}

function ReservationWizard() {
    const classes = wizardStyles()

    const dispatch = useDispatch()

    const steps = [
        'Select Date, Time and Capacity',
        'Select Rooms',
        'Add Details',
    ]
    const [activeStep, setActiveStep] = useState(2)

    const [page1Data, setPage1Data] = useState(
        undefined as IPage1Data | undefined
    )
    const [page2Data, setPage2Data] = useState(
        undefined as number[] | undefined
    )

    const [page3Data, setPage3Data] = useState(
        undefined as IPage3Data | undefined
    )

    const getPageContents = () => {
        switch (activeStep) {
            case 0:
                return <Page1 savePage={savePage1} data={page1Data} />
            case 1:
                return (
                    <Page2
                        savePage={savePage2}
                        goBack={goBackToPage1}
                        constraints={page1Data}
                        data={page2Data}
                    />
                )
            case 2:
                return (
                    <Page3
                        savePage={savePage3}
                        goBack={goBack}
                        data={page3Data}
                    />
                )
            case 3:
                return (
                    <Paper className={classes.content}>
                        <Grid container className={classes.gridColumn}>
                            <Typography variant="h6">
                                Your reservation is done.
                            </Typography>
                            <Button
                                className={classes.margin}
                                variant="contained"
                                onClick={reset}
                            >
                                Create another
                            </Button>
                        </Grid>
                    </Paper>
                )
        }
    }

    const reset = () => {
        setActiveStep(0)
        setPage1Data(undefined)
        setPage2Data(undefined)
        setPage3Data(undefined)
    }

    const goBack = () => {
        setActiveStep(activeStep - 1)
    }

    const goBackToPage1 = () => {
        setPage2Data([])
        setActiveStep(activeStep - 1)
    }

    const savePage1 = (data: IPage1Data) => {
        setPage1Data(data)
        setActiveStep(1)
    }

    const savePage2 = (roomIds: number[]) => {
        setPage2Data(roomIds)
        setActiveStep(2)
    }

    const savePage3 = (data: IPage3Data) => {
        setPage3Data(data)
        setActiveStep(3)
        saveReservation(data)
    }

    const saveReservation = (page3Data: IPage3Data) => {
        if (page1Data && page2Data && page3Data) {
            dispatch(
                createReservation({
                    start: moment.utc(page1Data.startDate).toISOString(),
                    end: moment.utc(page1Data.endDate).toISOString(),
                    numberOfWeeks: page1Data.isRepeating
                        ? page1Data.numberOfWeeks
                        : 1,
                    repeatsIn: page1Data.isRepeating ? page1Data.repeatsIn : 1,
                    roomIds: page2Data,
                    courseId: page3Data.courseId,
                    reservationType: page3Data.reservationType,
                    name: page3Data.name,
                })
            )
        }
    }

    return (
        <>
            <Paper>
                <Stepper activeStep={activeStep}>
                    {steps.map((label) => {
                        return (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        )
                    })}
                </Stepper>
            </Paper>
            <div className={classes.root}>{getPageContents()}</div>
        </>
    )
}

export default ReservationWizard
