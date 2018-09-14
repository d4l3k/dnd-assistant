import React from 'react'
import {StyleSheet, View} from 'react-native'

export const Image = ({source, style}) => {
  return <img src={source.uri} style={style}/>
}
