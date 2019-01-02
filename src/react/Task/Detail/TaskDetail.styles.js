export default theme => ({
    detailView: {
        borderLeftColor: theme.palette.grey[500],
        borderLeftWidth: '1px',
        borderLeft: 'solid',
        height: '100%',
        padding: theme.spacing.unit * 2,
        backgroundColor: 'white',
        
    },
    detailScrollContainer: {
        overflow: 'scroll',
        overflowScrolling: 'touch',
        WebkitOverflowScrolling: 'touch',
        '&::-webkit-scrollbar': {
            display: 'none'
        }
    },
    button: {
        marginRight: theme.spacing.unit,
    },
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.grey[100],
    },
    appBarTitle: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    cardSecondary: {
        marginTop: theme.spacing.unit * 4,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    drawerPaper: {
        width: '100%',
    },
});