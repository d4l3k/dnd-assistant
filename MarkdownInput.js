import React from 'react'
import autobind from 'autobind-decorator'

import {View, StyleSheet, Text} from 'react-native'
import {colors, fieldStyles, Center, BaseText} from './styles'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {TextInput} from './TextInput'
import Markdown from './markdown'

export class MarkdownInput extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {}
  }

  render () {
    return <View style={fieldStyles}>
      <View style={styles.center}>
        <BaseText>{this.props.name}</BaseText>
        {this.renderButton()}
      </View>
      {this.renderInner()}
    </View>
  }

  renderInner () {
    const val = this.props.value || ''
    if (this.state.editing) {
      return <TextInput
        value={val}
        multiline={true}
        onChangeText={this.props.onChangeText}
      />
    }
    return <Markdown source={val} />
  }

  @autobind
  toggle () {
    console.log('toggle')
    this.setState(({editing}) => {
      return {
        editing: !editing
      }
    })
  }

  renderButton () {
    return <Ionicons.Button
      name={this.state.editing ? 'md-eye' : 'md-create'}
      color={colors.secondaryText}
      iconStyle={styles.button}
      backgroundColor='transparent'
      onPress={this.toggle}
    />
  }
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  button: {
    marginRight: 0
  },
})
