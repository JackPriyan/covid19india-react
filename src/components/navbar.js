import LanguageSwitcher from './languageswitcher';

import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import {Link} from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {useTheme} from '@material-ui/core/styles';
import {makeStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Home} from '@material-ui/icons';
import {People} from '@material-ui/icons';
import {Equalizer} from '@material-ui/icons';
import {Help} from '@material-ui/icons';
import {Contacts} from '@material-ui/icons';
import {WbSunny} from '@material-ui/icons';
import {Brightness2} from '@material-ui/icons';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import {React} from 'react';
import {useState} from 'react';
import {useLocalStorage} from 'react-use';
import {useLockBodyScroll} from 'react-use'; //  useWindowSize,

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: 'inherit',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  toolbarHeight: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    height: 'inherit',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function Navbar({pages, darkMode, setDarkMode}) {
  const classes = useStyles();
  const theme = useTheme();

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [expand] = useState(false);
  // eslint-disable-next-line
  const [isThemeSet, setIsThemeSet] = useLocalStorage('isThemeSet', false);

  useLockBodyScroll(expand);
  //  const windowSize = useWindowSize();
  //  const preventDefault = (event) => event.preventDefault();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h3" noWrap>
            Covid19 India
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <div className={Navbar}>
          <List>
            <ListItem button>
              <LanguageSwitcher />
            </ListItem>
          </List>
          <Divider />

          <List>
            {[
              {text: 'Home', path: '/', icon: <Home />},
              {text: 'Demographics', path: '/demographics', icon: <People />},
              {text: 'Deep Dive', path: '/deepdive', icon: <Equalizer />},
              {text: 'Essentials', path: '/essentials', icon: <Contacts />},
              {text: 'About', path: '/about', icon: <Help />},
            ].map((item, index) => (
              <Link
                key={index}
                href={item.path}
                color="inherit"
                style={{textDecoration: 'none'}}
              >
                <ListItem key={index} button>
                  <ListItemIcon> {item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              </Link>
            ))}
          </List>
          <Divider />
          {window.innerWidth > 769 && (
            <List>
              <ListItem
                button
                onClick={() => {
                  setDarkMode((prevMode) => !prevMode);
                  setIsThemeSet(true);
                }}
              >
                {darkMode ? <WbSunny /> : <Brightness2 />}
              </ListItem>
            </List>
          )}
        </div>
      </Drawer>
    </div>
  );
}
export default Navbar;
