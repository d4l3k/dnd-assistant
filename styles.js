import React from 'react'
import {View, Dimensions, Text} from 'react-native'

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

export class Error extends React.Component {
  render () {
    return (
      <View>
        { this.props.error
          ? <P>
            <Text style={{color: 'red'}}>
              Error: {this.props.error}
            </Text>
          </P>
          : null
        }
      </View>
    )
  }
}

export class B extends React.Component {
  render () {
    return (
      <BaseText>
        <Text style={{fontWeight: 'bold', fontSize: 18}}>
          {this.props.children}
        </Text>
      </BaseText>
    )
  }
}

export class Center extends React.Component {
  render () {
    return (
      <Text style={{textAlign: 'center'}}>
        <BaseText>
          {this.props.children}
        </BaseText>
      </Text>
    )
  }
}

export class LightBox extends React.Component {
  render () {
    return <View style={{
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 16,
        width: Dimensions.get('window').width - 20,
        minHeight: 250,
        borderRadius: 4
      }}>

      <H1>{this.props.title}</H1>

      {this.props.children}
    </View>
  }
}

export class Field extends React.Component {
  render () {
    return <View style={{
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 10,
      alignItems: 'stretch',
      margin: 5,
      borderRadius: 4,
      justifyContent: 'space-between'
    }}>

      <Center>{this.props.name}</Center>
      {this.props.children}
    </View>
  }
}
