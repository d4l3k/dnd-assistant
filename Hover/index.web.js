import React from 'react'
import {StyleSheet, View} from 'react-native'

export const Hover = ({title, children}) => {
  return <span title={title}>{children}</span>
}
