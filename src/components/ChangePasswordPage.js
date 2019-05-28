import React, { Component } from "react";
import { ProxyPage } from "@openimis/fe-core";


class ChangePasswordPage extends Component {
    render() {
        return <ProxyPage url="/ChangePassword.aspx" />
    }
}

export { ChangePasswordPage };