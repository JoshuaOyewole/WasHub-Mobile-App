import Button from "@/components/ui/button";
import { Car } from "@/components/ui/car-card";
import React, { useRef } from "react";
import {
    Animated,
    Modal,
    PanResponder,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

type CarActionsModalProps = {
  visible: boolean;
  onClose: () => void;
  car: Car | null;
  onWashCar: (car: Car) => void;
  onViewDetails: (car: Car) => void;
};

export default function CarActionsModal({
  visible,
  onClose,
  car,
  onWashCar,
  onViewDetails,
}: CarActionsModalProps) {
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          Animated.timing(translateY, {
            toValue: 300,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            translateY.setValue(0);
            onClose();
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const handleWashCar = () => {
    if (car) {
      onWashCar(car);
      onClose();
    }
  };

  const handleViewDetails = () => {
    if (car) {
      onViewDetails(car);
      onClose();
    }
  };

  if (!car) return null;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <TouchableOpacity activeOpacity={1}>
            {/* Handle Bar */}
            <View style={styles.handleBar} />

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                title="Wash your car"
                onPress={handleWashCar}
                variant="primary"
              />
              <View style={styles.buttonSpacing} />
              <Button
                title="View car details"
                onPress={handleViewDetails}
                variant="secondary"
              />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  buttonSpacing: {
    height: 12,
  },
});
