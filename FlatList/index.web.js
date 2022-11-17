import React from 'react'
import autobind from 'autobind-decorator'
import {View, ScrollView, StyleSheet} from 'react-native'
import {FlatListNaive} from './naive'

const styles = StyleSheet.create({
  flex: {
    flex: 1
  }
})

export const FlatList = FlatListNaive
