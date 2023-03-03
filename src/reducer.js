import { formatGraphQLError, formatServerError } from "@openimis/fe-core";

export function reducer(
  state = {
    fetchingUser: null,
    fetchedUser: null,
    user: null,
    errorUser: null,
  },
  action
) {
  switch (action.type) {
    case "PROFILE_ROLES_REQ":
      return {
        ...state,
        fetchingUser: true,
        fetchedUser: false,
        user: null,
        errorUser: null,
      };
    case "PROFILE_ROLES_RESP":
      return {
        ...state,
        fetchingUser: false,
        fetchedUser: true,
        user: action.payload.data.user,
        errorUser: formatGraphQLError(action.payload),
      };
    case "PROFILE_ROLES_ERR":
      return {
        ...state,
        fetchingUser: false,
        errorUser: formatServerError(action.payload),
      };

    default:
      return state;
  }
}
