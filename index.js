import React from 'react'
import {Navigation} from './navigation'

import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import {CharacterScreen} from './Character'
import {AddGearScreen, GearScreen} from './GearScreen'
import {CharacterMenu} from './CharacterMenu'
import {WildMagicScreen} from './WildMagicScreen'
import {DiceScreen, AddDieScreen} from './DiceScreen'
import {KnownSpellsScreen, AddSpellScreen, SlotsScreen, CastSpellScreen} from './SpellBook'
import {colors} from './styles'
import {Platform} from 'react-native'

// define your suffixes by yourself..
// here we use active, big, small, very-big..
const replaceSuffixPattern = /--(active|big|small|very-big)/g
const icons = {
  'md-person': [30, 'white'],
  'md-book': [30, 'white'],
  'md-basket': [30, 'white'],
  'md-settings': [30, 'white'],
  'md-search': [30, 'white'],
  'md-add': [30, 'white'],
  'clear-all': [30, 'white', MaterialIcons],
  'dice-multiple': [30, 'white', MaterialCommunityIcons],
  'fire': [30, 'white', MaterialCommunityIcons],
}

const defaultIconProvider = Ionicons

let iconsMap = {}
let iconsLoaded = new Promise((resolve, reject) => {
  Promise.all(
    Object.keys(icons).map(iconName => {
      const Provider = icons[iconName][2] || defaultIconProvider
      const name = iconName.replace(replaceSuffixPattern, '')
      const size = icons[iconName][0]
      const color = icons[iconName][1]
      return Platform.select({
        web: () => <Provider name={name} size={size} color={color} />,
        default: () => {
          return Provider.getImageSource(name, size, color)
        }
      })()
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
  Navigation.registerComponent('dnd.CharacterScreen', () => CharacterScreen)
  Navigation.registerComponent('dnd.GearScreen', () => GearScreen)
  Navigation.registerComponent('dnd.CharacterMenu', () => CharacterMenu)
  Navigation.registerComponent('dnd.KnownSpellsScreen', () => KnownSpellsScreen)
  Navigation.registerComponent('dnd.CastSpellScreen', () => CastSpellScreen)
  Navigation.registerComponent('dnd.SlotsScreen', () => SlotsScreen)
  Navigation.registerComponent('dnd.AddGearScreen', () => AddGearScreen)
  Navigation.registerComponent('dnd.AddSpellScreen', () => AddSpellScreen)
  Navigation.registerComponent('dnd.DiceScreen', () => DiceScreen)
  Navigation.registerComponent('dnd.AddDieScreen', () => AddDieScreen)
  Navigation.registerComponent('dnd.CastSpellScreen', () => CastSpellScreen)
  Navigation.registerComponent('dnd.WildMagicScreen', () => WildMagicScreen)

  const leftButtons = [
    {
      id: 'sideMenu'
    }
  ]

  const rightButtons = Platform.select({
    web: [{
      id: 'rightMenu',
      title: 'Dice',
      icon: iconsMap['dice-multiple']
    }],
    default: []
  })

  Navigation.startTabBasedApp({
    appStyle: {
      navBarBackgroundColor: colors.primary,
      navBarTextColor: colors.textPrimary,
      navBarButtonColor: colors.textPrimary,
      statusBarColor: colors.darkPrimary,
      navBarHideOnScroll: true,
      tabBarButtonColor: colors.secondaryText,
      tabBarSelectedButtonColor: colors.primary
    },
    tabs: [
      {
        label: 'Character',
        screen: 'dnd.CharacterScreen', // this is a registered name for a screen
        icon: iconsMap['md-person'],
        title: 'Character',
        navigatorButtons: {
          rightButtons: rightButtons,
          leftButtons: leftButtons
        }
      },
      {
        label: 'Gear',
        screen: 'dnd.GearScreen', // this is a registered name for a screen
        icon: iconsMap['md-basket'],
        title: 'Gear',
        navigatorButtons: {
          fab: {
            collapsedId: 'add',
            collapsedIcon: iconsMap['md-add'],
            collapsedIconColor: colors.textPrimary,
            backgroundColor: colors.accent,
            animated: true
          },
          rightButtons: rightButtons,
          leftButtons: leftButtons
        }
      },
      {
        label: 'Spells',
        screen: 'dnd.KnownSpellsScreen',
        icon: iconsMap['md-book'],
        title: 'Spells',
        navigatorButtons: {
          fab: {
            collapsedId: 'add',
            collapsedIcon: iconsMap['md-add'],
            collapsedIconColor: colors.textPrimary,
            backgroundColor: colors.accent,
            animated: true
          },
          rightButtons: [
            ...rightButtons,
            {
              id: 'slots',
              title: 'Slots',
              icon: iconsMap['md-settings']
            },
            {
              id: 'wildMagic',
              title: 'Wild Magic',
              icon: iconsMap['fire']
            },
            {
              id: 'resetSlots',
              title: 'Reset Slots',
              icon: iconsMap['clear-all']
            },
            {
              id: 'filter',
              title: 'Filter',
              icon: iconsMap['md-search']
            }
          ],
          leftButtons: leftButtons
        }
      }
    ],
    drawer: {
      left: {
        screen: 'dnd.CharacterMenu',
        fixedWidth: 800
      },
      right: {
        screen: 'dnd.DiceScreen',
        fixedWidth: 800
      }
    }
  })
}
