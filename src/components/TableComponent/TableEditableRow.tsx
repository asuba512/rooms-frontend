import React, { useState } from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell/TableCell'
import TextField from '@material-ui/core/TextField/TextField'
import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import Check from '@material-ui/icons/Check'
import Tooltip from '@material-ui/core/Tooltip'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography/Typography'
import { ICells, IRow } from './type'
import { Checkbox } from '@material-ui/core'

interface TableAddNewRowProps {
    cells: ICells
    data?: IRow
    skipCheckbox?: boolean
    onSave: (data: any) => void
    onCancel: () => void
}

function TableEditableRow({
    cells,
    data,
    skipCheckbox,
    onSave,
    onCancel,
}: TableAddNewRowProps) {
    const [inputStates, setInputStates] = useState(
        Object.assign(
            {},
            ...Object.keys(cells).map((key) => ({
                [key]: data ? data[key] : ('' as number | string | boolean),
            }))
        )
    )
    const [inputStatesInvalidity, setInputStatesInvalidity] = useState(
        Object.assign(
            {},
            ...Object.keys(cells)
                .filter((key) => !cells[key].isOptional)
                .map((key) => ({ [key]: false }))
        )
    )

    const handleInputChange = (
        key: string,
        value: string | number | boolean
    ) => {
        if (cells[key].isNumeric) {
            setInputStates({ ...inputStates, [key]: Number(value) })
        } else {
            setInputStates({ ...inputStates, [key]: value })
        }
    }

    const handleSave = () => {
        if (
            Object.keys(inputStatesInvalidity).some(
                (key) => inputStates[key] === ''
            )
        ) {
            let invalidity: { [key: string]: boolean } = {}
            Object.entries(inputStatesInvalidity).forEach(([key]) => {
                invalidity[key] = inputStates[key] === ''
            })
            setInputStatesInvalidity(invalidity)
            return
        }
        onSave(inputStates)
    }

    return (
        <TableRow>
            {!skipCheckbox && <TableCell />}
            {Object.entries(cells).map(([key, value]) => {
                return (
                    <TableCell key={key}>
                        {value.allowedValues ? (
                            <TextField
                                select
                                error={inputStatesInvalidity[key]}
                                value={inputStates[key]}
                                required={!value.isOptional}
                                onChange={(e) =>
                                    handleInputChange(key, e.target.value)
                                }
                                size="small"
                                label={
                                    <Typography
                                        variant="inherit"
                                        color={
                                            inputStatesInvalidity[key]
                                                ? 'error'
                                                : 'textSecondary'
                                        }
                                    >
                                        {value.title}
                                    </Typography>
                                }
                                fullWidth
                            >
                                {Object.entries(value.allowedValues).map(
                                    ([key, title]) => {
                                        return (
                                            <MenuItem key={key} value={key}>
                                                {title}
                                            </MenuItem>
                                        )
                                    }
                                )}
                            </TextField>
                        ) : value.isBoolean ? (
                            <Checkbox
                                checked={inputStates[key]}
                                onChange={(e) =>
                                    handleInputChange(key, e.target.checked)
                                }
                            />
                        ) : (
                            <TextField
                                error={inputStatesInvalidity[key]}
                                value={inputStates[key]}
                                required={!value.isOptional}
                                onChange={(e) =>
                                    handleInputChange(key, e.target.value)
                                }
                                size="small"
                                fullWidth
                                label={value.title}
                                type={value.isNumeric ? 'number' : 'string'}
                            />
                        )}
                    </TableCell>
                )
            })}
            <TableCell padding="checkbox">
                <Tooltip arrow title="Cancel">
                    <IconButton onClick={onCancel}>
                        <Close />
                    </IconButton>
                </Tooltip>
            </TableCell>
            <TableCell padding="checkbox">
                <Tooltip title="Confirm">
                    <IconButton onClick={handleSave}>
                        <Check />
                    </IconButton>
                </Tooltip>
            </TableCell>
        </TableRow>
    )
}

export default TableEditableRow
