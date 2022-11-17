import React from 'react'
import {View} from 'react-native'
import {SvgUri} from 'react-native-svg'

export const Image = ({source, svgXmlData, style}) => {
  if (svgXmlData) {
    source = undefined
  }
  return <View style={style}>
    <SvgUri
      uri={source}
      svgXmlData={svgXmlData}
      height={style.height}
      width={style.width}
    />
  </View>
}
