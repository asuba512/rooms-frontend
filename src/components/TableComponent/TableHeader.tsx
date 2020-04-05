import React from 'react'

import { ClassNameMap } from '@material-ui/core/styles/withStyles'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Checkbox from '@material-ui/core/Checkbox'
import TableSortLabel from '@material-ui/core/TableSortLabel'

import { Order } from '../../utils/sorting'

interface EnhancedTableProps {
    classes: ClassNameMap
    cells: { [key: string]: { title: string; isNumeric: boolean } }
    selectionAllowed: boolean
    numSelected: number
    onSelectAllClick: (
        event: React.ChangeEvent<HTMLInputElement>,
        checked: boolean
    ) => void
    onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void
    order: Order
    orderBy: string
    rowCount: number
    additionalColspan: number
}

function TableHeader({
    classes,
    cells,
    selectionAllowed,
    numSelected,
    onSelectAllClick,
    order,
    orderBy,
    rowCount,
    onRequestSort,
    additionalColspan,
}: EnhancedTableProps) {
    const createSortHandler = (property: string) => (
        event: React.MouseEvent<unknown>
    ) => {
        onRequestSort(event, property)
    }

    const headers = Object.entries(cells).map(([id, { title, isNumeric }]) => {
        return {
            id,
            isNumeric,
            label: title,
        }
    })

    return (
        <TableHead>
            <TableRow>
                {selectionAllowed && (
                    <TableCell
                        padding="checkbox"
                        size="small"
                        style={{ paddingLeft: 13 }}
                    >
                        <Checkbox
                            indeterminate={
                                numSelected > 0 && numSelected < rowCount
                            }
                            checked={rowCount > 0 && numSelected === rowCount}
                            onChange={onSelectAllClick}
                            inputProps={{ 'aria-label': 'select all desserts' }}
                        />
                    </TableCell>
                )}
                {headers.map((header) => (
                    <TableCell
                        key={header.id}
                        align={header.isNumeric ? 'right' : 'left'}
                        size="small"
                        sortDirection={orderBy === header.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === header.id}
                            direction={orderBy === header.id ? order : 'asc'}
                            onClick={createSortHandler(header.id)}
                        >
                            {header.label}
                            {orderBy === header.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc'
                                        ? 'sorted descending'
                                        : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                {additionalColspan ? (
                    <TableCell colSpan={additionalColspan} />
                ) : null}
            </TableRow>
        </TableHead>
    )
}

export default TableHeader
