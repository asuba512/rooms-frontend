import React, { useState } from 'react'
import DeleteIcon from '@material-ui/icons/Delete'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

interface DeleteButtonProps {
    onClick: (arg: any) => void
    disabled?: boolean
}

function DeleteButton({ onClick, disabled }: DeleteButtonProps) {
    const [clicked, setClicked] = useState(false)
    if (clicked) {
        return (
            <Tooltip title="Are you sure?" open arrow placement="top">
                <IconButton
                    onClick={onClick}
                    onMouseLeave={() => setClicked(false)}
                >
                    <DeleteIcon color="error" />
                </IconButton>
            </Tooltip>
        )
    } else {
        return (
            <IconButton onClick={() => setClicked(true)} disabled={disabled}>
                <DeleteIcon />
            </IconButton>
        )
    }
}

export default DeleteButton
