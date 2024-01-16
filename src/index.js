import ProfileToolbarContribution from "./components/ProfileToolbarContribution";
import ProfileMainMenu from "./components/ProfileMainMenu";
import ChangePasswordPage from "./components/ChangePasswordPage";
import messages_en from "./translations/en.json";
import MyProfilePage from "./components/MyProfilePage";
import { reducer } from "./reducer";

const DEFAULT_CONFIG = {
  translations: [{ key: "en", messages: messages_en }],
  "core.Router": [
    { path: "profile/changePassword", component: ChangePasswordPage },
    { path: "profile/myProfile", component: MyProfilePage },
  ],
  "core.MainMenu": [ProfileMainMenu],
  reducers: [{ key: "profile", reducer }],
  "core.AppBar": [ProfileToolbarContribution]

};

export const ProfileModule = (cfg) => {
  let config = { ...DEFAULT_CONFIG, ...cfg };
  cfg?.AppBarMenuContribution === true ? config['core.MainMenu'] = [] : config['core.AppBar'] = []
  return { ...config, ...cfg };
};
