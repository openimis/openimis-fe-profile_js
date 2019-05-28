import { ProfileMainMenu } from "./components/ProfileMainMenu";
import { ChangePasswordPage } from "./components/ChangePasswordPage";

const ProfileModule = {
  "core.Router": [
    { path: "profile/changePassword", component: ChangePasswordPage },
  ],
  "core.MainMenu": [ProfileMainMenu]
}

export { ProfileModule };
