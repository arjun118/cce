import { React } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "../elements/FormikControl";
import { Button, HStack, VStack } from "@chakra-ui/react";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate, useLocation, Navigate } from "react-router-dom";
import axios from "../../api/axios";
const Login = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/home";

  const initialValues = {
    email: "",
    password: "",
  };
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Required"),
    password: Yup.string().required(),
  });
  const onSubmit = async (values) => {
    try {
      const response = await axios.post("/auth/login", JSON.stringify(values), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (response.data.success) {
        setAuth((prev) => ({ token: response.data.token }));
        navigate(from, { replace: true });
      }
    } catch (e) {
      //  need to remove this statement
      console.log(e);
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
                label="Email"
                type="email"
                name="email"
                autoFocus
              />
              <FormikControl
                control="input"
                label="Password"
                type="password"
                name="password"
              />

              <Button
                type="submit"
                isDisabled={!(formik.isValid && formik.dirty)}
              >
                Login
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

export default Login;
