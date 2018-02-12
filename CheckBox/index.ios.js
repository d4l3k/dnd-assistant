import React from 'react'
import RNCheckBox from 'react-native-checkbox'

export const CheckBox = (props) => {
  return <RNCheckBox onChange={props.onClick} checked={props.isChecked} label='' />
}
