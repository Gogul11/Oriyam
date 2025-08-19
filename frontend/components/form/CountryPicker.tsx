import React from "react";
import { CountryPicker, CountryItem } from "react-native-country-codes-picker";

interface Props {
  show: boolean;
  setShow: (show: boolean) => void;
  setFieldValue: (field: string, value: string) => void
  fieldValue : string
}

const CountryPickerComponent: React.FC<Props> = ({
    show,
    setShow,
    setFieldValue,
    fieldValue
}) => {
  return (
    <CountryPicker
      lang="en"
      show={show}
      onBackdropPress={() => setShow(false)}
      pickerButtonOnPress={(item: CountryItem) => {
        setShow(false);
        setFieldValue(fieldValue, item.dial_code);
      }}
      style={{
        modal: {
          height: 400,
          backgroundColor: "#fff",
        },
      }}
    />
  );
};

export default CountryPickerComponent;
