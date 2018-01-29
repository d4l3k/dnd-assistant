import {Platform} from 'react-native'

export default Platform.select({
  web: () => { return {} },
  default: () => require('react-native-firebase')
})()
