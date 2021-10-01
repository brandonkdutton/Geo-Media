import React from "react";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import Amplify, { Auth } from "aws-amplify";
import awsExports from "../../aws-exports";

Amplify.configure(awsExports);

function App() {
  const jwtChallenge = (): void => {
    Auth.currentSession()
      .then((res) => {
        const accessToken = res.getIdToken();
        console.log(accessToken.payload);
        return accessToken.getJwtToken();
      });
  };

  return (
    <>
      <AmplifySignOut />
      <button onClick={jwtChallenge}>validate jwt</button>
    </>
  );
}

export default withAuthenticator(App);
