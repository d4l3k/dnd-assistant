import React from 'react'
import {Text, StyleSheet, View} from 'react-native'
import AnimatedBar from 'react-native-animated-bar'
import {colors} from './styles.js'

export class HealthBar extends React.PureComponent {
  render () {
    const current = parseFloat(this.props.current || 0)
    const max = parseFloat(this.props.max)
    let progress = max ? current / max : 0
    let color = colors.error
    if (progress < 0) {
      progress = 0
    }
    if (progress > 1) {
      progress = 1
      color = colors.primary
    }

    return <View style={styles.field}>
      <AnimatedBar
        progress={progress}
        height={50}
        fillColor={colors.border}
        barColor={color}
        borderRadius={4}
        borderColor={colors.border}
      >
        <View style={[styles.row, styles.center, { flex: 1 }]}>
          <Text style={styles.text}>{current} / {max}</Text>
        </View>
      </AnimatedBar>
    </View>
  }
}

const styles = StyleSheet.create({
  field: {
    margin: 5
  },
  row: {
    flexDirection: 'row'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: colors.textPrimary,
    fontSize: 18
  }
})
