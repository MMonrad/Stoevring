import React, { PureComponent } from "react";

import IdleTimer from "react-idle-timer";
import { authentication } from "src/utils/authentication/authentication";

export default class IdleDialog extends PureComponent {
    onIdle = e => {
        authentication.Instance.logout();
    };
    render() {
        return <IdleTimer element={document} onIdle={this.onIdle} timeout={1000 * 60 * 10} />;
    }
}
