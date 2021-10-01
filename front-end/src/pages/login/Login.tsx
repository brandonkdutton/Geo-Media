import React from "react";
import { Grid, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { withAuthenticator } from "@aws-amplify/ui-react";
import Amplify, { Auth } from "aws-amplify";
import awsExports from "../../aws-exports";

Amplify.configure(awsExports);

const logout = async () => {
  await Auth.signOut();
  window.location.reload();
};

function App() {
  return (
    <Grid
      container
      style={{ height: "100vh" }}
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid item>
        <Button color="primary" component={Link} to="/">
          Continue to app
        </Button>
      </Grid>
      <Grid item>
        <Button color="primary" onClick={logout}>
          Logout
        </Button>
      </Grid>
    </Grid>
  );
}

export default withAuthenticator(App);
