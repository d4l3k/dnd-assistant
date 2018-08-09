import React from 'react'
import ReactNative, {Platform} from 'react-native'

export const Alert = Platform.select({
  default: () => ReactNative.Alert,
  web: () => {
    let last = new Date()
    return {
      alert (title, desc, buttons) {
        // Debounce if clicked too fast
        if (new Date() - last < 100) {
          return
        }

        let onPress
        buttons.forEach(button => {
          if (!button.onPress) {
            return
          }
          if (onPress) {
            throw 'NotSupported: multiple onPress handlers defined in RN Web'
          }
          onPress = button.onPress
        })

        if (confirm(title + ':\n\n' + desc)) {
          onPress()
        }
        last = new Date()
      }
    }
  }
})()
