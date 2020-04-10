import React, { useCallback, useEffect } from 'react'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Pageview from '@material-ui/icons/Pageview'

import { getComparator, Order, stableSort } from '../../utils/sorting'
import { titleToIdentifier } from '../../utils/titleToIdentifier'
import DeleteButton from '../DeleteButton'
import TableToolbar from './TableToolbar'
import TableHeader from './TableHeader'
import { Typography } from '@material-ui/core'
import TableAddNewRow from './TableAddNewRow'
import { toast } from 'react-toastify'
import { ICells, IRow } from './type'

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100]

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        paper: {
            width: '100%',
            marginBottom: theme.spacing(2),
        },
        table: {
            minWidth: 300,
        },
        row: {
            animation: '1s ease-out 0s FadeIn',
        },
        cell: {
            minWidth: 10,
            maxWidth: 150,
        },
        visuallyHidden: {
            border: 0,
            clip: 'rect(0 0 0 0)',
            height: 1,
            margin: -1,
            overflow: 'hidden',
            padding: 0,
            position: 'absolute',
            top: 20,
            width: 1,
        },
    })
)

interface TableComponentProps {
    title: string
    rowData: IRow[]
    cells: ICells
    defaultSort: string
    uniqueKey?: string
    onAddNew?: (data: any) => void
    onViewDetail?: (id: number) => void
    onDelete?: (id: number) => void
    onDeleteBulk?: (ids: number[]) => void
    canBeDeleted?: (id: number) => boolean
}

function TableComponent({
    title,
    rowData,
    cells,
    defaultSort,
    uniqueKey,
    onAddNew,
    onViewDetail,
    onDelete,
    onDeleteBulk,
    canBeDeleted,
}: TableComponentProps) {
    const classes = useStyles()
    const [selected, setSelected] = React.useState<number[]>([])
    const [deleted, setDeleted] = React.useState<number[]>([])
    const [order, setOrder] = React.useState<Order>('asc')
    const [orderBy, setOrderBy] = React.useState<string>(defaultSort)
    const [filter, setFilter] = React.useState<string>('')
    const [filteredData, setFilteredData] = React.useState<IRow[]>(rowData)
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(10)

    const [addNewItem, setAddNewItem] = React.useState(false)

    const keys = Object.keys(cells)
    const additionalColspan = (onViewDetail ? 1 : 0) + (onDelete ? 1 : 0)

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: string
    ) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleSelectAllClick = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.checked) {
            const newSelected = filteredData.map((n) => n.id)
            setSelected(newSelected)
            return
        }
        setSelected([])
    }

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id)
        let newSelected: number[] = []
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id)
        } else {
            newSelected = selected.filter((selectedId) => id !== selectedId)
        }
        setSelected(newSelected)
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleDelete = (id: number) => {
        if (onDelete) {
            setDeleted([id])
            onDelete(id)
        }
    }

    const handleDeleteBulk = () => {
        if (onDeleteBulk) {
            setDeleted(selected)
            onDeleteBulk(selected)
        }
    }

    const handleChangeFilter = useCallback(
        (filter_: string) => {
            setFilter(filter_)
            setPage(0)
            if (filter.length === 0) {
                setFilteredData(rowData)
            } else {
                setFilteredData(
                    rowData.filter((row) => {
                        const splitFilter = filter_.split(':')
                        const keyToCompare =
                            splitFilter.length > 1 ? splitFilter[0] : null
                        const valueToCompare =
                            splitFilter.length > 1
                                ? splitFilter[1].toLowerCase().trim()
                                : splitFilter[0].toLowerCase().trim()
                        return Object.entries(row)
                            .map(([key, value]) => {
                                if (keyToCompare) {
                                    if (key === keyToCompare) {
                                        if (typeof value == 'number') {
                                            return (
                                                value.toString() ===
                                                valueToCompare
                                            )
                                        } else if (typeof value == 'string') {
                                            return value
                                                ?.toLowerCase()
                                                .includes(valueToCompare)
                                        } else {
                                            return false
                                        }
                                    }
                                    return false
                                } else {
                                    if (typeof value == 'number') {
                                        return (
                                            value.toString() === valueToCompare
                                        )
                                    } else if (typeof value == 'string') {
                                        return value
                                            ?.toLowerCase()
                                            .includes(valueToCompare)
                                    } else {
                                        return false
                                    }
                                }
                            })
                            .some((value) => value)
                    })
                )
            }
        },
        [rowData, filter]
    )

    const getRowEntries = (row: { [key: string]: any }, keys: string[]) => {
        const entries: [string, any][] = []
        for (let key of keys) {
            entries.push([key, row[key]])
        }
        return entries
    }

    const startAddNewItemHandler = () => {
        setAddNewItem(true)
    }

    const saveAddNewItemHandler = (data: any) => {
        if (onAddNew && uniqueKey) {
            if (
                rowData.some((row: IRow) => row[uniqueKey] === data[uniqueKey])
            ) {
                console.log('test')
                toast.error(
                    `There is already an item with field ${cells[uniqueKey].title} set to ${data[uniqueKey]}`
                )
                return
            }
            toast.dismiss()
            onAddNew(data)
            setAddNewItem(false)
        }
    }

    const cancelAddNewItemHandler = () => {
        toast.dismiss()
        setAddNewItem(false)
    }

    const isSelected = (id: number) => selected.indexOf(id) !== -1
    const isDeleted = (id: number) => deleted.indexOf(id) !== -1

    useEffect(() => {
        setSelected([])
        handleChangeFilter(filter)
    }, [rowData, filter, handleChangeFilter])

    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <TableToolbar
                    title={title}
                    numSelected={selected.length}
                    filter={filter}
                    filterChanged={handleChangeFilter}
                    canAddNewItem={onAddNew !== undefined}
                    onAddNew={startAddNewItemHandler}
                    onDeleteBulk={handleDeleteBulk}
                />
                <TableContainer style={{ maxHeight: '74vh' }}>
                    <Table
                        className={classes.table}
                        aria-labelledby={titleToIdentifier(title)}
                        size="medium"
                        aria-label={title}
                        stickyHeader
                    >
                        <TableHeader
                            classes={classes}
                            cells={cells}
                            selectionAllowed={onDeleteBulk !== undefined}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rowData.length}
                            additionalColspan={additionalColspan}
                        />
                        <TableBody>
                            {addNewItem && onAddNew && (
                                <TableAddNewRow
                                    cells={cells}
                                    onSave={saveAddNewItemHandler}
                                    onCancel={cancelAddNewItemHandler}
                                />
                            )}
                            {filteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        align="center"
                                        colSpan={
                                            keys.length + additionalColspan
                                        }
                                    >
                                        <Typography color="textSecondary">
                                            No data
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                stableSort(
                                    filteredData,
                                    getComparator(order, orderBy)
                                )
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(
                                            row.id as number
                                        )
                                        const labelId = `table-checkbox-${index}`
                                        const isDeleteDisabled =
                                            canBeDeleted &&
                                            !canBeDeleted(row.id as number)
                                        return (
                                            <TableRow
                                                className={`${
                                                    isDeleted(row.id as number)
                                                        ? 'deleted'
                                                        : ''
                                                } ${
                                                    addNewItem
                                                        ? 'rowInactive'
                                                        : ''
                                                }`}
                                                hover
                                                tabIndex={-1}
                                                key={row.id}
                                                selected={isItemSelected}
                                            >
                                                {onDeleteBulk && (
                                                    <TableCell padding="checkbox">
                                                        <div>
                                                            <Tooltip
                                                                arrow
                                                                title={
                                                                    isDeleteDisabled
                                                                        ? 'You cannot select your user account for deletion. If you really want to do this, use another admin account.'
                                                                        : 'Select'
                                                                }
                                                            >
                                                                <div>
                                                                    <Checkbox
                                                                        onClick={(
                                                                            event
                                                                        ) =>
                                                                            handleClick(
                                                                                event,
                                                                                row.id as number
                                                                            )
                                                                        }
                                                                        checked={
                                                                            isItemSelected
                                                                        }
                                                                        inputProps={{
                                                                            'aria-labelledby': labelId,
                                                                        }}
                                                                        disabled={
                                                                            isDeleteDisabled
                                                                        }
                                                                    />
                                                                </div>
                                                            </Tooltip>
                                                        </div>
                                                    </TableCell>
                                                )}

                                                {getRowEntries(row, keys).map(
                                                    ([key, value]) => {
                                                        return (
                                                            <TableCell
                                                                className={
                                                                    classes.cell
                                                                }
                                                                key={`${key}-${row.id}`}
                                                                padding="default"
                                                                align={
                                                                    typeof value ==
                                                                    'number'
                                                                        ? 'right'
                                                                        : 'left'
                                                                }
                                                            >
                                                                {' '}
                                                                <div>
                                                                    {value}
                                                                </div>
                                                            </TableCell>
                                                        )
                                                    }
                                                )}
                                                {onViewDetail && (
                                                    <TableCell padding="checkbox">
                                                        <div>
                                                            <Tooltip
                                                                arrow
                                                                title="View detail"
                                                            >
                                                                <IconButton
                                                                    onClick={() =>
                                                                        onViewDetail(
                                                                            row.id as number
                                                                        )
                                                                    }
                                                                >
                                                                    <Pageview />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </div>
                                                    </TableCell>
                                                )}
                                                {onDelete && (
                                                    <TableCell padding="checkbox">
                                                        <div>
                                                            <Tooltip
                                                                arrow
                                                                title={
                                                                    isDeleteDisabled
                                                                        ? 'You cannot delete your user account. If you really want to do this, use another admin account.'
                                                                        : 'Delete'
                                                                }
                                                            >
                                                                <div>
                                                                    <DeleteButton
                                                                        onClick={() => {
                                                                            handleDelete(
                                                                                row.id as number
                                                                            )
                                                                        }}
                                                                        disabled={
                                                                            isDeleteDisabled
                                                                        }
                                                                    />
                                                                </div>
                                                            </Tooltip>
                                                        </div>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        )
                                    })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {filteredData.length > rowsPerPage && (
                    <TablePagination
                        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                        component="div"
                        count={filteredData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                )}
            </Paper>
        </div>
    )
}

export default TableComponent
