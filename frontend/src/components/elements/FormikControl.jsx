import React from "react";
import InputField from "./InputField";
import RadioButton from "./RadioButton";
import DropDown from "./DropDown";
import CheckBoxField from "./CheckBoxField";
import TextArea from "./TextArea";
const FormikControl = (props) => {
  const { control, ...rest } = props;
  switch (control) {
    case "input":
      return <InputField {...rest} />;
    // case "nestedinput":
    //   return <NestedInputField {...rest} />;
    case "textarea":
      return <TextArea {...rest} />;
    case "select":
      return <DropDown {...rest} />;
    // case "nestedselect":
    //   return <NestedDropDown {...rest} />;
    case "radio":
      return <RadioButton {...rest} />;
    case "checkbox":
      return <CheckBoxField {...rest} />;
    // case "date":
    //   return <DateSelector {...rest} />;
    // case "arrayfield":
    //   return <ArrayField {...rest} />;
    // case "filefield":
    //   return <FileFieldInput {...rest} />;
    default:
      return null;
  }
};

export default FormikControl;
