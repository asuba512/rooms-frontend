import React, { useState } from 'react'
import { Button, FormControlLabel, Radio, Switch } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import wizardStyles from './wizardStyles'
import { DateTimePicker } from '@material-ui/pickers'
import { toast } from 'react-toastify'
import TextField from '@material-ui/core/TextField'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import HelpIcon from '@material-ui/icons/Help'
import Tooltip from '@material-ui/core/Tooltip'
import { IPage1Data } from './ReservationWizard'
import Paper from '@material-ui/core/Paper'
import { Moment } from 'moment'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import Typography from '@material-ui/core/Typography'

interface Page1Props {
    savePage: (data: IPage1Data) => void
    data?: IPage1Data
}

function Page1({ savePage, data }: Page1Props) {
    const classes = wizardStyles()

    const [isRepeating, setIsRepeating] = useState(data?.isRepeating || true)

    const [startDate, setStartDate] = useState(
        data?.startDate || (null as Moment | null)
    )
    const [startDateInvalid, setStartDateInvalid] = useState(false)
    const [endDate, setEndDate] = useState(
        data?.endDate || (null as Moment | null)
    )
    const [endDateInvalid, setEndDateInvalid] = useState(false)
    const [repeatsIn, setRepeatsIn] = useState(data?.repeatsIn || 1)
    const [numberOfWeeks, setNumberOfWeeks] = useState(
        data?.numberOfWeeks || 13
    )
    const [capacity, setCapacity] = useState(data ? data.capacity : 300)

    const setAllValid = () => {
        setStartDateInvalid(false)
        setEndDateInvalid(false)
    }

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault()
        setAllValid()
        if (!startDate || !endDate) {
            if (!startDate) {
                setStartDateInvalid(true)
            }
            if (!endDate) {
                setEndDateInvalid(true)
            }
            return
        } else if (endDate < startDate) {
            setStartDateInvalid(true)
            setEndDateInvalid(true)
            toast.error('Event cannot end before its start!')
            return
        }
        toast.dismiss()
        savePage({
            startDate,
            endDate,
            isRepeating,
            repeatsIn,
            numberOfWeeks,
            capacity,
        })
    }

    return (
        <Grid container className={classes.gridColumn}>
            <form onSubmit={(e) => submitHandler(e)} className={classes.form}>
                <Paper className={classes.content}>
                    <Grid item className={classes.gridRow}>
                        <Grid container className={classes.gridColumn}>
                            <Typography variant="h6">Event Time</Typography>
                            <DateTimePicker
                                required
                                error={startDateInvalid}
                                className={classes.formElement}
                                value={startDate}
                                onChange={(date: MaterialUiPickersDate) => {
                                    setStartDate(
                                        date || (null as Moment | null)
                                    )
                                    setEndDate(date || (null as Moment | null))
                                }}
                                label="Event Beginning"
                                inputVariant="outlined"
                                minutesStep={10}
                                disablePast
                                clearable
                            />
                            <DateTimePicker
                                required
                                className={classes.formElement}
                                value={endDate}
                                error={endDateInvalid}
                                onChange={(date: MaterialUiPickersDate) =>
                                    setEndDate(date || (null as Moment | null))
                                }
                                label="Event End"
                                inputVariant="outlined"
                                minutesStep={10}
                                minDate={startDate || undefined}
                                minDateMessage="Event cannot end before its start!"
                                disablePast
                                clearable
                            />
                            <Typography variant="h6">
                                Other Parameters
                            </Typography>
                            <div>
                                One-time Event
                                <Switch
                                    checked={isRepeating}
                                    onChange={() =>
                                        setIsRepeating(!isRepeating)
                                    }
                                />
                                Weekly Event
                            </div>
                            {isRepeating && (
                                <>
                                    <FormControl
                                        required
                                        component="fieldset"
                                        className={classes.formElement}
                                    >
                                        <FormLabel component="legend">
                                            Frequency
                                        </FormLabel>
                                        <RadioGroup
                                            value={repeatsIn.toString()}
                                            onChange={(e) =>
                                                setRepeatsIn(
                                                    Number(e.target.value)
                                                )
                                            }
                                        >
                                            <Grid className={classes.gridRow}>
                                                <FormControlLabel
                                                    value="1"
                                                    label="Weekly"
                                                    control={<Radio />}
                                                />
                                                <FormControlLabel
                                                    value="2"
                                                    label="Every two weeks"
                                                    control={<Radio />}
                                                />
                                            </Grid>
                                        </RadioGroup>
                                    </FormControl>
                                    <TextField
                                        required
                                        className={classes.formElement}
                                        value={numberOfWeeks}
                                        onChange={(e) =>
                                            setNumberOfWeeks(
                                                Number(e.target.value)
                                            )
                                        }
                                        type="number"
                                        label="Number of weeks"
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: (
                                                <Tooltip title="Number of weeks event should be active. Skipped weeks are included for biweekly events.">
                                                    <HelpIcon color="disabled" />
                                                </Tooltip>
                                            ),
                                            inputProps: {
                                                min: 1,
                                            },
                                        }}
                                    />
                                </>
                            )}
                            <TextField
                                required
                                className={classes.formElement}
                                value={capacity}
                                onChange={(e) =>
                                    setCapacity(Number(e.target.value))
                                }
                                label="Capacity"
                                variant="outlined"
                                type="number"
                                InputProps={{ inputProps: { min: 0 } }}
                            />
                        </Grid>
                    </Grid>
                </Paper>
                <Grid item className={classes.gridRow}>
                    <div className={classes.content}>
                        <div className={classes.spacer} />
                        <Button type="submit" variant="contained">
                            Next Page
                        </Button>
                    </div>
                </Grid>
            </form>
        </Grid>
    )
}

export default Page1
