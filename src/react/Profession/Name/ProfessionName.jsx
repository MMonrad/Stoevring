import React, { PureComponent } from 'react'
import fetchRequests from 'src/react/_hocs/fetchRequests/fetchRequests';
import * as professionRequests from 'src/requests/professionRequests';

@fetchRequests({
  professions: professionRequests.professions(),
})
export default class ProfessionName extends PureComponent {
  render() {
    const { professions, professionId } = this.props;
    return <span>{professions[professionId].name}</span>;
  }
}