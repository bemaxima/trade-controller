import React, { useEffect } from 'react';
import { useUserContext } from '../UserContext';
import * as service from '../service';

const SignOut: React.FC = () => {
  const { setData: setUser } = useUserContext();

  useEffect(
    () => {
      window.localStorage.removeItem('at')
      service.signOut(
        window.localStorage.getItem('rt')
      ).then(
        () => {
          setUser({
            loggedIn: false,
            name: '',
            username: '',
            userId: null
          });
        }
      )
    },
    [setUser]
  );
  return null;
}

export default SignOut;