import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import { AccountCircle, Fingerprint } from "@material-ui/icons";
import { formatMessage, MainMenuContribution, withModulesManager } from "@openimis/fe-core";

const PROFILE_MAIN_MENU_CONTRIBUTION_KEY = "profile.MainMenu";

class ProfileMainMenu extends Component {
  render() {
    let entries = [
      {
        text: formatMessage(this.props.intl, "profile", "menu.changePassword"),
        icon: <Fingerprint />,
        route: "/profile/changePassword"
      }
    ];
    entries.push(...this.props.modulesManager.getContribs(PROFILE_MAIN_MENU_CONTRIBUTION_KEY).filter(c => !c.filter || c.filter(rights)));

    return (
      <MainMenuContribution
        {...this.props}
        header={formatMessage(this.props.intl, "profile", "mainMenu")}
        icon={<AccountCircle />}
        entries={entries}
      />
    );
  }
}
export default withModulesManager(injectIntl(ProfileMainMenu));
