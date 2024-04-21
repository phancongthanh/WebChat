import React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";

const MuiNavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>((props, ref) => (
  <NavLink {...props} className={({ isActive }) => props.className + (isActive ? " Mui-selected" : "")} ref={ref} />
));

export default MuiNavLink;
