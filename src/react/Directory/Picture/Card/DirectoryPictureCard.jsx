import React, { PureComponent } from 'react'

import fetchRequests from 'src/react/_hocs/fetchRequests/fetchRequests';
import * as directoryRequests from 'src/requests/directoryRequests';

import CardMedia from '@material-ui/core/CardMedia';

@fetchRequests([
  (props) => ({
    profiles: directoryRequests.profilesBatch([props.userId]),
  }),
  (props) => ({
    image: directoryRequests.profilePictureUrl(props.profiles[props.userId].legacyId),
  })
])
export default class DirectoryPictureCard extends PureComponent {
  render() {
    const { style, image } = this.props
    return (
        <CardMedia
          style={style ? style : {height: 120}}
          image={image}
        />
    )
  }
}