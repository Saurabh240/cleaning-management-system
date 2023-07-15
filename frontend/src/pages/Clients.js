import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./Clients.css";
import { apiService } from '../apiService';
import { getToken } from '../tokenservice';
import { MdSearch } from "react-icons/md";
import { MdOutlineAdd } from "react-icons/md";
import { MdClose } from "react-icons/md";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";


const Clients = () => {
  const [addModalIsOpen, setAddModalOpen] = useState(false);
  const [modifyModalIsOpen, setModifyModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [newUserData, setNewUserData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
    email: "",
    city: "",
    phone: "",
    // role: ["ROLE_USER"],
  });

  const [existingUserData, setExistingUserData] = useState({
    id: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
    email: "",
    city: "",
    phone: "",
    // role: ["ROLE_USER"],
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const openAddModal = () => {
    setAddModalOpen(true);
  };

  const openModifyModal = async (id) => {
    const userData = await fetchExistingUserData(id);
    if (userData) {
      setExistingUserData(userData);
      setModifyModalOpen(true);
    } else {
      console.log("User not found"); // Handle the case where the user data is not available
    }
  };

  const openDeleteConfirmation = async (username) => {
    const userData = await fetchExistingUserData(username);
    if (userData) {
      setExistingUserData(userData);
      setUserToDelete(userData); // Set the userToDelete state to the fetched user data
    } else {
      console.log("User not found"); // Handle the case where the user data is not available
    }
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const closeModifyModal = () => {
    setModifyModalOpen(false);
  };
  const closeDeleteConfirmation = () => {
    setUserToDelete(null);
  };



  const fetchExistingUserData = async (username) => {
    try {
      const tokenPromise = getToken();
      const token = await tokenPromise;
      const formattedToken = JSON.parse(token);
      if (token) {
        console.log("Token retrieved successfully");
        const response = await fetch(
          "http://localhost:5555/api/users/" + username, // Make sure the URL is correct
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${formattedToken}`,
            },
          }
        );

        const data = await response.json();
        console.log("Existing user data:", data);
        return data; // Return the fetched user data
      } else {
        console.log("Token is not available or expired");
        return null;
      }
    } catch (error) {
      console.log("Error occurred during fetch: ", error);
      return null;
    }
  };


  const fetchUserData = async () => {
    try {
      const tokenPromise = getToken(); // Get the token promise
      const token = await tokenPromise; // Await the token promise to get the actual token value        
      if (token) {
        console.log("Token retrieved successfully");

        const data = await apiService.get("http://localhost:5555/api/users/list", token);
        console.log("Response from server:", data);
        setUsers(data);
      } else {
        console.log("Token is not available or expired");
        // Add your logic here to handle the case where the token is not available or expired
      }
    } catch (error) {
      console.log("Error occurred during fetch: ", error);
    }
  };


  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    address: Yup.string().required("Address is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    city: Yup.string().required("City is required"),
    phone: Yup.string().required("Phone is required"),
  });

  const onSubmitAdd = async (values, { setSubmitting }) => {
    if (setSubmitting) {
      return;
    }

    try {
      const tokenPromise = getToken(); // Get the token promise
      const token = await tokenPromise; // Await the token promise to get the actual token value
      const formattedToken = JSON.parse(token);
      if (token) {
        console.log("Token retrieved successfully");

        const response = await fetch("http://localhost:5555/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${formattedToken}`,
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        console.log("Response from server:", data);
        setSubmitting(false);
      } else {
        console.log("Token is not available or expired");
      }
    } catch (error) {
      console.log("Error occurred during fetch: ", error);
      setSubmitting(false);
    }

  };

  const onSubmitModify = async (values, { setSubmitting }) => {
    if (setSubmitting) {
      return;
    }

    try {
      const tokenPromise = getToken(); // Get the token promise
      const token = await tokenPromise; // Await the token promise to get the actual token value
      const formattedToken = JSON.parse(token);
      if (token) {
        console.log("Token retrieved successfully");
        const { username, ...userData } = existingUserData;
        const response = await fetch('http://localhost:5555/api/users/' + username, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${formattedToken}`,
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        console.log("Response from server:", data);
        setSubmitting(false);
        if (data != null) {
          closeModifyModal();
        }
      } else {
        console.log("Token is not available or expired");
      }
    } catch (error) {
      console.log("Error occurred during fetch: ", error);
      setSubmitting(false);
    };
  };

  const deleteUser = async (username) => {
    // if (setSubmitting) {
    //   return;
    // }

    try {
      const tokenPromise = getToken(); // Get the token promise
      const token = await tokenPromise; // Await the token promise to get the actual token value
      const formattedToken = JSON.parse(token);
      if (token) {
        console.log("Token retrieved successfully");
        // const { username, ...userData } = existingUserData;
        const response = await fetch("http://localhost:5555/api/users/" + userToDelete.username, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${formattedToken}`,
          }
        });

        const data = await response.json();
        console.log("Response from server:", data);
        // setSubmitting(false);
      } else {
        console.log("Token is not available or expired");
      }
    } catch (error) {
      console.log("Error occurred during fetch: ", error);
      // setSubmitting(false);
    };
  };


  return (
    <>
      <div className="clients-container">
        <h2 className="title">Clients</h2>
        <div className="actions-container">
          <button className="chercher-button">
            <MdSearch className="icon-chercher" /> Chercher
          </button>
          <div onClick={openAddModal} className="add-button">
            <MdOutlineAdd className="icon-add" />
          </div>
        </div>
        <div className="user-list-container">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Address</th>
                <th>City</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* <tr className="user-row" >
                <td className="user-column">{`user.email`}</td>
                <td className="user-column">{`user.firstName`}</td>
                <td className="user-column">{`user.lastName`}</td>
                <td className="user-column">{`user.address`}</td>
                <td className="user-column">{`user.city`}</td>
                <td className="user-column">
                  <button
                    className="modifier-button"
                    onClick={() => { }}
                  >
                    Modifier
                  </button>
                  <br />
                  <button
                    className="supprimer-button"
                    onClick={() => { }}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
              <tr className="user-row" >
                <td className="user-column">{`user.email`}</td>
                <td className="user-column">{`user.firstName`}</td>
                <td className="user-column">{`user.lastName`}</td>
                <td className="user-column">{`user.address`}</td>
                <td className="user-column">{`user.city`}</td>
                <td className="user-column">
                  <button
                    className="modifier-button"
                    onClick={() => { }}
                  >
                    Modifier
                  </button>
                  <br />
                  <button
                    className="supprimer-button"
                    onClick={() => { }}
                  >
                    Supprimer
                  </button>
                </td>
              </tr> */}
              {users.map((user) => (
                <tr className="user-row" key={user.id}>
                  <td className="user-column">{user.email}</td>
                  <td className="user-column">{user.firstName}</td>
                  <td className="user-column">{user.lastName}</td>
                  <td className="user-column">{user.address}</td>
                  <td className="user-column">{user.city}</td>
                  <td className="user-column">
                    <button
                      className="modifier-button"
                      onClick={() => openModifyModal(user.username)}
                    >
                      Modifier
                    </button>
                    <br />
                    <button
                      className="supprimer-button"
                      onClick={() => openDeleteConfirmation(user.username)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* {users.map((user) => (
            <div className="user-row" key={user.id}>
              <div className="user-column">{user.email}</div>
              <div className="user-column">{user.firstName}</div>
              <div className="user-column">{user.lastName}</div>
              <div className="user-column">{user.address}</div>
              <div className="user-column">{user.city}</div>
              <div className="user-column">
                <button
                  className="modifier-button"
                  onClick={() => openModifyModal(user.username)}
                >
                  Modifier
                </button>
              </div>
              <div className="user-column">
                <button
                  className="supprimer-button"
                  onClick={() => openDeleteConfirmation(user.username)}
                >
                  Supprimer
                </button>
              </div>

            </div>
          ))} */}
        </div>

        <Modal
          Modal
          isOpen={addModalIsOpen}
          onRequestClose={closeAddModal}
          className="ReactModal__Content"
        >
          {" "}
          <div className="close-div" onClick={closeAddModal}>
            <MdClose className="close-button" />
          </div>
          <h2 className="title-update">Ajouter client:</h2>
          <Formik
            initialValues={newUserData}
            validationSchema={validationSchema}
            onSubmit={onSubmitAdd}
          >
            {() => (
              <Form>
                <div className="form-line">
                  <div className="input-container">
                    <label htmlFor="username">Nom d'utilisateur:</label>
                    <Field type="text" id="username" name="username" />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="error-message"
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="password">Mot de passe:</label>
                    <Field type="password" id="password" name="password" />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="error-message"
                    />
                  </div>
                </div>
                <div className="form-line">
                  <div className="input-container">
                    <label htmlFor="firstName">Nom:</label>
                    <Field type="text" id="firstName" name="firstName" />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="error-message"
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="lastName">Prénom:</label>
                    <Field type="text" id="lastName" name="lastName" />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="error-message"
                    />
                  </div>
                </div>

                <div className="form-line">
                  <div className="input-container long-input">
                    <label htmlFor="email">Email:</label>
                    <Field type="email" id="email" name="email" />
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
                    <Field type="text" id="address" name="address" />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="error-message"
                    />
                  </div>
                </div>
                <div className="form-line">
                  <div className="input-container">
                    <label htmlFor="city">City:</label>
                    <Field type="text" id="city" name="city" />
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="error-message"
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="phone">Phone:</label>
                    <Field type="text" id="phone" name="phone" />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="error-message"
                    />
                  </div>
                </div>
                <div className="form-line button-container">
                  <button type="submit">Ajouter</button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>

        <Modal
          Modal
          isOpen={modifyModalIsOpen}
          onRequestClose={closeModifyModal}
          className="ReactModal__Content"
        >
          <div className="close-div" onClick={closeModifyModal}>
            <MdClose className="close-button" />
          </div>
          <h2 className="title-update">Ajouter client:</h2>
          <Formik
            initialValues={existingUserData}
            validationSchema={validationSchema}
            onSubmit={onSubmitModify}
          >
            {() => (
              <Form>
                <div className="form-line">
                  <div className="input-container">
                    <label htmlFor="username">Nom d'utilisateur:</label>
                    <Field type="text" id="username" name="username" />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="error-message"
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="password">Mot de passe:</label>
                    <Field type="password" id="password" name="password" />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="error-message"
                    />
                  </div>
                </div>
                <div className="form-line">
                  <div className="input-container">
                    <label htmlFor="firstName">Nom:</label>
                    <Field type="text" id="firstName" name="firstName" />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="error-message"
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="lastName">Prénom:</label>
                    <Field type="text" id="lastName" name="lastName" />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="error-message"
                    />
                  </div>
                </div>

                <div className="form-line">
                  <div className="input-container long-input">
                    <label htmlFor="email">Email:</label>
                    <Field type="email" id="email" name="email" />
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
                    <Field type="text" id="address" name="address" />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="error-message"
                    />
                  </div>
                </div>
                <div className="form-line">
                  <div className="input-container">
                    <label htmlFor="city">City:</label>
                    <Field type="text" id="city" name="city" />
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="error-message"
                    />
                  </div>
                  <div className="input-container">
                    <label htmlFor="phone">Phone:</label>
                    <Field type="text" id="phone" name="phone" />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="error-message"
                    />
                  </div>
                </div>
                <div className="form-line button-container">
                  <button type="submit">Ajouter</button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>
        <Modal
          isOpen={!!userToDelete}
          onRequestClose={closeDeleteConfirmation}
          className="ReactModal__Content"
        >
          <div className="close-div" onClick={closeDeleteConfirmation}>
            <MdClose className="close-button" />
          </div>
          <h2 className="title-update">Confirmation de suppression:</h2>
          <p>Êtes-vous sûr de vouloir supprimer l'utilisateur {userToDelete && userToDelete.username} ?</p>
          <div className="form-line button-container">
            <button onClick={deleteUser}>Supprimer</button>
            <button onClick={closeDeleteConfirmation}>Annuler</button>
          </div>
        </Modal>

      </div>
    </>
  );
};

export default Clients;