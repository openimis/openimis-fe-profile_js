import ProfileMainMenu from "./components/ProfileMainMenu";
import { ChangePasswordPage } from "./components/ChangePasswordPage";
import messages_en from "./translations/en.json";

const DEFAULT_CONFIG = {
  "translations": [{ key: "en", messages: messages_en }],
  "core.Router": [
    { path: "profile/changePassword", component: ChangePasswordPage },
  ],
  "core.MainMenu": [ProfileMainMenu]
}

export const ProfileModule = (cfg) => {
  return { ...DEFAULT_CONFIG, ...cfg };
}