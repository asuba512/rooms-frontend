import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import useTheme from '@material-ui/core/styles/useTheme'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import CloseIcon from '@material-ui/icons/Close'
import TitleIcon from '@material-ui/icons/Title'
import GradeIcon from '@material-ui/icons/Grade'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import AddIcon from '@material-ui/icons/Add'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'

import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'

import Slide from '@material-ui/core/Slide'
import Zoom from '@material-ui/core/Zoom'
import { TransitionProps } from '@material-ui/core/transitions'

import { ICourseDetail } from '../../redux/courses/type'
import { editCourse, editTeachers } from '../../redux/courses/coursesThunks'
import TableComponent from '../TableComponent/TableComponent'
import Chip from '@material-ui/core/Chip'
import { RootState } from '../../redux/type'
import { getUsers } from '../../redux/users/usersThunks'
import { formatFullName } from '../../redux/users/utils'

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
        gridColumnFill: {
            marginTop: theme.spacing(2),
            width: `calc(100% - 2*${theme.spacing(2)}px)`,
            [theme.breakpoints.down('sm')]: {
                width: '100vw',
                flexGrow: 1,
            },
        },
        container: {
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

interface IUserAutocomplete {
    value: number
    name: string
    username: string
}

interface CourseDetailProps {
    course?: ICourseDetail
    isAdmin: boolean
    handleClose: () => void
}

function CourseDetail({ course, isAdmin, handleClose }: CourseDetailProps) {
    const classes = useStyles()
    const useFullScreen = useMediaQuery(useTheme().breakpoints.down('sm'))

    const [isEdit, setIsEdit] = useState(false)
    const [abbreviation, setAbbreviation] = useState(course?.abbreviation)
    const [abbreviationInvalid, setAbbreviationInvalid] = useState(false)
    const [name, setName] = useState(course?.name)
    const [nameInvalid, setNameInvalid] = useState(false)
    const [credits, setCredits] = useState(course?.credits)
    const [creditsInvalid, setCreditsInvalid] = useState(false)
    const [newTeachers, setNewTeachers] = useState([] as number[])

    const allTeachers: IUserAutocomplete[] =
        useSelector((state: RootState) => state.usersAPI.users)?.map(
            (user) => ({
                value: user.id,
                name: formatFullName(user),
                username: user.username,
            })
        ) || []

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getUsers())
    }, [dispatch])

    const teacherTableCells = {
        name: { title: 'Name' },
        username: { title: 'Login' },
    }

    const teachers =
        course?.teachers.map((teacher) => {
            const t = allTeachers?.find((t) => t.value === teacher.id)
            return {
                id: teacher.id,
                name: t?.name,
                username: t?.username,
            }
        }) || []

    const setAllValid = () => {
        setAbbreviationInvalid(false)
        setNameInvalid(false)
        setCreditsInvalid(false)
    }

    const setToOriginalValue = useCallback(() => {
        setAbbreviation(course?.abbreviation)
        setName(course?.name)
        setCredits(course?.credits)
    }, [course])

    const handleSaveChanges = () => {
        if (!course) {
            return
        }
        if (!abbreviation || !name || !credits) {
            setAllValid()
            if (!abbreviation) {
                setAbbreviationInvalid(true)
            }
            if (!name) {
                setNameInvalid(true)
            }
            if (!credits || credits < 0) {
                setCreditsInvalid(true)
            }
            return
        }
        setAllValid()

        dispatch(editCourse({ id: course.id, abbreviation, name, credits }))
        if (newTeachers) {
            dispatch(
                editTeachers({
                    courseId: course.id,
                    ids: Array.from(
                        new Set([
                            ...teachers.map((teacher) => teacher.id),
                            ...newTeachers,
                        ])
                    ),
                })
            )
        }

        setIsEdit(false)
        return
    }

    const deleteTeacherHandler = (id: number) => {
        if (course) {
            const idsToSave = course.teachers
                .filter((teacher) => teacher.id !== id)
                .map((teacher) => teacher.id)
            dispatch(editTeachers({ courseId: course.id, ids: idsToSave }))
        }
    }

    const deleteTeacherBulkHandler = (ids: number[]) => {
        if (course) {
            const idsToSave = course.teachers
                .filter((teacher) => !ids.includes(teacher.id))
                .map((teacher) => teacher.id)
            dispatch(editTeachers({ courseId: course.id, ids: idsToSave }))
        }
    }

    const handleCancel = useCallback(() => {
        setToOriginalValue()
        setAllValid()
        setIsEdit(false)
    }, [setToOriginalValue])

    useEffect(() => {
        setToOriginalValue()
        return handleCancel
    }, [setToOriginalValue, handleCancel, course])

    return (
        <div>
            <Dialog
                PaperProps={{ className: classes.root }}
                maxWidth="md"
                fullWidth
                fullScreen={useFullScreen}
                scroll="paper"
                open={course !== undefined}
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
                        <Grid item className={classes.gridColumnFill}>
                            <div className={classes.container}>
                                <Toolbar disableGutters variant="dense">
                                    {isEdit ? (
                                        <TextField
                                            fullWidth
                                            error={abbreviationInvalid}
                                            label="Abbreviation"
                                            size="medium"
                                            value={abbreviation}
                                            onChange={(e) =>
                                                setAbbreviation(e.target.value)
                                            }
                                        />
                                    ) : (
                                        <Typography
                                            variant="h6"
                                            style={{ padding: '8px 0' }}
                                        >
                                            Course {course?.abbreviation}
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
                                                onClick={() => setIsEdit(true)}
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
                                                <TitleIcon />
                                            </Avatar>
                                        </ListItemAvatar>
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
                                                style={{
                                                    margin: '4px 0',
                                                }}
                                            />
                                        ) : (
                                            <ListItemText
                                                primary={course?.name}
                                                secondary="Name"
                                            />
                                        )}
                                    </ListItem>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <GradeIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        {isEdit ? (
                                            <TextField
                                                fullWidth
                                                type="number"
                                                error={creditsInvalid}
                                                label="Credits"
                                                size="medium"
                                                value={credits}
                                                onChange={(e) =>
                                                    setCredits(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                style={{ margin: '4px 0' }}
                                            />
                                        ) : (
                                            <ListItemText
                                                primary={course?.credits}
                                                secondary="Credits"
                                            />
                                        )}
                                    </ListItem>
                                    {isEdit && (
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <AddIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <Autocomplete
                                                multiple
                                                options={allTeachers}
                                                getOptionLabel={(
                                                    option: IUserAutocomplete
                                                ) => option.name}
                                                getOptionSelected={(
                                                    option,
                                                    value
                                                ) =>
                                                    option.value === value.value
                                                }
                                                renderTags={(
                                                    value: IUserAutocomplete[],
                                                    getTagProps: any
                                                ) =>
                                                    value.map(
                                                        (option, index) => (
                                                            <Chip
                                                                label={
                                                                    option.name
                                                                }
                                                                {...getTagProps(
                                                                    {
                                                                        index,
                                                                    }
                                                                )}
                                                            />
                                                        )
                                                    )
                                                }
                                                style={{ width: '100%' }}
                                                renderInput={(params: any) => (
                                                    <TextField
                                                        {...params}
                                                        label="Add Teachers"
                                                        placeholder="Start typing name..."
                                                        style={{
                                                            margin: '4px 0',
                                                        }}
                                                        size="medium"
                                                    />
                                                )}
                                                onChange={(e, v) =>
                                                    setNewTeachers(
                                                        v.map((v) => v.value)
                                                    )
                                                }
                                            />
                                        </ListItem>
                                    )}
                                </List>
                                <TableComponent
                                    title="Teachers"
                                    rowData={teachers}
                                    cells={teacherTableCells}
                                    defaultSort="username"
                                    onDelete={
                                        isAdmin
                                            ? deleteTeacherHandler
                                            : undefined
                                    }
                                    onDeleteBulk={
                                        isAdmin
                                            ? deleteTeacherBulkHandler
                                            : undefined
                                    }
                                />
                            </div>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CourseDetail
