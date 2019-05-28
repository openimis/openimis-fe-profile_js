import React, { Component } from "react";
import { AccountCircle, Fingerprint } from "@material-ui/icons";
import { MainMenuContribution } from "@openimis/fe-core";

class ProfileMainMenu extends Component {
  render() {
    return (
      <MainMenuContribution
        {...this.props}
        header="Profile"
        icon={<AccountCircle />}
        entries={[
          {
            text: "Change password",
            icon: <Fingerprint />,
            route: "/profile/changePassword"
          }
        ]}
      />
    );
  }
}
export { ProfileMainMenu };
