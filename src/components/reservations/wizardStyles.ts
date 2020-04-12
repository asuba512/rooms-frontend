import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

const wizardStyles = makeStyles((theme: Theme) =>
    createStyles({
        gridColumn: {
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
        },
        gridRow: {
            width: '100%',
            display: 'flex',
        },
        spacer: {
            flexGrow: 1,
        },
        margin: {
            margin: theme.spacing(2),
        },
        root: {
            marginTop: theme.spacing(1),
        },
        content: {
            display: 'flex',
            width: '100%',
            padding: theme.spacing(2),
        },
        form: {
            width: '100%',
        },
        formElement: {
            minWidth: '30vw',
            margin: theme.spacing(1),
        },
    })
)

export default wizardStyles
