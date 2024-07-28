import { React } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "../elements/FormikControl";
import { Button, HStack, VStack } from "@chakra-ui/react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
const Register = () => {
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/home";
  const { auth } = useAuth();
  const initialValues = {
    username: "",
    email: "",
    password: "",
    cnfpassword: "",
  };
  const validationSchema = Yup.object({
    username: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email format").required("Required"),
    password: Yup.string().required(),
    cnfpassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords must match")
      .required("Required"),
  });
  const onSubmit = async (values) => {
    try {
      const response = await axios.post(
        "/auth/signup",
        JSON.stringify(values),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
    } catch (e) {
      console.log("error", e);
    }
  };
  return !auth?.token ? (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <Form>
            <VStack>
              <FormikControl
                control="input"
                label="Username"
                type="text"
                name="username"
                autoFocus
                autoComplete="off"
              />
              <FormikControl
                control="input"
                label="Email"
                type="email"
                name="email"
              />
              <FormikControl
                control="input"
                label="Password"
                type="password"
                name="password"
              />
              <FormikControl
                control="input"
                label="Confirm Password"
                type="password"
                name="cnfpassword"
              />

              <Button
                type="submit"
                isDisabled={!(formik.isValid && formik.dirty)}
              >
                Signup
              </Button>
            </VStack>
          </Form>
        );
      }}
    </Formik>
  ) : (
    <Navigate to={from} replace={true} />
  );
};

export default Register;
