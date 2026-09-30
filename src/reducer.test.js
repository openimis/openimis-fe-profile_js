import {
  describe, expect, it, vi,
} from "vitest";

// fe-core's barrel imports itself, so the real helpers come from their defining modules.
vi.mock("@openimis/fe-core", async () => vi.importActual("@openimis/fe-core/helpers/api"));

const { reducer } = await import("./reducer");
const { graphqlErrors, serverError } = await import("@openimis/fe-core/testing");

const initial = () => reducer(undefined, { type: "@@INIT" });
const dispatch = (state, type, payload) => reducer(state, { type, payload });

const USER = { username: "admin", iUser: { roles: [{ id: "1", name: "IMIS Administrator" }] } };

describe("profile reducer", () => {
  it("forgets the previous user while the profile is loading", () => {
    const state = dispatch({ ...initial(), user: USER, errorUser: { code: 500 } }, "PROFILE_ROLES_REQ");

    expect(state).toEqual({ fetchingUser: true, fetchedUser: false, user: null, errorUser: null });
  });

  it("stores the user the server returns", () => {
    const state = dispatch(dispatch(initial(), "PROFILE_ROLES_REQ"), "PROFILE_ROLES_RESP", { data: { user: USER } });

    expect(state).toEqual({ fetchingUser: false, fetchedUser: true, user: USER, errorUser: null });
  });

  it("reports GraphQL errors returned alongside the data", () => {
    const state = dispatch(initial(), "PROFILE_ROLES_RESP", { data: { user: null }, ...graphqlErrors("denied") });

    expect(state.errorUser).toMatchObject({ detail: "denied" });
  });

  it("stops loading and reports a transport failure", () => {
    const state = dispatch(
      dispatch(initial(), "PROFILE_ROLES_REQ"),
      "PROFILE_ROLES_ERR",
      serverError(500, "Internal Server Error", "boom"),
    );

    expect(state.fetchingUser).toBe(false);
    expect(state.errorUser).toEqual({ code: 500, message: "Internal Server Error", detail: "boom" });
  });
});
