import React from "react";
import { Button, ButtonProps } from "react-native-paper";

type IButtonProps = React.PropsWithChildren<ButtonProps>;

function CustomButton(props: IButtonProps) {
  return <Button {...props} />;
}

export default CustomButton;
