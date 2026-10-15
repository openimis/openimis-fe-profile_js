import React, { useState, useMemo } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";

import { Box, Button, Paper, Typography, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  useGraphqlMutation,
  useTranslations,
  useModulesManager,
  TextInput,
  useAuthentication,
  withHistory,
  withModulesManager,
} from "@openimis/fe-core";

const StyledPage = styled(Box)(({ theme }) => ({
  ...theme.page ?? {},
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  ...theme.paper?.paper ?? {},
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  ...theme.paper?.title ?? {},
}));

const ChangePasswordPage = (props) => {
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations("profile.ChangePasswordPage", modulesManager);
  const [formValues, setFormValues] = useState({});
  const [error, setError] = useState("");

  const isValid = useMemo(
    () => formValues.password && formValues.password === formValues.confirmPassword && formValues.oldPassword,
    [formValues]
  );

  const { mutate, isLoading } = useGraphqlMutation(
    `
    mutation changePassword ($input: ChangePasswordMutationInput!) {
      changePassword(input: $input) {
        clientMutationId
        success
        error
      }
    }
  `,
    // The label is what the journal entry shows. The mutation runs inline and
    // answers with its own success flag, so fe-core journals it as finished
    // rather than adding a pending entry it would then poll for ever.
    { wait: false, clientMutationLabel: formatMessage("mutationLabel") }
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isValid) {
      setError(null);
      const result = await mutate({
        oldPassword: formValues.oldPassword,
        newPassword: formValues.password,
      });

      const failure = result.changePassword?.error;
      setError(failure);
      if (!failure) {
        // Confirmation itself is not this page's job: the mutation is journalled
        // like any other and the journal raises the notice. Leaving the user on
        // a form still holding both passwords is, hence the navigation.
        props.history.push("/");
      }
    }
  };

  return (
    <StyledPage>
      <StyledPaper>
        <StyledTitle variant="h6">
          {formatMessage("title")}
        </StyledTitle>
        <Box padding="10px">
          <form onSubmit={onSubmit}>
            <Grid container spacing={2}>
              <Grid size={4}>
                <TextInput
                  module="profile"
                  required
                  readOnly={isLoading}
                  type="password"
                  label={"ChangePasswordPage.oldPasswordLabel"}
                  onChange={(oldPassword) => setFormValues({ ...formValues, oldPassword })}
                />
              </Grid>
              <Grid size={4}>
                <TextInput
                  module="profile"
                  required
                  readOnly={isLoading}
                  type="password"
                  label={"ChangePasswordPage.newPasswordLabel"}
                  onChange={(password) => setFormValues({ ...formValues, password })}
                />
              </Grid>
              <Grid size={4}>
                <TextInput
                  module="profile"
                  readOnly={isLoading}
                  required
                  type="password"
                  label={"ChangePasswordPage.confirmPasswordLabel"}
                  onChange={(confirmPassword) => setFormValues({ ...formValues, confirmPassword })}
                />
              </Grid>
              {formValues.password !== formValues.confirmPassword && formValues.confirmPassword && formValues.password && (
                <Grid size={12}>
                  <Box color="error.main">{formatMessage("notEqualError")}</Box>
                </Grid>
              )}
              {error && (
                <Grid size={12}>
                  <Box color="error.main">{error}</Box>
                </Grid>
              )}
              <Grid>
                <Button type="submit" color="primary" variant="contained" disabled={!isValid || isLoading}>
                  {formatMessage("submitButton")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </StyledPaper>
    </StyledPage>
  );
};

const mapStateToProps = (state) => ({
  module: state.core?.savedPagination?.module,
  user: state.core?.user,
});
const mapDispatchToProps = null;

export default withHistory(
  withModulesManager(
    connect(mapStateToProps, mapDispatchToProps)(injectIntl(ChangePasswordPage)),
  ),
);