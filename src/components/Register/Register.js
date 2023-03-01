import React, { useState } from "react";
import "./Register.css";
import logo from "../../logo.png";
import { MdMailOutline, MdLockOpen, MdInfo } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin, loadAdmin } from "../../Redux/slices/AdminLoginSlice";
import { Dots } from "react-activity";
import "react-activity/dist/library.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, authError, isAdmin, accessError } = useSelector(
    (state) => state.admin
  );
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [code, setCode] = useState(null);
  const [showCodeScreen, setShowCodeScreen] = useState(true);

  const verifyMail = () => {
    console.log(code);
  };

  const submitForm = (e) => {
    e.preventDefault();
    // dispatch(adminLogin({ email: loginEmail, password: loginPassword }));
  };

  //   useEffect(() => {
  //     dispatch(loadAdmin())
  //     if(isAdmin){
  //       navigate('/admin/dashboard')
  //     }
  //   }, [dispatch, navigate, isAdmin])
  return (
    <div className="Login">
      <div className="logo-container">
        <img src={logo} className="logo" />
      </div>
      <div className="mobile-text">
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          <img src={logo} className="logo" />
        </div>
        <p style={{ textAlign: "center" }}>
          Open in Laptop or PC for best user experience..
        </p>
      </div>
      
      {showCodeScreen ? (
        <form className="Login-form">
          <p>Register</p>
          <div>
            <MdInfo/>
            <input
              type={"text"}
              placeholder="Code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={loading ? true : false}
            />
          </div>

          {loading && (
            <div className="loading">
              <Dots />
            </div>
          )}
          <input
            type={"submit"}
            value={"Verify"}
            className="loginBtn"
            onClick={verifyMail}
          />
        </form>
      ) : (
<form className="Login-form">
        <p>Register</p>
        <div>
          <MdMailOutline />
          <input
            type={"email"}
            placeholder="Email"
            required
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            disabled={loading ? true : false}
          />
        </div>
        <div>
          <MdLockOpen />
          <input
            type={"password"}
            placeholder="Password"
            required
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            disabled={loading ? true : false}
          />
        </div>
        {loading && (
          <div className="loading">
            <Dots />
          </div>
        )}
        <input
          type={"submit"}
          value={"Register"}
          className="loginBtn"
          onClick={submitForm}
        />
        {authError && <p className="error">{authError}...</p>}
        {accessError && <p className="error">{accessError}...</p>}
      </form>
      )}
    </div>
  );
};

export default Register;
