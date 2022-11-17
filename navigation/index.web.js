import React from 'react'
import autobind from 'autobind-decorator'
import ReactDOM from 'react-dom/client'
import classNames from 'classnames'
import {
  AppRegistry,
  StyleSheet,
  View,
  ScrollView,
  Dimensions
} from 'react-native'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material//Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import {createTheme, ThemeProvider} from '@mui/material/styles'
import {withStyles} from '@mui/styles'

import {BaseText, LightBox, colors, Touchable} from '../styles'


import Iconicons from 'react-native-vector-icons/Fonts/Ionicons.ttf'
import MaterialIcons from 'react-native-vector-icons/Fonts/MaterialIcons.ttf'
import MaterialCommunityIcons from 'react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'

import ReactGA from 'react-ga'

const fonts = [
  ['Ionicons', Iconicons],
  ['MaterialIcons', MaterialIcons],
  ['MaterialCommunityIcons', MaterialCommunityIcons]
]

let css = ''

for (const font of fonts) {
  css += `@font-face {
    src: url(${font[1]});
    font-family: ${font[0]};
  }
  `
}

// Create stylesheet
const style = document.createElement('style')
style.type = 'text/css'
if (style.styleSheet) {
  style.styleSheet.cssText = css
} else {
  style.appendChild(document.createTextNode(css))
}

// Inject stylesheet
document.head.appendChild(style)

const materialStyles = theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    maxWidth: '33.3333vw',
    flexBasis: '33.3333vw',
    flexGrow: 1,
    flexShrink: 1,
  },
  paper: {
    //padding: theme.spacing.unit * 1,
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'hidden'
  },
  flex: {
    flex: 1,
  },
  preWrap: {
    whiteSpace: 'pre-wrap'
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  drawerHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  drawer: {
    width: '320px',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    flexGrow: 1
  },
  drawerRight: {
    paddingRight: '320px',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-around'
  },
})

const theme = createTheme({
  palette: {
    primary: {
      dark: colors.darkPrimary,
      light: colors.lightPrimary,
      main: colors.primary,
      contrastText: colors.textPrimary
    },
    secondary: {
      main: colors.accent,
      contrastText: colors.textPrimary
    },
    error: {
      main: colors.error
    },
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2
  },
})

class Navigator {
  constructor () {
    this.components = {}
  }

  registerComponent (name, fun) {
    this.components[name] = fun
  }

  startTabBasedApp (props) {
    const container = document.createElement('div')
    container.style.display = 'flex'
    container.style.height = '100vh'
    document.body.appendChild(container)
    /*
    AppRegistry.runApplication('ReactNativeWeb', {
      rootTag: container,
      initialProps: props
    })
    */
    const root = ReactDOM.createRoot(container);
    root.render(
      <ThemeProvider theme={theme}>
        <ReactNativeWeb {...props} />
      </ThemeProvider>
    );
  }

  getComponent (name, props) {
    return this.components[name]()
  }
}

export const Navigation = new Navigator()


function renderButtons (buttons, props, press) {
  if (!buttons) {
    return
  }

  return buttons.map((button) => renderButton(button, props, press)).reverse()
}

function renderButton (button, props, press) {
  const {first, last} = props || {}

  if (button.id === 'sideMenu') {
    if (!first) {
      return
    }

    button.label = 'Menu'
    button.icon = <MenuIcon />
  } else if (button.id === 'rightMenu') {
    if (!last) {
      return
    }
  }

  return <IconButton
    color='inherit'
    aria-label={button.label}
    key={button.id}
    onClick={() => press(button.id)}>
    {button.icon}
  </IconButton>
}


@withStyles(materialStyles)
class Tab extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render (tab) {
    const Screen = Navigation.getComponent(this.props.tab.screen)
    const {classes} = this.props

    return <div className={classes.tab}>
      <AppBar position='static' color='primary'>
        <Toolbar>
          {this.renderButtons('leftButtons')}

          <Typography variant='h6' color='inherit' className={classes.flex}>
            {this.props.tab.label}
          </Typography>

          {this.renderButtons('rightButtons')}
        </Toolbar>
      </AppBar>

      <div className={classes.paper}>
        {this.state.error ?
          this.renderError()
          : <Screen navigator={this} />}
      </div>

      {this.renderFab()}
    </div>
  }

  renderError() {
    const {classes} = this.props
    const msg = this.state.error.toString() + '\n' + this.state.error.stack
    return <div>
      <h2>Error</h2>
      <pre className={classes.preWrap}>{msg}</pre>
    </div>
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ error: error, errorInfo: info });
    // You can also log the error to an error reporting service
    console.log('Tab had error!', error, info);
  }

  renderButtons (side) {
    const buttons = this.props.tab.navigatorButtons && this.props.tab.navigatorButtons[side]
    return renderButtons(buttons, this.props, this.press)
  }

  renderFab () {
    const fab = this.props.tab.navigatorButtons && this.props.tab.navigatorButtons.fab
    if (!fab) {
      return
    }

    const {classes} = this.props

    return <Button variant='fab' color='secondary' className={classes.fab}
      onClick={() => this.press(fab.collapsedId)}>
      {fab.collapsedIcon}
    </Button>
  }

  setOnNavigatorEvent (f) {
    this.navigatorEvent = f
  }

  @autobind
  press (id) {
    if (id === 'sideMenu') {
      this.props.app.toggle('left')
      return
    } else if (id === 'rightMenu') {
      this.props.app.toggle('right')
      return
    }

    if (!this.navigatorEvent) {
      return
    }

    this.navigatorEvent({type: 'NavBarButtonPress', id: id})
  }

  showLightBox (modal) {
    this.props.app.showLightBox(modal)
  }

  dismissLightBox () {
    this.props.app.dismissLightBox()
  }

  push (screen) {
    this.props.app.push(screen)
  }
}

@withStyles(materialStyles)
class ReactNativeWeb extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      left: false,
      right: false
    }
  }

  render () {
    const LeftDrawer = Navigation.getComponent(this.props.drawer.left.screen)
    const RightDrawer = Navigation.getComponent(this.props.drawer.right.screen)
    const {classes} = this.props

    return <div className={classNames(classes.row, {[classes.drawerRight]: this.state.right})}>
        <Drawer
          anchor='left'
          open={this.state.left}
          onClose={() => this.toggle('left')}
        >

          <div className={classes.drawerHeader}>
            <IconButton onClick={() => this.toggle('left')}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />

          <div className={classes.drawer}>
            <LeftDrawer navigator={this} />
          </div>
        </Drawer>
        {
          this.props.tabs.map((tab, i) =>
            <Tab
              key={tab.label}
              tab={tab}
              app={this}
              first={i === 0}
              last={i === (this.props.tabs.length - 1)}
            />
          )
        }
        <Drawer
          variant='persistent'
          anchor='right'
          open={this.state.right}
          onClose={() => this.toggle('right')}
        >
          <div className={classes.drawerHeaderRight}>
            <IconButton onClick={() => this.toggle('right')}>
              <ChevronRightIcon />
            </IconButton>
          </div>
          <Divider />

          <div className={classes.drawer}>
            <RightDrawer navigator={this}/>
          </div>
        </Drawer>


        {this.renderModal()}
        {this.renderScreen()}
      </div>
  }

  showLightBox (modal) {
    this.setState(() => {
      return {modal}
    })
  }

  dismissLightBox () {
    this.setState(() => {
      return {modal: null, screen: null}
    })
  }

  push (screen) {
    this.setState(() => {
      return {screen}
    })
  }

  renderModal () {
    const Screen = this.state.modal && Navigation.getComponent(this.state.modal.screen)

    return <Modal open={!!this.state.modal} onClose={() => this.setState(() => {
      return {modal: null}
    })}
     style={centerStyle}>
      <div style={innerStyle}>
      {
        this.state.modal
          ? <Screen navigator={this} {...this.state.modal.passProps} />
          : null
      }
      </div>
    </Modal>
  }

  renderScreen () {
    const screen = this.state.screen || {}
    const Screen = this.state.screen && Navigation.getComponent(screen.screen)

    return <Modal open={!!this.state.screen} onClose={() => this.setState(() => {
      return {screen: null}
    })}
       style={centerStyle}>
      <div style={innerStyle}>
        <LightBox
          title={screen.title}
          renderButtons={this.renderButtons}
          width={640}
          height={Dimensions.get('window').height * 0.9}
          navigator={this}>
          {
            this.state.screen
              ? <Screen navigator={this} {...this.state.screen.passProps} />
              : null
          }
        </LightBox>
      </div>
    </Modal>
  }

  @autobind
  renderButtons () {
    const screen = this.state.screen || {}
    const buttons = screen.navigatorButtons && screen.navigatorButtons.rightButtons
    return renderButtons(buttons, {}, this.press)
  }

  @autobind
  press (id) {
    if (!this.navigatorEvent) {
      return
    }

    this.navigatorEvent({type: 'NavBarButtonPress', id: id})
  }

  setOnNavigatorEvent (f) {
    this.navigatorEvent = f
  }

  toggle (side) {
    this.setState(prev => {
      const state = {}
      state[side] = !prev[side]
      return state
    })
  }
}
AppRegistry.registerComponent('ReactNativeWeb', () => ReactNativeWeb)

const centerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  overflow: 'hidden'
}

const innerStyle = {
  display: 'flex',
  margin: '16px',
  maxHeight: 'calc(100vh - 32px)',
  overflow: 'hidden',
  maxWidth: 'calc(100vw - 32px)',
  alignItems: 'center',
  justifyContent: 'center',
  width: '640px'
}

const styles = StyleSheet.create({
  row: {
    //flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  column: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
})

ReactGA.initialize('UA-52169625-5')
ReactGA.pageview(window.location.pathname + window.location.search)
