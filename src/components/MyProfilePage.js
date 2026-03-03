import React, { useEffect, useMemo, useState } from "react";
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import {
  ControlledField,
  Form,
  FormattedMessage,
  ProgressOrError,
  ROWS_PER_PAGE_OPTIONS,
  SelectInput,
  TextInput,
  loadUser,
  useGraphqlMutation,
} from "@openimis/fe-core";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "../action";

const useStyles = makeStyles((theme) => ({
  page: theme.page,
  container: {
    maxHeight: 700,
  },
}));

const MyProfileHeadPanel = ({ edited, onEditedChanged, readOnly }) => {
  const classes = useStyles();

  const { regions, districts } = useMemo(() => {
    const computedRegions = [];
    const computedDistricts = [];
    const locations = edited?.iUser?.userdistrictSet ?? [];
    locations.forEach((locationRef) => {
      const location = locationRef?.location;
      if (location?.name && !computedDistricts.includes(location.name)) {
        computedDistricts.push(location.name);
      }
      if (location?.parent?.name && !computedRegions.includes(location.parent.name)) {
        computedRegions.push(location.parent.name);
      }
    });
    return { regions: computedRegions, districts: computedDistricts };
  }, [edited]);

  return (
    <Grid container spacing={2}>
      <ControlledField
        module="profile"
        id="userName"
        field={
          <Grid item xs={4}>
            <TextInput module="profile" label="userName" value={edited?.username} readOnly />
          </Grid>
        }
      />
      <ControlledField
        module="profile"
        id="otherNames"
        field={
          <Grid item xs={4}>
            <TextInput module="profile" label="otherNames" value={edited?.otherNames} readOnly />
          </Grid>
        }
      />
      <ControlledField
        module="profile"
        id="LastName"
        field={
          <Grid item xs={4}>
            <TextInput module="profile" label="lastName" value={edited?.lastName} readOnly />
          </Grid>
        }
      />
      <ControlledField
        module="profile"
        id="email"
        field={
          <Grid item xs={4}>
            <TextInput module="profile" label="email" value={edited?.email} readOnly />
          </Grid>
        }
      />
      <ControlledField
        module="profile"
        id="phone"
        field={
          <Grid item xs={4}>
            <TextInput module="profile" label="phone" value={edited?.phone} readOnly />
          </Grid>
        }
      />
      <ControlledField
        module="profile"
        id="language"
        field={
          <Grid item xs={4}>
            <TextInput module="profile" label="language" value={edited?.iUser?.language?.name} readOnly />
          </Grid>
        }
      />
      <Grid item xs={4}>
        <SelectInput
          module="profile"
          label="defaultRowsPerPage"
          readOnly={readOnly}
          options={ROWS_PER_PAGE_OPTIONS.map((value) => ({ value, label: `${value}` }))}
          value={edited?.iUser?.defaultRowsPerPage ?? null}
          onChange={(defaultRowsPerPage) =>
            onEditedChanged({
              ...edited,
              iUser: {
                ...edited?.iUser,
                defaultRowsPerPage: defaultRowsPerPage || null,
              },
            })
          }
        />
      </Grid>
      <Grid item xs={4}>
        <TableContainer component={Paper} className={classes.container}>
          <Table stickyHeader size="small" aria-label="Assigned Roles">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>
                  <FormattedMessage module="profile" id="roles" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(edited?.iUser?.roles ?? []).map((role) => (
                <TableRow key={role.name}>
                  <TableCell component="th" scope="row">
                    {role.name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={4}>
        <TableContainer component={Paper} className={classes.container}>
          <Table stickyHeader size="small" aria-label="Assigned Regions">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>
                  <FormattedMessage module="profile" id="regions" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {regions.map((region) => (
                <TableRow key={region}>
                  <TableCell component="th" scope="row">
                    {region}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={4}>
        <TableContainer component={Paper} className={classes.container}>
          <Table stickyHeader size="small" aria-label="Assigned Districts">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>
                  <FormattedMessage module="profile" id="districts" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {districts.map((district) => (
                <TableRow key={district}>
                  <TableCell component="th" scope="row">
                    {district}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

const MyProfilePage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const fetchingUser = useSelector((store) => store.profile.fetchingUser);
  const errorUser = useSelector((store) => store.profile.errorUser);
  const user = useSelector((store) => store.profile.user);
  const [editedUser, setEditedUser] = useState(null);
  const [reset, setReset] = useState(0);
  const { mutate } = useGraphqlMutation(
    `
      mutation ($input: ChangeCurrentInteractiveUserMutationInput!) {
        changeCurrentInteractiveUser(input: $input) {
          internalId
          clientMutationId
        }
      }
    `,
    { type: "PROFILE_DEFAULT_ROWS_PER_PAGE_MUTATION" },
  );

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setEditedUser(user);
      setReset((prev) => prev + 1);
    }
  }, [user]);

  const canSave = useMemo(() => {
    const editedDefaultRowsPerPage = editedUser?.iUser?.defaultRowsPerPage;
    const currentDefaultRowsPerPage = user?.iUser?.defaultRowsPerPage;
    if (!ROWS_PER_PAGE_OPTIONS.includes(editedDefaultRowsPerPage)) return false;
    return editedDefaultRowsPerPage !== currentDefaultRowsPerPage;
  }, [editedUser, user]);

  const save = (edited) => async () => {
    const defaultRowsPerPage = edited?.iUser?.defaultRowsPerPage;
    if (!ROWS_PER_PAGE_OPTIONS.includes(defaultRowsPerPage)) return;
    try {
      await mutate({ defaultRowsPerPage });
      await dispatch(fetchRoles());
      await dispatch(loadUser());
    } catch (error) {
      // keep current profile data if mutation fails
    }
  };

  return (
    <div className={classes.page}>
      <ProgressOrError progress={fetchingUser} error={errorUser} />
      {!!editedUser && (
        <Form
          module="profile"
          title="MyProfilePage.title"
          edited={editedUser}
          reset={reset}
          canSave={() => canSave}
          save={save}
          onEditedChanged={setEditedUser}
          HeadPanel={MyProfileHeadPanel}
        />
      )}
    </div>
  );
};

export default MyProfilePage;
