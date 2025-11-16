import React from "react";

import { Text, TextProps } from "react-native-paper";

type ITextProps = TextProps<any>;

export default function CustomText(props: ITextProps) {
  return <Text {...props} />;
}
