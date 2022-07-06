import React from "react";
import apiClient from "../../http-common";

export type UserProfileInterface = { 
    initialized: boolean; 
    loggedIn: boolean; 
    user: string; 
    id: string;
    token: string;
    last_login: string;
    status: string;
    about_me: string;
    image: string;
};

type MyContextInterface = {
  authInfo: UserProfileInterface;
  initialize: () => Promise<boolean>;
  logOut: () => Promise<boolean>;
  logIn: (user: string, password: string) => Promise<boolean>;
};

// create the context
export const AuthContext = React.createContext<MyContextInterface | undefined>(
  undefined
);

// create the context provider, we are using use state to ensure that
// we get reactive values from the context...
type Props = {
  children: React.ReactNode;
};
export const AuthProvider: React.FC = (props: any) => {
  // the reactive values
  const [authInfo, setAuthInfo] = React.useState<UserProfileInterface>();

  const logOut = () => {
    return new Promise((resolve) => {
      window.localStorage.removeItem("AUTH");
      setAuthInfo({ 
          initialized: true, 
          loggedIn: false,
          user: "", 
          id: "",
          token: "",
          last_login: "",
          status: "",
          about_me: "",
          image: "http://cyberpunk2077-larp.de/images/logos/Samurai_Logo.webp"
      });
      setTimeout(() => {
        return resolve(true);
      }, 1000);
    });
  };

  const logIn = (user: string, password: string) => {
    return new Promise((resolve) => {
      apiClient.post('/login', {
        user: user,
        password: password
      })
      .then((response) => {
        console.log(response.data[0])
        let v = response.data[0]
        setAuthInfo(v);
        window.localStorage.setItem("AUTH", JSON.stringify(v));
      })
      .catch((error) => {
        console.log(error);
      });

      let v = {
        initialized: true,
        loggedIn: true,
        user: user, 
        id: "",
        last_login: new Date().getTime() + "",
        token: "",
        status: "",
        about_me: "",
        image: "http://cyberpunk2077-larp.de/images/logos/Samurai_Logo.webp",
      };
      setAuthInfo(v);
      window.localStorage.setItem("AUTH", JSON.stringify(v));
      setTimeout(() => {
        return resolve(true);
      }, 1000);
    });
  };

  const initialize = () => {
    return new Promise((resolve) => {
    let response = window.localStorage.getItem("AUTH") || null;
    if (response && response !== null && response !== 'undefined') {
        try {
            let resp = JSON.parse(response)
            setAuthInfo({
                initialized: true,
                loggedIn: true,
                user: resp.user,
                id: resp.id,
                token: resp.token,
                last_login: resp.last_login,
                status: resp.status,
                about_me: resp.about_me,
                image: resp.image,
              });
              setTimeout(() => {
                return resolve(true);
              }, 1000);
        } catch (error) {
            return resolve(false);
        }
    } else {
      setAuthInfo({
        initialized: true,
        loggedIn: false,
        user: "",
        id: "",
        token: "",
        last_login: new Date().getTime() + "",
        status: "",
        about_me: "",
        image: "http://cyberpunk2077-larp.de/images/logos/Samurai_Logo.webp"
      });
      setTimeout(() => {
        return resolve(false);
      }, 1000);
    }});
  };

  let v = {
    authInfo,
    logOut: logOut,
    logIn: logIn,
    initialize,
  };

  return <AuthContext.Provider value={v} {...props} />;
};

export const useAuth = () => React.useContext(AuthContext);