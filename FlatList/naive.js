import React from 'react'
import {View, ScrollView} from 'react-native'

export class FlatListNaive extends React.PureComponent {
  render () {
    return <ScrollView style={this.props.style}>
      {
        this.props.data.map((a, i) => <View
          key={this.props.keyExtractor(a)}>
          {this.props.renderItem({item: a})}
        </View>)
      }
    </ScrollView>
  }
}

