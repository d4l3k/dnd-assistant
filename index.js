import React from 'react'
import { Platform, Text, View } from 'react-native'
import { KnownSpellsScreen, AddSpellScreen, SlotsScreen }  from './SpellBook.js'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import { Navigation } from 'react-native-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {CharacterScreen, CharacterMenu, GearScreen} from './Character.js'

// define your suffixes by yourself..
// here we use active, big, small, very-big..
const replaceSuffixPattern = /--(active|big|small|very-big)/g;
const icons = {
  "md-person": [30, "black"],
  "md-book": [30, "black"],
  "md-basket": [30, "black"],
  "md-settings": [30, "black"],
  "md-funnel": [30, "black"],
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

  Navigation.registerComponent('dnd.CharacterScreen', () => CharacterScreen)
  Navigation.registerComponent('dnd.GearScreen', () => GearScreen)
  Navigation.registerComponent('dnd.CharacterMenu', () => CharacterMenu)
  Navigation.registerComponent('dnd.KnownSpellsScreen', () => KnownSpellsScreen)
  Navigation.registerComponent('dnd.AddSpellScreen', () => AddSpellScreen)
  Navigation.registerComponent('dnd.SlotsScreen', () => SlotsScreen)

  Navigation.startTabBasedApp({
    appStyle: {
      navBarBackgroundColor: 'white',
      navBarTextColor: '#039be5'
    },
    tabs: [
      {
        label: 'Character',
        screen: 'dnd.CharacterScreen', // this is a registered name for a screen
        icon: iconsMap['md-person'],
        title: 'Character'
      },
      {
        label: 'Gear',
        screen: 'dnd.GearScreen', // this is a registered name for a screen
        icon: iconsMap['md-basket'],
        title: 'Gear'
      },
      {
        label: 'Spells',
        screen: 'dnd.KnownSpellsScreen',
        icon: iconsMap['md-book'],
        title: 'Spells',
        navigatorButtons: {
          rightButtons: [
            {
              id: 'slots',
              title: 'Slots',
              icon: iconsMap['md-settings']
            },
            {
              id: 'filter',
              title: 'Filter',
              icon: iconsMap['md-funnel']
            }
          ]
        }
      }
    ],
    drawer: {
      left: {
        screen: 'dnd.CharacterMenu',
        fixedWidth: 800
      }
    }
  })
}
