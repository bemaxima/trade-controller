import React from 'react';
import { useUserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';

const UserInfo: React.FC = () => {
  const { data: user } = useUserContext();
  return (
    <div>
      <label>{`Welcome ${user.name || user.username || 'guest'}`}</label>&nbsp;
      {user.loggedIn && <Link to="/dashboard/signout">sign out</Link>}
      {!user.loggedIn && <Link to="/guest/signin">sign in</Link>}
    </div>
  )
}

export default UserInfo;