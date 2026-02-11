import { useTheme } from "@/hooks/useTheme";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

type IProps = {
  label: string;
  handleChange: (text: string) => void;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
} & TextInputProps;

export default function FormInput({
  handleChange,
  label,
  leftIcon,
  rightIcon,
  ...props
}: IProps) {
  const colors = useTheme();
  return (
    <View style={style.formField}>
      <>
        {label && (
          <Text style={[style.formLabel, { color: colors.text }]}>{label}</Text>
        )}
        <View
          style={[style.inputContainer, { borderColor: colors.inputBorder }]}
        >
          {leftIcon && <View style={style.leftIconContainer}>{leftIcon}</View>}
          <TextInput
            {...props}
            placeholderTextColor={colors.text}
            onChangeText={handleChange}
            style={[
              style.formInput,
              { borderColor: colors.inputBorder, color: colors.text, flex: 1 },
            ]}
            autoCapitalize="none"
          />
          {rightIcon && <View style={style.iconContainer}>{rightIcon}</View>}
        </View>
      </>
    </View>
  );
}

const style = StyleSheet.create({
  formField: {},
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  formInput: {
    height: "100%",
  },
  iconContainer: {
    paddingLeft: 10,
  },
  leftIconContainer: {
    paddingRight: 10,
  },
});
