import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type PickerOption = {
  label: string;
  value: string;
};

type FormPickerProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: PickerOption[];
  placeholder?: string;
};

export default function FormPicker({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
}: FormPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.pickerText, !selectedOption && styles.placeholderText]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Feather name="chevron-down" size={20} color="#7D7D7D" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionItem,
                  option.value === value && styles.selectedOption,
                ]}
                onPress={() => {
                  onValueChange(option.value);
                  setIsOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    option.value === value && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
                {option.value === value && (
                  <Feather name="check" size={20} color="#F77C0B" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: "#1F2D33",
    marginBottom: 8,
    fontWeight: "400",
  },
  pickerButton: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 48,
  },
  pickerText: {
    fontSize: 14,
    color: "#1F2D33",
  },
  placeholderText: {
    color: "#B0B0B0",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    width: "80%",
    maxHeight: "60%",
    paddingVertical: 8,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  selectedOption: {
    backgroundColor: "#FFF5ED",
  },
  optionText: {
    fontSize: 16,
    color: "#1F2D33",
  },
  selectedOptionText: {
    fontWeight: "600",
    color: "#F77C0B",
  },
});
