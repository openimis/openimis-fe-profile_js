import ProfileMainMenu from "./components/ProfileMainMenu";
import { ChangePasswordPage } from "./components/ChangePasswordPage";
import messages_en from "./translations/en.json";

const ProfileModule = {
  "translations": [{ key: "en", messages: messages_en }],
  "core.Router": [
    { path: "profile/changePassword", component: ChangePasswordPage },
  ],
  "core.MainMenu": [ProfileMainMenu]
}

export { ProfileModule };
