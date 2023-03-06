import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { loadAdmin } from "../Redux/slices/AdminLoginSlice";
import { useDispatch } from "react-redux";

const ProtectedRoute = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadAdmin());
  }, [dispatch]);

  const navigate = useNavigate();
  const { loading, isAdmin } = useSelector((state) => state.admin);

  return (
    <>
      {!loading && isAdmin ? (
        <Outlet />
      ) : (
        navigate("/admin/login", { replace: true })
      )}
    </>
  );
};

export default ProtectedRoute;
