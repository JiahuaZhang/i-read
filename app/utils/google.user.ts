import jwtDecode, { type JwtPayload } from 'jwt-decode';

type User = {
  email: string;
  exp: Date;
  name: string;
  picture: string;
};

export const getUserFromJwt = (jwt: string): User => {
  const decoded = jwtDecode<{ [key: string]: string; } & JwtPayload>(jwt);
  const { email = '', exp = 0, name = '', picture = '' } = decoded;
  return { email, exp: new Date(exp * 1000), name, picture };
};

export const isValid = (user: User) => {
  const now = new Date();
  if (now.getTime() > user.exp.getTime()) {
    return false;
  }

  return true;
};

// useGoogleOneTapLogin({
  //   onSuccess: (credentialResponse) => {
  //     console.log(credentialResponse);
  //   },
  //   onError: () => {
  //     console.log("fail to login");
  //   },
  // });

// const response = await createUserSession({
//   request: new Request(""),
//   userId: user.id,
//   remember: false,
//   redirectTo: "/",
// });