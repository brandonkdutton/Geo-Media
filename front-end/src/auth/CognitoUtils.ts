import { Auth } from "aws-amplify";

export const fetchCognitoJWT = async (): Promise<string | null> => {
  const jwtToken: string | null = await Auth.currentSession()
    .then((res) => {
      const accessToken = res.getIdToken();
      return accessToken.getJwtToken();
    })
    .catch((error) => {
      return null;
    });

  return jwtToken;
};
