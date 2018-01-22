import React from 'react'
import { Platform, StyleSheet, Text, View, StatusBar, ToolbarAndroid } from 'react-native'
import SpellBook from './SpellBook.js'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { Navigation } from 'react-native-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default class App extends React.Component {
	render () {
		return (
			<View></View>
    )
  }
}
/*
  render () {
    return (
      <View style={styles.outer}>
        <StatusBar
          style={styles.statusbar}
          backgroundColor='#0384C3'
          barStyle='light-content'
        />
        <View style={styles.container}>
          <ToolbarAndroid
            style={styles.toolbar}
            title="Tristan's DND Assistant"
            onActionSelected={this.onActionSelected}
            titleColor='white'
          />
          <ScrollableTabView
            tabBarBackgroundColor='#039be5'
            tabBarActiveTextColor='white'
            tabBarInactiveTextColor='white'>

            <SpellBook tabLabel='Spells'>
            </SpellBook>
          </ScrollableTabView>
        </View>
      </View>
    )
  }
}
*/

class Character extends React.Component {
  render () {
    return (
      <View>
        <Text>Character</Text>
      </View>
    )
  }
}

// define your suffixes by yourself..
// here we use active, big, small, very-big..
const replaceSuffixPattern = /--(active|big|small|very-big)/g;
const icons = {
  "md-person": [30, "#bbb"],
  "md-book": [30, "#bbb"]
}

const defaultIconProvider = Ionicons

let iconsMap = {};
let iconsLoaded = new Promise((resolve, reject) => {
  new Promise.all(
    Object.keys(icons).map(iconName => {
      const Provider = icons[iconName][2] || defaultIconProvider
      const name = iconName.replace(replaceSuffixPattern, '')
      return Provider.getImageSource(
        name,
        icons[iconName][0],
        icons[iconName][1]
      )
    })
  ).then(sources => {
    Object.keys(icons)
      .forEach((iconName, idx) => iconsMap[iconName] = sources[idx])

    // Call resolve (and we are done)
    resolve(true)
  })
})

iconsLoaded.then(() => {
  startApp()
})

function startApp () {
  // we can be sure, that iconsMap has the icons now
  // iconsMap should have all the references to sources available now
  // <Image source={iconsMap['ios-person--active--big']} />
  // Or use them with react-native-navigation

  Navigation.registerComponent('CharacterScreen', () => Character)
  Navigation.registerComponent('SpellBook', () => SpellBook)

  Navigation.startTabBasedApp({
    tabs: [
      {
        label: 'Character',
        screen: 'CharacterScreen', // this is a registered name for a screen
        icon: iconsMap['md-person'],
        title: 'Character'
      },
      {
        label: 'Spells',
        screen: 'SpellBook',
        icon: iconsMap['md-book'],
        title: 'Spells'
      }
    ]
  })
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
    backgroundColor: '#039be5',
    height: 56,
    ...Platform.select({
      android: {
        marginTop: StatusBar.currentHeight
      }
    })
  }
})
