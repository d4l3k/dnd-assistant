import React from 'react'
import {View} from 'react-native'
import SvgUri from 'react-native-svg-uri'

export const Image = ({source, svgXmlData, style}) => {
  if (svgXmlData) {
    source = undefined
  }
  return <View style={style}>
    <SvgUri
      source={source}
      svgXmlData={svgXmlData}
      height={style.height}
      width={style.width}
    />
  </View>
}
