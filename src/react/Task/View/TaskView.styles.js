export default theme => ({
    grid: {
        height: '100%',
    },
    bottomMenu: {
        [theme.breakpoints.up('md')]: {
            maxWidth: 426,
        },
        padding: theme.spacing.unit * 2, 
        textAlign: 'right'
    },
    gridItem: {
        overflow: 'scroll',
        overflowScrolling: 'touch',
        WebkitOverflowScrolling: 'touch',
        [theme.breakpoints.up('md')]: {
            maxWidth: 426,
        },
        [theme.breakpoints.up('xs')]: {
            height: 'calc(100vh - 48px)',
        },
        [theme.breakpoints.up('sm')]: {
            height: 'calc(100vh - 64px)',
        },
        '&::-webkit-scrollbar': {
            display: 'none'
        }
    },
    fabButton: {
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        left: 'calc(100% - ' + theme.spacing.unit * 9 +'px)',
        [theme.breakpoints.up('sm')]: {
            left: 'calc(50% - ' + theme.spacing.unit * 9 +'px)',
        },
        [theme.breakpoints.up('md')]: {
            left: 'calc(33.3333% - ' + theme.spacing.unit * 9 +'px)',
        },
        [theme.breakpoints.up('lg')]: {
            left: 426 - (theme.spacing.unit * 9),
        },
        
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    item: {
        flex: 'inherit',
    },
    taskMenu: {
        paddingBottom: theme.spacing.unit * 11,
    },
    root: {
        width: '100%',
        position: 'absolute',
        //height: 'calc(100vh - 65px)',
        top: 56,
        [theme.breakpoints.up('xs')]: {
            top: 48,
        },
        [theme.breakpoints.up('sm')]: {
            top: 64,
        },
        top: 65,
        bottom: 0,
        overflow: 'hidden'
    },

});