import Person2 from "@mui/icons-material/Person2";
import React, { useState } from "react";
import { MdLockOpen, MdMailOutline, MdPersonOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { updateAdminPassword, updateAdminProfile } from "../../Redux/slices/AdminLoginSlice";
import PanelLayout from "../../Shared/PanelLayout/PanelLayout";
import "./AdminProfile.css";
import { Dots } from "react-activity";
import "react-activity/dist/Dots.css";

const AdminProfile = () => {
  const dispatch = useDispatch();

  const { userInfo, authError, updatePasswordInProcess, updateProfileInProcess } = useSelector(
    (state) => state.admin
  );

  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [enableChange, setEnableChange] = useState(false);
  const [isUpdateEnable, setUpdateEnable] = useState(false);
  const [isEditEnable, setEditEnable] = useState(true);

  const editFunc = (e) => {
    e.preventDefault();
    setEnableChange(true);
    setUpdateEnable(true);
    setEditEnable(false);
  };

  const updateFunc = (e) => {
    e.preventDefault();
    setEnableChange(false);
    setUpdateEnable(false);
    setEditEnable(true);
    dispatch(updateAdminProfile({name, email}))
  };

  const updatePasswordFunc = (e) => {
    e.preventDefault();
    dispatch(
      updateAdminPassword({ oldPassword, newPassword, confirmPassword })
    );
  };
  return (
    <PanelLayout
      PanelName={"Profile"}
      ShowProfileIcon={true}
      MainLayout={
        <div className="main">
          <div className="details">
            <div>
              <Person2 />
            </div>
            <div className="forms">
              <form>
                <div>
                  <p>ID:</p>
                  <p>{userInfo._id}</p>
                </div>
                <div>
                  <MdPersonOutline />
                  <input
                    type={"text"}
                    placeholder="Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={enableChange || updateProfileInProcess ? false : true}
                  />
                </div>
                <div>
                  <MdMailOutline />
                  <input
                    type={"email"}
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={enableChange || updateProfileInProcess ? false : true}
                  />
                </div>

                <input
                  onClick={editFunc}
                  type={"button"}
                  value={"Edit"}
                  disabled={isEditEnable || updateProfileInProcess ? false : true}
                />
                <input
                  onClick={updateFunc}
                  type={"submit"}
                  value={"Update"}
                  disabled={isUpdateEnable || updateProfileInProcess ? false : true}
                />
                {updateProfileInProcess && (

                  <Dots color="rgba(0, 0, 0, 0.6)" size={10} />
                )}

              </form>
              <form>
                <div>
                  <p>Change Password</p>
                </div>
                <div>
                  <MdLockOpen />
                  <input
                    type={"password"}
                    placeholder="Current Password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    disabled={updatePasswordInProcess ? true : false}
                  />
                </div>
                <div>
                  <MdLockOpen />
                  <input
                    type={"password"}
                    placeholder="New Password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={updatePasswordInProcess ? true : false}
                  />
                </div>
                <div>
                  <MdLockOpen />
                  <input
                    type={"password"}
                    placeholder="Retype Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={updatePasswordInProcess ? true : false}
                  />
                </div>
                <p>Forgot Password?</p>
                <input
                  onClick={updatePasswordFunc}
                  type={"submit"}
                  value={"Update Password"}
                  disabled={updatePasswordInProcess ? true : false}
                />

                  {updatePasswordInProcess && (
                  <Dots color="rgba(0, 0, 0, 0.6)" size={10} />
                  )}
                {authError && <p className="error">{authError}</p>}

              </form>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default AdminProfile;
