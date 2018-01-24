import React from 'react'
import {View, Text} from 'react-native'

export const colors = {
  darkPrimary: '#0288D1',
  primary: '#03A9F4',
  lightPrimary: '#B3E5FC',
  textPrimary: '#FFFFFF',
  accent: '#FF4081',
  primaryText: '#212121',
  secondaryText: '#757575',
  border: '#dadada'
}

export class BaseText extends React.Component {
  render () {
    return <Text style={{color: colors.primaryText}}>{this.props.children}</Text>
  }
}

export class P extends React.Component {
  render () {
    return (
      <View style={{marginTop: 10, marginBottom: 10}}>
        <BaseText>
          {this.props.children}
        </BaseText>
      </View>
    )
  }
}

export class H1 extends React.Component {
  render () {
    return (
      <P>
        <Text style={{fontSize: 24, fontWeight: 'bold'}}>
          {this.props.children}
        </Text>
      </P>
    )
  }
}

export class B extends React.Component {
  render () {
    return (
      <BaseText>
        <Text style={{fontWeight: 'bold'}}>
          {this.props.children}
        </Text>
      </BaseText>
    )
  }
}
