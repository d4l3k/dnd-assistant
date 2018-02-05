import {Navigation} from './navigation'

import {iconsMap} from './icons'
import {colors} from './styles'
import {Platform} from 'react-native'

export const start = () => {
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

  const tabs = [
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
  ]

  if (__DEV__) {
    tabs.forEach(tab => {
      tab.title = tab.title + ' (DEBUG)'
    })
  }

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
    tabs: tabs,
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
