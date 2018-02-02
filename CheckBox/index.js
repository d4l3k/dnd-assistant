import React from 'react'
import RN from 'react-native'

export const CheckBox = (props) => {
  return <RN.CheckBox onValueChange={props.onClick} value={props.isChecked} />
}
