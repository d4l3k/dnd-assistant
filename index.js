//require('react-devtools-core').connectToDevTools({host: '192.168.0.15'})

import React from 'react'
import {Navigation} from './navigation'

import {CharacterScreen, ShareSettingsScreen} from './Character'
import {AddGearScreen, GearScreen} from './GearScreen'
import {CharacterMenu} from './CharacterMenu'
import {WildMagicScreen} from './WildMagicScreen'
import {DiceScreen, AddDieScreen} from './DiceScreen'
import {KnownSpellsScreen, AddSpellScreen, SpellSettingsScreen, CastSpellScreen} from './SpellBook'
import {colors} from './styles'
import {Platform} from 'react-native'
import {iconsLoaded, iconsMap} from './icons'

iconsLoaded.then(() => {
  startApp()
})

function startApp () {
  Navigation.registerComponent('dnd.CharacterScreen', () => CharacterScreen)
  Navigation.registerComponent('dnd.ShareSettingsScreen', () => ShareSettingsScreen)
  Navigation.registerComponent('dnd.GearScreen', () => GearScreen)
  Navigation.registerComponent('dnd.CharacterMenu', () => CharacterMenu)
  Navigation.registerComponent('dnd.KnownSpellsScreen', () => KnownSpellsScreen)
  Navigation.registerComponent('dnd.CastSpellScreen', () => CastSpellScreen)
  Navigation.registerComponent('dnd.SpellSettingsScreen', () => SpellSettingsScreen)
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
          rightButtons: [
            ...rightButtons,
            {
              id: 'share',
              title: 'Sharing Settings',
              icon: iconsMap['md-share']
            }
          ],
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
