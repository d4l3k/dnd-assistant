import React from 'react'
import { Platform, StyleSheet, Text, View, StatusBar, ToolbarAndroid } from 'react-native'
import SpellBook from './SpellBook.js'
import ScrollableTabView from 'react-native-scrollable-tab-view'

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.outer}>
        <StatusBar
          style={styles.statusbar}
          backgroundColor="blue"
          barStyle="light-content"
        />
        <View style={styles.container}>
          <ToolbarAndroid
            style={styles.toolbar}
            title="DND Assistant"
            //actions={[{title: 'Settings', icon: require('./icon_settings.png'), show: 'always'}]}
            onActionSelected={this.onActionSelected}
          />
          <ScrollableTabView>
            <View tabLabel="Character">
              <Text>Character</Text>
            </View>
            <SpellBook tabLabel="Spells">
            </SpellBook>
          </ScrollableTabView>
        </View>
      </View>
    )
  }

  onActionSelected (position) {
    /*
    if (position === 0) { // index of 'Settings'
      showSettings();
    }
    */
  }
}

const styles = StyleSheet.create({
  outer: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  statusbar: {
  },
  toolbar: {
    backgroundColor: '#2196F3',
    height: 56,
    ...Platform.select({
      android: {
        marginTop: StatusBar.currentHeight
      }
    })
  }
})
