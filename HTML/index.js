import React from 'react'

export default (props) => {
  return <div dangerouslySetInnerHTML={{ __html: props.source }} />
}
