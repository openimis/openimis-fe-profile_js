/* eslint-disable import/no-extraneous-dependencies -- Vitest runs from the frontend assembly */
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders, screen, userEvent } from "@openimis/fe-core/testing";

import ChangePasswordPage from "./ChangePasswordPage";
import messages from "../translations/en.json";

const { mutate, history } = vi.hoisted(() => ({ mutate: vi.fn(), history: { push: vi.fn() } }));

// Only the fe-core exports this page reaches; the barrel cannot load in a test.
vi.mock("@openimis/fe-core", async () => {
  const ReactActual = (await import("react")).default;
  const en = (await import("../translations/en.json")).default;
  return {
    useGraphqlMutation: () => ({ isLoading: false, mutate }),
    useTranslations: (prefix) => ({ formatMessage: (key) => en[`${prefix}.${key}`] ?? key }),
    useModulesManager: () => ({}),
    useAuthentication: () => ({}),
    TextInput: ({ module, label, type, onChange }) =>
      ReactActual.createElement("input", {
        "aria-label": en[`${module}.${label}`],
        type,
        onChange: (e) => onChange(e.target.value),
      }),
    withHistory: (Component) => (props) => ReactActual.createElement(Component, { ...props, history }),
    withModulesManager: (Component) => Component,
  };
});

const ERROR = messages["profile.ChangePasswordPage.error"];

const submit = async () => {
  renderWithProviders(<ChangePasswordPage />, { messages });
  await userEvent.type(screen.getByLabelText(messages["profile.ChangePasswordPage.oldPasswordLabel"]), "old");
  await userEvent.type(screen.getByLabelText(messages["profile.ChangePasswordPage.newPasswordLabel"]), "new");
  await userEvent.type(screen.getByLabelText(messages["profile.ChangePasswordPage.confirmPasswordLabel"]), "new");
  await userEvent.click(screen.getByRole("button", { name: messages["profile.ChangePasswordPage.submitButton"] }));
};

describe("ChangePasswordPage", () => {
  beforeEach(() => {
    mutate.mockReset();
    history.push.mockReset();
  });

  it("shows an error when the server refused the mutation", async () => {
    mutate.mockRejectedValue(new Error("Bad Request"));

    await submit();

    expect(mutate).toHaveBeenCalledWith({ oldPassword: "old", newPassword: "new" });
    expect(await screen.findByText(ERROR)).toBeInTheDocument();
    expect(history.push).not.toHaveBeenCalled();
  });

  it("shows an error when the mutation yields nothing", async () => {
    // What the page got when the server answered 400 to the enriched operation.
    mutate.mockResolvedValue(undefined);

    await submit();

    expect(await screen.findByText(ERROR)).toBeInTheDocument();
    expect(history.push).not.toHaveBeenCalled();
  });

  it("shows the error the server reported", async () => {
    mutate.mockResolvedValue({ changePassword: { success: false, error: "Failed to change user password" } });

    await submit();

    expect(await screen.findByText("Failed to change user password")).toBeInTheDocument();
    expect(history.push).not.toHaveBeenCalled();
  });

  it("leaves the page once the password is changed", async () => {
    mutate.mockResolvedValue({ changePassword: { success: true, error: null } });

    await submit();

    expect(history.push).toHaveBeenCalledWith("/");
    expect(screen.queryByText(ERROR)).not.toBeInTheDocument();
  });
});
