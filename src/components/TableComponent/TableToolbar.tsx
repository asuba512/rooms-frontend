import React from 'react'
import clsx from 'clsx'

import {
    createStyles,
    lighten,
    makeStyles,
    Theme,
} from '@material-ui/core/styles'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import TextField from '@material-ui/core/TextField'
import Clear from '@material-ui/icons/Clear'
import Search from '@material-ui/icons/Search'
import AddIcon from '@material-ui/icons/Add'

import DeleteButton from './DeleteButton'
import { Button } from '@material-ui/core'
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            [theme.breakpoints.down('xs')]: {
                paddingLeft: theme.spacing(1),
                paddingRight: theme.spacing(1),
            },
        },
        highlight: {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        },
        selected: {
            flex: '1 1 100%',
        },
        title: {
            flex: '1 1 100%',
            [theme.breakpoints.down('xs')]: {
                display: 'none',
            },
        },
        divider: {
            marginRight: theme.spacing(1),
            marginLeft: theme.spacing(1),
        },
    })
)

interface EnhancedTableToolbarProps {
    numSelected: number
    title: string
    filter: string
    filterChanged: (filter: string) => void
    canAddNewItem?: boolean
    onAddNew?: (data: any) => void
    onDeleteBulk?: () => void
}

const TableToolbar = ({
    numSelected,
    title,
    filter,
    filterChanged,
    canAddNewItem,
    onAddNew,
    onDeleteBulk,
}: EnhancedTableToolbarProps) => {
    const classes = useStyles()

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography
                    className={classes.selected}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <>
                    <Typography
                        className={classes.title}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        {title}
                    </Typography>
                    <Divider
                        className={classes.divider}
                        orientation="vertical"
                    />
                </>
            )}
            {numSelected > 0 && onDeleteBulk ? (
                <Tooltip title="Delete all selected" arrow>
                    <span>
                        <DeleteButton onClick={onDeleteBulk} />
                    </span>
                </Tooltip>
            ) : (
                <>
                    <Tooltip arrow title="Search">
                        <TextField
                            placeholder="Search"
                            fullWidth={true}
                            value={filter}
                            onChange={(e) => filterChanged(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <IconButton
                                        size="small"
                                        onClick={() => filterChanged('')}
                                        disabled={!filter}
                                        style={{
                                            transition: 'opacity 0.2s 0s',
                                            opacity: filter ? '1' : '0',
                                        }}
                                    >
                                        <Clear />
                                    </IconButton>
                                ),
                            }}
                        />
                    </Tooltip>
                    {canAddNewItem && onAddNew && (
                        <>
                            <Divider
                                className={classes.divider}
                                orientation="vertical"
                            />
                            <Tooltip arrow title="Add New">
                                <Button
                                    size="large"
                                    startIcon={<AddIcon />}
                                    onClick={onAddNew}
                                >
                                    Add
                                </Button>
                            </Tooltip>
                        </>
                    )}
                </>
            )}
        </Toolbar>
    )
}

export default TableToolbar
