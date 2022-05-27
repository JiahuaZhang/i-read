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