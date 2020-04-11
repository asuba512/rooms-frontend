import React from 'react'
import clsx from 'clsx'
import { Drawer, Hidden, List } from '@material-ui/core'
import DashboardIcon from '@material-ui/icons/Dashboard'
import CreateIcon from '@material-ui/icons/Create'
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom'
import SchoolIcon from '@material-ui/icons/School'
import GroupIcon from '@material-ui/icons/Group'
import ListItemRouterLink from './ListItemRouterLink'
import mainLayoutStyles from '../utils/mainLayoutStyles'

interface SideMenuProps {
    menuOpen: boolean
    setMenuOpen: (state: boolean) => void
}

function SideMenu({ menuOpen, setMenuOpen }: SideMenuProps) {
    const classes = mainLayoutStyles()

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen)
    }

    const menuContent = (
        <>
            <div className={classes.toolbarPadding} />
            <List>
                <ListItemRouterLink
                    text="Dashboard"
                    to="/home"
                    icon={<DashboardIcon />}
                />
                <ListItemRouterLink
                    text="Reserve a Room"
                    to="/reservation"
                    icon={<CreateIcon />}
                />
                <ListItemRouterLink
                    text="Rooms"
                    to="/rooms"
                    icon={<MeetingRoomIcon />}
                />
                <ListItemRouterLink
                    text="Courses"
                    to="/courses"
                    icon={<SchoolIcon />}
                />
                <ListItemRouterLink
                    text="Users"
                    to="/users"
                    icon={<GroupIcon />}
                />
            </List>
        </>
    )

    return (
        <>
            <Hidden xsDown implementation="js">
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: menuOpen,
                        [classes.drawerClose]: !menuOpen,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: menuOpen,
                            [classes.drawerClose]: !menuOpen,
                        }),
                    }}
                >
                    {menuContent}
                </Drawer>
            </Hidden>
            <Hidden smUp implementation="js">
                <Drawer
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    variant="temporary"
                    open={menuOpen}
                    onClose={handleMenuToggle}
                >
                    {menuContent}
                </Drawer>
            </Hidden>
        </>
    )
}

export default SideMenu
