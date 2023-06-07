import React from 'react'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import BugReportIcon from '@mui/icons-material/BugReport';
export const SidebarData = [
    {
        title: "Dashboard",
        icon:  <SpaceDashboardIcon />,
        link: "/dashboard"
    },
    {
        title: "Tickets",
        icon:  <BugReportIcon />,
        link: "/tickets"
    },
    
]