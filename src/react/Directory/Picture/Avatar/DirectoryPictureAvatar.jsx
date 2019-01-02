import React, { PureComponent } from 'react'

import fetchRequests from 'src/react/_hocs/fetchRequests/fetchRequests';
import * as directoryRequests from 'src/requests/directoryRequests';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import styles from 'src/react/Directory/Picture/Avatar/DirectoryPictureAvatar.styles';

@withStyles(styles)
@fetchRequests([
  (props) => ({
    profiles: directoryRequests.profilesBatch([props.userId]),
  }),
  (props) => ({
    image: directoryRequests.profilePictureUrl(props.profiles[props.userId].legacyId),
  })
])
export default class DirectoryPictureAvatar extends PureComponent {
  render() {
    const { classes, image } = this.props
    return (
      <div className={classes.row}>
        <Avatar src={image} className={classes.avatar}/>
      </div>
    )
  }
}