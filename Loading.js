import React from 'react'
import {Platform, StyleSheet, View, Text, ScrollView, ActivityIndicator} from 'react-native'
import {H1, colors} from './styles'

export const Loading = (props) => {
  return <View style={styles.loading}>
    <ActivityIndicator size="large" color={colors.primary} />
    <H1>Loading...</H1>
  </View>
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
