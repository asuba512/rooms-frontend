import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'

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
import EditIcon from '@material-ui/icons/Edit'

import { getComparator, Order, stableSort } from '../../utils/sorting'
import DeleteButton from '../DeleteButton'
import TableToolbar from './TableToolbar'
import TableHeader from './TableHeader'
import { Typography } from '@material-ui/core'
import TableEditableRow from './TableEditableRow'
import { toast } from 'react-toastify'
import { ICell, ICells, IRow } from './type'
import { Moment } from 'moment'

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100]

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        paper: {
            width: '100%',
            // marginBottom: theme.spacing(2),
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
    uniqueKeys?: string[]
    onAddNew?: (data: any) => void
    onEdit?: (data: any) => void
    onViewDetail?: (id: number) => void
    onDelete?: (id: number) => void
    onDeleteBulk?: (ids: number[]) => void
    canBeDeleted?: (row: IRow) => boolean
    allowSelection?: boolean
    selectedOutput?: number[]
    setSelectedOutput?: (ids: number[]) => void
}

function TableComponent({
    title,
    rowData,
    cells,
    defaultSort,
    uniqueKeys,
    onAddNew,
    onEdit,
    onViewDetail,
    onDelete,
    onDeleteBulk,
    canBeDeleted,
    allowSelection,
    selectedOutput,
    setSelectedOutput,
}: TableComponentProps) {
    const classes = useStyles()
    const [selected, setSelected] = useState<number[]>(selectedOutput || [])
    const [deleted, setDeleted] = useState<number[]>([])
    const [order, setOrder] = useState<Order>('asc')
    const [orderBy, setOrderBy] = useState<string>(defaultSort)
    const [filter, setFilter] = useState<string>('')
    const [filteredData, setFilteredData] = useState<IRow[]>(rowData)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const [addNewItem, setAddNewItem] = useState(false)
    const [editingItem, setEditingItem] = useState(-1)

    const additionalColspan =
        (onViewDetail ? 1 : 0) + (onDelete ? 1 : 0) + (onEdit ? 1 : 0)

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
            const newSelected = filteredData
                .filter((row) => (canBeDeleted ? canBeDeleted(row) : true))
                .map((n) => n.id)
            setSelected(newSelected)
            if (setSelectedOutput) {
                setSelectedOutput(newSelected)
            }
            return
        }
        setSelected([])
        if (setSelectedOutput) {
            setSelectedOutput([])
        }
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
        if (setSelectedOutput) {
            setSelectedOutput(newSelected)
        }
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
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

    const getRowEntries = (row: { [key: string]: any }, cells: ICells) => {
        const entries: [
            string,
            number | string | boolean | Moment,
            ICell
        ][] = []
        Object.entries(cells).forEach(([key, value]) => {
            entries.push([key, row[key], value])
        })
        return entries
    }

    const startAddNewItemHandler = () => {
        setAddNewItem(true)
    }

    const saveAddNewItemHandler = (data: any) => {
        if (onAddNew && uniqueKeys) {
            if (
                rowData.some((row: IRow) =>
                    uniqueKeys.some(
                        (uniqueKey) => row[uniqueKey] === data[uniqueKey]
                    )
                )
            ) {
                toast.error(
                    `There is already an item with the same values of some of these unique fields: ${uniqueKeys
                        .map((key) => cells[key].title)
                        .join(', ')}`
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

    const startEditItemHandler = (id: number) => {
        setEditingItem(id)
    }

    const saveEditItemHandler = (data: any) => {
        if (onEdit && uniqueKeys) {
            if (
                rowData.some(
                    (row: IRow) =>
                        uniqueKeys.some(
                            (uniqueKey) => row[uniqueKey] === data[uniqueKey]
                        ) && row.id !== editingItem
                )
            ) {
                toast.error(
                    `There is already an item with the same values of some of these unique fields: ${uniqueKeys
                        .map((key) => cells[key].title)
                        .join(', ')}`
                )
                return
            }
            toast.dismiss()
            onEdit({ ...data, id: editingItem })
            setEditingItem(-1)
        }
    }

    const cancelEditItemHandler = () => {
        toast.dismiss()
        setEditingItem(-1)
    }

    const isSelected = (id: number) => selected.indexOf(id) !== -1
    const isDeleted = (id: number) => deleted.indexOf(id) !== -1

    useEffect(() => {
        handleChangeFilter(filter)
    }, [rowData, filter, handleChangeFilter])

    useEffect(() => {
        setSelected(selectedOutput || [])
    }, [rowData, selectedOutput])

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
                    onDeleteBulk={onDeleteBulk && handleDeleteBulk}
                />
                <TableContainer style={{ maxHeight: '74vh' }}>
                    <Table
                        className={classes.table}
                        size="medium"
                        aria-label={title}
                        stickyHeader
                    >
                        <TableHeader
                            classes={classes}
                            cells={cells}
                            selectionAllowed={
                                allowSelection || onDeleteBulk !== undefined
                            }
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
                                <TableEditableRow
                                    cells={cells}
                                    skipCheckbox={onDeleteBulk === undefined}
                                    onSave={saveAddNewItemHandler}
                                    onCancel={cancelAddNewItemHandler}
                                />
                            )}
                            {filteredData.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        align="center"
                                        colSpan={
                                            Object.keys(cells).length +
                                            additionalColspan
                                        }
                                    >
                                        <Typography color="textSecondary">
                                            No data
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                (stableSort(
                                    filteredData,
                                    getComparator(order, orderBy)
                                ) as IRow[])
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map((row: IRow, index) => {
                                        const isItemSelected = isSelected(
                                            row.id as number
                                        )
                                        const labelId = `table-checkbox-${index}`
                                        const isDeleteDisabled =
                                            canBeDeleted && !canBeDeleted(row)
                                        return onEdit &&
                                            editingItem === row.id ? (
                                            <TableEditableRow
                                                key={row.id}
                                                cells={cells}
                                                skipCheckbox={
                                                    onDeleteBulk === undefined
                                                }
                                                data={row}
                                                onCancel={cancelEditItemHandler}
                                                onSave={saveEditItemHandler}
                                            />
                                        ) : (
                                            <TableRow
                                                className={`${
                                                    isDeleted(row.id)
                                                        ? 'deleted'
                                                        : ''
                                                } ${
                                                    addNewItem ||
                                                    editingItem > 0
                                                        ? 'rowInactive'
                                                        : ''
                                                }`}
                                                hover
                                                tabIndex={-1}
                                                key={row.id}
                                                selected={isItemSelected}
                                            >
                                                {(onDeleteBulk ||
                                                    allowSelection) && (
                                                    <TableCell padding="checkbox">
                                                        <div>
                                                            <Tooltip
                                                                arrow
                                                                title={
                                                                    isDeleteDisabled
                                                                        ? 'Selecting this item for deletion is not allowed'
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
                                                                                row.id
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

                                                {getRowEntries(row, cells).map(
                                                    ([key, value, cell]) => {
                                                        return (
                                                            <TableCell
                                                                className={
                                                                    classes.cell
                                                                }
                                                                key={`${key}-${row.id}`}
                                                                padding={
                                                                    cell.isBoolean
                                                                        ? 'checkbox'
                                                                        : 'default'
                                                                }
                                                                align={
                                                                    cell.isNumeric
                                                                        ? 'right'
                                                                        : 'left'
                                                                }
                                                            >
                                                                <div>
                                                                    {(cell?.allowedValues ||
                                                                        {})[
                                                                        value as
                                                                            | string
                                                                            | number
                                                                    ] ||
                                                                        (cell?.isBoolean && (
                                                                            <Checkbox
                                                                                checked={
                                                                                    value as boolean
                                                                                }
                                                                                disabled
                                                                            />
                                                                        )) ||
                                                                        (cell?.isDate &&
                                                                            (value as Moment).format(
                                                                                'LLL'
                                                                            )) ||
                                                                        value}
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
                                                                            row.id
                                                                        )
                                                                    }
                                                                >
                                                                    <Pageview />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </div>
                                                    </TableCell>
                                                )}
                                                {onEdit && (
                                                    <TableCell padding="checkbox">
                                                        <div>
                                                            <Tooltip
                                                                arrow
                                                                title="Edit item"
                                                            >
                                                                <div>
                                                                    <IconButton
                                                                        onClick={() =>
                                                                            startEditItemHandler(
                                                                                row.id
                                                                            )
                                                                        }
                                                                    >
                                                                        <EditIcon />
                                                                    </IconButton>
                                                                </div>
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
                                                                        ? 'Deleting this item is not allowed'
                                                                        : 'Delete'
                                                                }
                                                            >
                                                                <div>
                                                                    <DeleteButton
                                                                        onClick={() => {
                                                                            handleDelete(
                                                                                row.id
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
