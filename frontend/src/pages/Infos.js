import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./Infos.css";
import { getToken } from '../tokenservice';

const Infos = () => {
  const [existingUserData, setExistingUserData] = useState({
    "id": "",
    "username": "",
    "email": "",
    "password": "",
    "firstName": "",
    "lastName": "",
    "address": "",
    "city": "",
    "phone": 0,
    "role": {
      "id": "",
      "erole": [
      ]
    }
  });

  useEffect(() => {
    // localStorage.getItem("username")
    fetchUserData('aafaf');
  }, []);

  const fetchUserData = async (username) => {
    try {
      const tokenPromise = getToken();
      const token = await tokenPromise;
      const formattedToken = JSON.parse(token);
      if (token) {
        console.log("Token retrieved successfully");
        const response = await fetch(
          "http://localhost:5555/api/users/" + username,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${formattedToken}`,
            },
          }
        );

        const data = await response.json();
        console.log("Existing user data:", data);
        setExistingUserData(data)
        return data; // Return the fetched user data
      } else {
        console.log("Token is not available or expired");
        return null;
      }
    } catch (error) {
      console.log("Error occurred during fetch: ", error);
      return null;
    }
    return {
      password: "password",
      address: "123 Main St",
      email: "existinguser@example.com",
      city: "City",
      phone: "123-456-7890",
    };
  };

  const validationSchema = Yup.object({
    password: Yup.string().required("Password is required"),
    address: Yup.string().required("Address is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    city: Yup.string().required("City is required"),
    phone: Yup.string().required("Phone is required"),
  });

  const onSubmitModify = (values, { setSubmitting }) => {
    if (Formik.setSubmitting) {
      return;
    }
    fetch("http://localhost:5555/api/auth/update", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from server: ", data);
        setSubmitting(false);
      })
      .catch((err) => {
        console.log("Error occurred during fetch: ", err);
        setSubmitting(false);
      });
  };

  return (
    <div className="update-form-container">
      <h2 className="title">Modifier les informations:</h2>
      <div className="form-container">
        <Formik
          initialValues={existingUserData}
          validationSchema={validationSchema}
          onSubmit={onSubmitModify}
        >
          {() => (
            <Form>
              <div className="form-line">
                <div className="input-container long-input">
                  <label htmlFor="username">Username:</label>
                  <Field type="text" id="username" name="username" value={existingUserData.username} />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="error-message"
                  />
                </div>
              </div>
              <div className="form-line">
                <div className="input-container">
                  <label htmlFor="city">First Name:</label>
                  <Field type="text" id="firstname" name="firstname" value={existingUserData.firstName} />
                  <ErrorMessage
                    name="firstname"
                    component="div"
                    className="error-message"
                  />
                </div>
                <div className="input-container">
                  <label htmlFor="phone">Last Name:</label>
                  <Field type="text" id="phone" name="phone" value={existingUserData.lastName} />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="error-message"
                  />
                </div>
              </div>
              {/* <div className="form-line">
                <div className="input-container">
                  <label htmlFor="password">Mot de passe:</label>
                  <Field type="password" id="password" name="password" />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error-message"
                  />
                </div>
              </div> */}
              <div className="form-line">
                <div className="input-container long-input">
                  <label htmlFor="email">Email:</label>
                  <Field type="email" id="email" name="email" value={existingUserData.email} />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-message"
                  />
                </div>
              </div>
              <div className="form-line">
                <div className="input-container long-input">
                  <label htmlFor="address">Adresse:</label>
                  <Field type="text" id="address" name="address" value={existingUserData.address} />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="error-message"
                  />
                </div>
              </div>
              <div className="form-line">
                <div className="input-container">
                  <label htmlFor="city">Ville:</label>
                  <Field type="text" id="city" name="city" value={existingUserData.city} />
                  <ErrorMessage
                    name="city"
                    component="div"
                    className="error-message"
                  />
                </div>
                <div className="input-container">
                  <label htmlFor="phone">Téléphone:</label>
                  <Field type="text" id="phone" name="phone" value={existingUserData.phone} />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="error-message"
                  />
                </div>
              </div>
              <div className="form-line button-update">
                <button type="submit">Modifier</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Infos;
