import React from "react";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs-react";
import useToast from "../hooks/useToast";
import { useAuth } from "../utils/auth";
import { PWDREGEX } from "../config/regex";
import { validationMessages } from "../config/validationMessage";
import { messages } from "../config/messages";

export default function LoginPage() {
  const navigate = useNavigate();

  const auth = useAuth();
  const { showToast, toastMessage } = useToast();

  //yup validation
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup
      .string()
      .required()
      .max(32)
      .min(8)
      .matches(PWDREGEX, validationMessages.pwdIncoorect),
  });

  const onSubmit = async (submittedData) => {
    console.log("sfd");
    const response = await fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submittedData),
    });
    console.log("resposnse", response);
    const result = await response.json();
    console.log("resposnse", result);
    console.log("resposnse", result.data);
    // const allUsersData = JSON.parse(localStorage.getItem("users"));

    // finding the current login user
    // const userData = allUsersData?.filter((user) => {
    //   return user.email === submittedData.email;
    // });

    // if (userData?.length > 0) {
    //   // compare the password is same or not
    //   const result = bcrypt.compareSync(
    //     submittedData.password,
    //     userData[0].password
    //   );

    //   if (result) {
    //     // password match
    //     auth.login(userData[0]);

    //     navigate("/products", { replace: true });
    //   } else {
    //     showToast(messages.pwdNotMatch, "danger");
    //   }
    // } else {
    //   showToast(messages.userNotExists, "danger");
    // }
    // return;

    if (response.status === 404) {
      showToast(messages.userNotExists, "danger");
    } else if (response.status === 401) {
      showToast(messages.pwdNotMatch, "danger");
    } else {
      console.log("response", response);
      auth.login(result.data);
      navigate("/products", { replace: true });
    }
    return;
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  return (
    <div className="container h-100">
      {toastMessage.message && (
        <p className={`alert alert-${toastMessage.type}`}>
          {toastMessage.message}
        </p>
      )}
      <div className="row align-items-center" style={{ height: "100vh" }}>
        <div className="mx-auto col-10 col-md-8 col-lg-6">
          <form
            action="http://localhost:3000/user/login"
            method="POST"
            onSubmit={handleSubmit(onSubmit)}
            className="p-4 border rounded bg-white"
          >
            <h3 className="text-center mb-4">Login Form</h3>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                className="form-control"
                type="text"
                placeholder="Email"
                name="email"
                {...register("email")}
              />
              <div className="form-text">
                {errors.email && (
                  <p className="text-danger">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                className="form-control"
                type="password"
                placeholder="Password"
                name="password"
                {...register("password")}
              />

              <div className="form-text">
                {errors.password && (
                  <p className="text-danger">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="text-center mb-2">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
            <div className="text-center">
              Don't have an account? <Link to="/signup">Signup Here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
