# openIMIS Frontend Profile reference module
This repository holds the files of the openIMIS Frontend Profile reference module.
It is dedicated to be deployed as a module of [openimis-fe_js](https://github.com/openimis/openimis-fe_js).

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/openimis/openimis-fe-profile_js.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/openimis/openimis-fe-profile_js/alerts/)

## Main Menu Contributions
* **Profile** (`profile.mainMenu` translation key)

  **Change Password**, (`profile.menu.changePassword` translation key), pointing to `/ChangePassword.aspx` legacy openIMIS (via proxy page)

## Other Contributions
* `core.Router`, registering `profile/changePassword` route in openIMIS client-side router

## Available Contribution Points
* `profile.MainMenu`: ability to add entries within the profile main menu entry

## Published Components
None

## Dispatched Redux Actions
None

## Other Modules Listened Redux Actions
None

## Configurations Options

* `AppBarMenuContribution` - if set to true Profile is added as an AppBar icon instead of being main menu contribution
