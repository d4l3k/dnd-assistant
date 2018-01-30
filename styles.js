import React from 'react'
import ReactNative, {View, ScrollView, TouchableNativeFeedback, Dimensions, Text, Platform} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

export const colors = {
  darkPrimary: '#0288D1',
  primary: '#03A9F4',
  lightPrimary: '#B3E5FC',
  textPrimary: '#FFFFFF',
  accent: '#FF4081',
  primaryText: '#212121',
  secondaryText: '#757575',
  border: '#dadada',
  error: '#FF0000'
}

export class BaseText extends React.PureComponent {
  render () {
    return <Text style={{color: colors.primaryText}}>{this.props.children}</Text>
  }
}

export class P extends React.PureComponent {
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

export class H1 extends React.PureComponent {
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

export class Error extends React.PureComponent {
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

export class B extends React.PureComponent {
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

export class Center extends React.PureComponent {
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

export class LightBox extends React.PureComponent {
  render () {
    return <View style={{
        justifyContent: 'space-between',
        backgroundColor: 'white',
        margin: 16,
        padding: 16,
        width: Dimensions.get('window').width - 32,
        minHeight: 250,
        borderRadius: 4
      }}>

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <H1>{this.props.title}</H1>

        <Ionicons.Button
          name="md-close"
          color={colors.secondaryText}
          iconStyle={{marginRight: 0}}
          backgroundColor="transparent"
          onPress={() => this.props.navigator.dismissLightBox()}
        />
      </View>

      <ScrollView>
        {this.props.children}
      </ScrollView>
    </View>
  }
}

export const Field = (props) => {
  const style = {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    alignItems: 'stretch',
    margin: 5,
    borderRadius: 4,
    justifyContent: 'space-between'
  }
  if (typeof props.flex === 'number') {
    style.flex = props.flex
  }
  return <View style={style}>
    <Center>{props.name}</Center>
    {props.children}
  </View>
}

export const showLightBox = (navigator, screen, props) => {
  navigator.showLightBox({
    screen: screen,
    passProps: props,
    style: {
      backgroundBlur: 'dark',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      tapBackgroundToDismiss: true
    }
  })
}

class TouchableNative extends React.PureComponent {
  render () {
    return <TouchableNativeFeedback
      onPress={this.props.onPress}
      background={TouchableNativeFeedback.SelectableBackground()}>
      {this.props.children}
    </TouchableNativeFeedback>
  }
}

export let Touchable

if (TouchableNativeFeedback.SelectableBackground) {
  Touchable = TouchableNative
} else {
  const ButtonBase = require('material-ui/ButtonBase').default
  const withStyles = require('material-ui/styles').withStyles

  const materialStyles = theme => ({
    touchable: {
      textAlign: 'left',
      justifyContent: 'stretch'
    }
  })

  @withStyles(materialStyles)
  class TouchableWeb extends React.PureComponent {
    render () {
      return <ButtonBase
      className={this.props.classes.touchable}
        onClick={this.props.onPress}>
        {this.props.children}
      </ButtonBase>
    }
  }
  Touchable = TouchableWeb
}
