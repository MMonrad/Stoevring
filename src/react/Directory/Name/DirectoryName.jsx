import React, { PureComponent } from 'react'
import * as directoryRequests from 'src/requests/directoryRequests';
import fetchRequests from 'src/react/_hocs/fetchRequests/fetchRequests';

@fetchRequests((props) => ({
  profiles: directoryRequests.profilesBatch([props.userId]),
}))
export default class DirectoryName extends PureComponent {
  render() {
    const { profiles, userId } = this.props
    return <span>{profiles[userId].displayName}</span>;
  }
}