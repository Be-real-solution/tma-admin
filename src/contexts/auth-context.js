import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
const BaseUrl = process.env.NEXT_PUBLIC_ANALYTICS_BASEURL;
import { useRouter } from "next/navigation";

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;
      let user = {};

    try {
      isAuthenticated = JSON.parse(window.sessionStorage.getItem("authenticated")) || false;
      user = JSON.parse(window.sessionStorage.getItem("user")) || false;
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user
      });
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );



  const signIn = async (email, password) => {

    try {
             const res = await fetch(`${BaseUrl}/admin/sign-in`, {
               headers: {
                 Accept: "application/json",
                 "Content-Type": "application/json",
                //  lang: "uz",
               },
               method: "POST",
               body: JSON.stringify({
                username: email,
             password: password,
           }),
             });

             const req = await res.json();
             console.log(req);
             
             if (req.status === 200) {
               window.sessionStorage.setItem("authenticated", JSON.stringify(req?.data?.tokens.accessToken));
               window.sessionStorage.setItem("user", JSON.stringify(req?.data?.admin));
               router.push('/buildings');

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: req?.data?.admin,
    });
             } else {
               throw new Error(req.message);
             }
          
    
    } catch (err) {
      console.error(err.message);
       throw new Error(err.message);
    }


  };



  const signOut = () => {
    window.sessionStorage.removeItem("authenticated")
    window.sessionStorage.removeItem("user")
    dispatch({
      type: HANDLERS.SIGN_OUT
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
