import React from 'react'
import Markdown from 'react-native-simple-markdown'

export default (props) => {
  return <Markdown>{props.source}</Markdown>
}
