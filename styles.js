import React from 'react'
import autobind from 'autobind-decorator'
import {ScrollView, StyleSheet, View, TouchableNativeFeedback, TouchableHighlight, Text, Platform, Dimensions} from 'react-native'
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
  error: '#f44336'
}

export const fontSize = 18

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


export class H2 extends React.PureComponent {
  render () {
    return (
      <P>
        <Text style={{fontSize, fontWeight: 'bold'}}>
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
        <Text style={{fontWeight: 'bold', fontSize}}>
          {this.props.children}
        </Text>
      </BaseText>
    )
  }
}

export class Secondary extends React.PureComponent {
  render () {
    return (
      <BaseText>
        <Text style={{color: colors.secondaryText}}>
          {this.props.children}
        </Text>
      </BaseText>
    )
  }
}

export class Header extends React.PureComponent {
  render () {
    return <View style={[styles.header, this.props.style]}>
      <View style={styles.headerpadding}>
        {this.props.children}
      </View>
      {this.props.right}
    </View>
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
    const box = <View style={{
      justifyContent: 'flex-start',
      backgroundColor: 'white',
      alignItems: 'stretch',
      marginHorizontal: 16,
      minHeight: 100,
      borderRadius: 4,
      ...Platform.select({
        web: {
          height: this.props.height,
          width: this.props.width ? this.props.width - 32 : null
        },
        default: {
          width: Dimensions.get('window').width * 0.9
        },
        android: {
          width: Dimensions.get('window').width * 0.9,
          minHeight: 500
        }
      })
    }}>

      <View style={{
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 16
      }}>
        <H1>{this.props.title}</H1>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {this.props.renderButtons ? this.props.renderButtons() : null}

          <Ionicons.Button
            name='md-close'
            color={colors.secondaryText}
            iconStyle={{marginRight: 0, marginTop: 10}}
            backgroundColor='transparent'
            onPress={this.dismiss}
          />
        </View>
      </View>

      <View style={{
        marginHorizontal: 16,
        marginBottom: 16,
        flex: 1
      }}>
        {this.props.children}
      </View>
    </View>

    return Platform.select({
      web: () => box,
      default: () => {
        return <View style={styles.flexContainer}>
          {box}
        </View>
      }
    })()
  }

  @autobind
  dismiss () {
    this.props.navigator.dismissLightBox()
  }
}

export const Field = (props) => {
  const style = {
    flex: 2,
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

class TouchableAndroid extends React.PureComponent {
  render () {
    return <TouchableNativeFeedback
      onPress={this.props.onPress}
      background={TouchableNativeFeedback.SelectableBackground()}>
      {this.props.children}
    </TouchableNativeFeedback>
  }
}

export const Touchable = Platform.select({
  android: () => TouchableAndroid,
  ios: () => TouchableHighlight,
  web: () => {
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
    return TouchableWeb
  }
})()

const {height, width} = Dimensions.get('window')

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerpadding: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  flexContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    height,
    width
  }
})
