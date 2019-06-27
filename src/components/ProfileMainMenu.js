import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import { AccountCircle, Fingerprint } from "@material-ui/icons";
import { formatMessage, MainMenuContribution } from "@openimis/fe-core";

class ProfileMainMenu extends Component {
  render() {
    return (
      <MainMenuContribution
        {...this.props}
        header={formatMessage(this.props.intl, "profile", "mainMenu")}
        icon={<AccountCircle />}
        entries={[
          {
            text: formatMessage(this.props.intl, "profile", "menu.changePassword"),
            icon: <Fingerprint />,
            route: "/profile/changePassword"
          }
        ]}
      />
    );
  }
}
export default injectIntl(ProfileMainMenu);
