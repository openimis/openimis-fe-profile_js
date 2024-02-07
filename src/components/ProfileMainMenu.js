import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";

import { AccountCircle, Fingerprint, InsertEmoticon } from "@material-ui/icons";

import {
  formatMessage,
  MainMenuContribution,
  withModulesManager,
} from "@openimis/fe-core";

const PROFILE_MAIN_MENU_CONTRIBUTION_KEY = "profile.MainMenu";

class ProfileMainMenu extends Component {
  constructor(props) {
    super(props);
    this.isWorker = props.modulesManager.getConf("fe-insuree", "isWorker", false);
  }

  render() {
    const { rights, intl, modulesManager } = this.props;
    let entries = [
      {
        text: formatMessage(intl, "profile", "menu.myProfile"),
        icon: <InsertEmoticon />,
        route: "/profile/myProfile",
      },
    ];

    this.isWorker
      ? entries.push({
          text: formatMessage(intl, "profile", "menu.changePassword"),
          icon: <Fingerprint />,
          route: "/profile/mobile/password",
        })
      : entries.push({
          text: formatMessage(
            this.props.intl,
            "profile",
            "menu.changePassword"
          ),
          icon: <Fingerprint />,
          route: "/profile/changePassword",
        });

    entries.push(
      ...modulesManager
        .getContribs(PROFILE_MAIN_MENU_CONTRIBUTION_KEY)
        .filter((c) => !c.filter || c.filter(rights))
    );

    return (
      <MainMenuContribution
        {...this.props}
        header={formatMessage(intl, "profile", "mainMenu")}
        icon={<AccountCircle />}
        entries={entries}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  rights: state.core?.user?.i_user?.rights ?? [],
});

export default injectIntl(withModulesManager(connect(mapStateToProps)(ProfileMainMenu)));
