import React from 'react'
import {
  NavLink as RouterLink,
  NavLinkProps as RouterLinkProps,
} from 'react-router-dom'
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core'

interface ListItemLinkProps {
  icon?: React.ReactElement
  text: string
  to: string
}

function ListItemRouterLink({ icon, text, to }: ListItemLinkProps) {
  const renderLink = React.forwardRef<any, Omit<RouterLinkProps, 'to'>>(
    (itemProps, ref) => (
      <RouterLink
        to={to}
        ref={ref}
        activeClassName="Mui-selected"
        {...itemProps}
      />
    )
  )

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={text} />
      </ListItem>
    </li>
  )
}

export default ListItemRouterLink
