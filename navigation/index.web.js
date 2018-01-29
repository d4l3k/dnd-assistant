import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import {BaseText} from '../styles'

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
    return React.createElement(this.components[name](), props)
  }
}

export const Navigation = new Navigator()


class Tab extends React.Component {
  render (tab) {
    return <View style={styles.column}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography type="title" color="inherit">
            {this.props.tab.label}
          </Typography>
        </Toolbar>
      </AppBar>
      {
        Navigation.getComponent(this.props.tab.screen, {
          navigator: this
        })
      }
    </View>
  }

  setOnNavigatorEvent (e) {
  }
}


class ReactNativeWeb extends React.Component {
  render () {
    return <View style={styles.row}>
      {
        this.props.tabs.map(tab => <Tab key={tab.label} tab={tab} />)
      }
    </View>
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

