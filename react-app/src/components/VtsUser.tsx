import React from 'react';
import './VtsUser.css'; // Import the CSS file where the reusable class is defined

const VtsUser: React.FC = () => {

  type VtsProps = {
    branchId: string,
    role: number
  };

  type User = {
    sub: string
    name: string,
    family_name: string, 
    given_name: string,
    email: string,
    picture: string,
    email_verified: boolean,
    vts : VtsProps
  };

  function getCookie(name: string) {
    let cookieArr = document.cookie.split(";");
    for(let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if(name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
  };

  
  const userCookie = getCookie("user") ?? "";
  let userJson: User | null = userCookie.length > 2 ? JSON.parse(userCookie) as User : null; 
  const isLoggedIn = userJson != null;

  return (
    <div className='vtsuser flex-item'>
        { !isLoggedIn && 
          <a href='/auth/google'>Sign-in</a>
        }
        { isLoggedIn && 
          <div>Welcome, {userJson?.name} | {userJson?.vts?.branchId}. <a href='/auth/logout'>Logout</a></div>
        }
    </div>
  );
}

export default VtsUser;

