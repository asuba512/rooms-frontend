import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
        },
        appTitleBar: {
            [theme.breakpoints.down('xs')]: {
                display: 'none',
            },
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
        },
        drawerOpen: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            width: drawerWidth,
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: theme.spacing(7) + 1,
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(7) + 1,
            },
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerMarginOpened: {
            [theme.breakpoints.up('sm')]: {
                marginLeft: drawerWidth,
            },
        },
        drawerMarginClosed: {
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(7) + 1,
            },
        },
        content: {
            width: '100vw',
            padding: theme.spacing(3),
            [theme.breakpoints.down('sm')]: {
                padding: 0,
            },
        },
        // necessary for content to be below app bar
        toolbarPadding: theme.mixins.toolbar,
        grow: {
            flexGrow: 1,
        },
    })
)

export default useStyles
