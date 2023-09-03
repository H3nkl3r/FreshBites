import React, { useState } from "react";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import UpgradeToPremiumDialog from "../components/visitor/UpgradeToPremium";

export const LoginContext = React.createContext({});

const LoginProvider = ({ children }) => {
  const [openLogin, setOpenLogin] = useState(false);

  const handleClickOpenLogin = () => {
    setOpenLogin(true);
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  const [openRegister, setOpenRegister] = useState(false);

  const handleClickOpenRegister = () => {
    setOpenRegister(true);
  };

  const handleCloseRegister = () => {
    setOpenRegister(false);
  };

  const [openUpgrade, setOpenUpgrade] = useState(false);

  const handleClickOpenUpgrade = () => {
    setOpenUpgrade(true);
  };

  const handleCloseUpgrade = () => {
    setOpenUpgrade(false);
  };
  const loginContextValue = {
    handleClickOpenLogin,
    handleClickOpenUpgrade,
    handleClickOpenRegister,
  };
  return (
    <LoginContext.Provider value={loginContextValue}>
      {children}
      <Login
        open={openLogin}
        handleClose={handleCloseLogin}
        openRegister={handleClickOpenRegister}
      />
      <Register
        open={openRegister}
        handleClose={handleCloseRegister}
        openUpgrade={handleClickOpenUpgrade}
      />
      <UpgradeToPremiumDialog open={openUpgrade} onClose={handleCloseUpgrade} />
    </LoginContext.Provider>
  );
};

export default LoginProvider;
