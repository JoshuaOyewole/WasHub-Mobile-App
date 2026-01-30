import { useTheme } from "@/hooks/useTheme";
import React from "react";
import {
  Button,
  Keyboard,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import OTPTextView from "react-native-otp-textinput";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OTP() {
  const Colors = useTheme();
  const [otp, setOtp] = React.useState("");

  const handleTextChange = (value: string) => {
    setOtp(value);
    // Auto-dismiss keyboard when OTP is complete
    if (value.length === 6) {
      Keyboard.dismiss();
    }
  };
  const handleVerify = () => {
    console.log("OTP:", otp);
    // Verify OTP logic
  };

  const resendOTP = () => {
    console.log("Resend OTP requested");
    // Resend OTP logic
  };
  return (
    <SafeAreaView
      style={[style.container, { backgroundColor: Colors.background }]}
    >
      <StatusBar />
      {/* OTP Screen Content Goes Here */}
      <View
        style={{ flex: 1, rowGap: 10, marginTop: 80, alignItems: "center" }}
      >
        <Text style={[style.formSubHeader, { color: Colors.formHeading }]}>
          Enter the 6 digit otp we sent to ibalematthew@gmail.com to verify your
          email.
        </Text>

        <View
          style={{
            width: "85%",
            marginHorizontal: "auto",
            marginTop: 20,
            columnGap: 10,
          }}
        >
          <OTPTextView
            handleTextChange={handleTextChange}
            inputCount={6}
            keyboardType="numeric"
            tintColor={"red"}
            offTintColor={Colors.border}
            style={[
              style.otpInput,
              {
                borderColor: Colors.border,
                color: Colors.text,
                fontSize: 20,
                textAlign: "center",
              },
            ]}
          />
        </View>
        <Button
          title="Resend OTP"
          onPress={resendOTP}
          color={Colors.link}
          accessibilityLabel="Resend OTP"
        />
        <Pressable
          onPress={handleVerify}
          style={[
            style.submitBtn,
            {
              backgroundColor: Colors.secondaryButton,
            },
          ]}
        >
          <Text
            style={{
              fontWeight: "600",
              fontSize: 16,
              color: Colors.buttonText,
            }}
          >
            {" "}
            Proceed
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  formSubHeader: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    width: "95%",
    alignSelf: "center",
  },
  otpInput: {
    borderWidth: 1,
    borderRadius: 8,
    height: 45,
    width: 45,
  },
  submitBtn: {
    width: "85%",
    marginHorizontal: "auto",
    marginTop: 30,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  resendOTPButton: {
    marginTop: 20,
  },
});
