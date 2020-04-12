import React, { ChangeEvent, useEffect, useState } from 'react'
import { Button } from '@material-ui/core'
import { IPage3Data } from './ReservationWizard'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import wizardStyles from './wizardStyles'
import MenuItem from '@material-ui/core/MenuItem'
import { reservationTypesAsObject } from '../../redux/reservation/utils'
import { useDispatch, useSelector } from 'react-redux'
import { getCourses } from '../../redux/courses/coursesThunks'
import { RootState } from '../../redux/type'
import { Autocomplete } from '@material-ui/lab'
import { ICourse } from '../../redux/courses/type'
import Typography from '@material-ui/core/Typography'
import { getUserById } from '../../redux/users/usersThunks'

interface Page3Props {
    savePage: (data: IPage3Data) => void
    goBack: () => void
    data?: IPage3Data
}

function Page3({ savePage, goBack, data }: Page3Props) {
    const classes = wizardStyles()

    const [name, setName] = useState(data?.name || '')
    const [nameInvalid, setNameInvalid] = useState(false)
    const [reservationType, setReservationType] = useState(
        data?.reservationType || 0
    )
    const [courseId, setCourseId] = useState(
        data?.courseId || (undefined as number | undefined)
    )
    const [courseIdInvalid, setCourseIdInvalid] = useState(false)

    const [isAdmin, id] = useSelector((state: RootState) => [
        state.auth?.role === 'admin',
        state.auth?.id,
    ])
    const coursesUser =
        useSelector((state: RootState) => state.usersAPI.user?.courses) || []
    const coursesAdmin =
        useSelector((state: RootState) => state.coursesAPI.courses) || []
    const courses = isAdmin ? coursesAdmin : coursesUser

    const dispatch = useDispatch()

    useEffect(() => {
        if (isAdmin) {
            dispatch(getCourses())
        } else if (id) {
            dispatch(getUserById({ id }))
        }
    }, [dispatch, isAdmin, id])

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault()
        setNameInvalid(false)
        setCourseIdInvalid(false)
        if (!name || !courseId) {
            if (!name) {
                setNameInvalid(true)
            }
            if (!courseId) {
                setCourseIdInvalid(true)
            }
            return
        }
        savePage({
            name,
            reservationType,
            courseId,
        })
    }

    return (
        <Grid container className={classes.gridColumn}>
            <form onSubmit={submitHandler} className={classes.form}>
                <Paper className={classes.content}>
                    <Grid item className={classes.gridRow}>
                        <Grid container className={classes.gridColumn}>
                            <Typography variant="h6">Other Details</Typography>
                            <TextField
                                error={nameInvalid}
                                variant="outlined"
                                className={classes.formElement}
                                label="Event Name*"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <TextField
                                select
                                required
                                variant="outlined"
                                className={classes.formElement}
                                label="Type of Event"
                                value={reservationType}
                                onChange={(e) =>
                                    setReservationType(Number(e.target.value))
                                }
                            >
                                {Object.entries(reservationTypesAsObject).map(
                                    ([value, label]) => (
                                        <MenuItem key={value} value={value}>
                                            {label}
                                        </MenuItem>
                                    )
                                )}
                            </TextField>
                            <Autocomplete
                                options={courses}
                                getOptionLabel={(option) => option.abbreviation}
                                className={classes.formElement}
                                getOptionSelected={(option, value) =>
                                    option.id === value.id
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        error={courseIdInvalid}
                                        label="Course*"
                                        variant="outlined"
                                    />
                                )}
                                onChange={(
                                    e: ChangeEvent<{}>,
                                    v: ICourse | null
                                ) => {
                                    setCourseId(v?.id)
                                }}
                            />
                        </Grid>
                    </Grid>
                </Paper>
                <Grid item className={classes.gridRow}>
                    <div className={classes.content}>
                        <Button variant="contained" onClick={goBack}>
                            Previous Page
                        </Button>
                        <div className={classes.spacer} />
                        <Button type="submit" variant="contained">
                            Create
                        </Button>
                    </div>
                </Grid>
            </form>
        </Grid>
    )
}

export default Page3
