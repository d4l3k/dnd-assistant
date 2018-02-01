import React from 'react'
import {Platform} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// define your suffixes by yourself..
// here we use active, big, small, very-big..
const replaceSuffixPattern = /--(active|big|small|very-big)/g
const iconColor = Platform.select({
  default: 'white',
  web: 'inherit'
})
const icons = {
  'md-person': [30, iconColor],
  'md-book': [30, iconColor],
  'md-basket': [30, iconColor],
  'md-settings': [30, iconColor],
  'md-search': [30, iconColor],
  'md-add': [30, iconColor],
  'md-share': [30, iconColor],
  'clear-all': [30, iconColor, MaterialIcons],
  'dice-multiple': [30, iconColor, MaterialCommunityIcons],
  'fire': [30, iconColor, MaterialCommunityIcons]
}

const defaultIconProvider = Ionicons

export const iconsMap = {}
export const iconsLoaded = Promise.all(
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
})
