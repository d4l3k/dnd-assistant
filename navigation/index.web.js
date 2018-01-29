import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  View
} from 'react-native'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import Drawer from 'material-ui/Drawer'
import Button from 'material-ui/Button'
import Modal from 'material-ui/Modal'
import {withStyles, createMuiTheme, MuiThemeProvider} from 'material-ui/styles'

import {BaseText, LightBox, colors} from '../styles'


import Iconicons from 'react-native-vector-icons/Fonts/Ionicons.ttf'
import MaterialIcons from 'react-native-vector-icons/Fonts/MaterialIcons.ttf'

const fonts = [['Ionicons', Iconicons], ['MaterialIcons', MaterialIcons]]

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
  }
})

const theme = createMuiTheme({
  palette: {
    primary: {
      dark: colors.darkPrimary,
      light: colors.lightPrimary,
      main: colors.primary
    },
    secondary: {
      main: colors.accent,
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
  }
})

class Navigator {
  constructor () {
    this.components = {}
  }

  registerComponent (name, fun) {
    this.components[name] = fun
  }

  startTabBasedApp (props) {
    AppRegistry.runApplication('ReactNativeWeb', {
      rootTag: document.getElementById('react-app'),
      initialProps: props
    })
  }

  getComponent (name, props) {
    return this.components[name]()
  }
}

export const Navigation = new Navigator()


@withStyles(materialStyles)
class Tab extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render (tab) {
    const Screen = Navigation.getComponent(this.props.tab.screen)

    return <View style={styles.column}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography type="title" color="inherit">
            {this.props.tab.label}
          </Typography>
        </Toolbar>
      </AppBar>

      <Screen navigator={this} />

      {this.renderFab()}

      {this.renderModal()}
      {this.renderScreen()}
    </View>
  }

  renderFab () {
    const fab = this.props.tab.navigatorButtons && this.props.tab.navigatorButtons.fab
    if (!fab) {
      return
    }

    const {classes} = this.props

    return <Button fab color='secondary' className={classes.fab}
      onClick={() => this.press(fab.collapsedId)}>
      {fab.collapsedIcon}
    </Button>
  }

  renderModal () {
    if (!this.state.modal) {
      return
    }

    return <Modal open={true} onClose={() => this.setState(() => {
      return {modal: null}
    })}>
      {
        React.createElement(
          Navigation.getComponent(this.state.modal.screen),
          {navigator: this, ...this.state.modal.passProps}
        )
      }
    </Modal>
  }


  renderScreen () {
    if (!this.state.screen) {
      return
    }

    return <Modal open={true} onClose={() => this.setState(() => {
      return {screen: null}
    })}>
      <LightBox title={this.state.screen.title} navigator={this}>
        {

          React.createElement(
            Navigation.getComponent(this.state.screen.screen),
            {navigator: this, ...this.state.screen.passProps}
          )
        }
      </LightBox>
    </Modal>
  }

  setOnNavigatorEvent (f) {
    this.navigatorEvent = f
  }

  press (id) {
    if (!this.navigatorEvent) {
      return
    }

    this.navigatorEvent({type: 'NavBarButtonPress', id: id})
  }

  showLightBox (modal) {
    this.setState(() => {
      return {modal}
    })
  }

  dismissLightBox () {
    this.setState(() => {
      return {modal: null}
    })
  }

  push (screen) {
    this.setState(() => {
      return {screen}
    })
  }
}

@withStyles(materialStyles)
class ReactNativeWeb extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      leftOpen: false,
      rightOpen: false
    }
  }

  render () {
    const LeftDrawer = Navigation.getComponent(this.props.drawer.left.screen)
    const RightDrawer = Navigation.getComponent(this.props.drawer.right.screen)
    return <MuiThemeProvider theme={theme}>
      <View style={styles.row}>
        <Drawer
          type="persistent"
          anchor='left'
          open={this.state.leftOpen}
        >
          <LeftDrawer />
        </Drawer>
        {
          this.props.tabs.map(tab => <Tab key={tab.label} tab={tab} />)
        }
        <Drawer
          type="persistent"
          anchor='right'
          open={this.state.rightOpen}
        >
          <RightDrawer />
        </Drawer>
      </View>
    </MuiThemeProvider>
  }
}
AppRegistry.registerComponent('ReactNativeWeb', () => ReactNativeWeb)

const styles= StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  column: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  }
})

