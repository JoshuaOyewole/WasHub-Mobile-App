import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type ReviewModalProps = {
  visible: boolean;
  outletName: string;
  onClose: () => void;
  onSubmit: (rating: number, review?: string) => void;
  isSubmitting?: boolean;
};

export default function ReviewModal({
  visible,
  outletName,
  onClose,
  onSubmit,
  isSubmitting = false,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, review.trim() || undefined);
  };

  const handleClose = () => {
    setRating(0);
    setReview("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="star" size={40} color="#F77C0B" />
          </View>

          {/* Title */}
          <Text style={styles.title}>How was your wash?</Text>
          <Text style={styles.subtitle}>
            Share your feedback for {outletName}
          </Text>

          {/* Star Rating */}
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                activeOpacity={0.7}
                style={styles.starButton}
              >
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={40}
                  color={star <= rating ? "#F77C0B" : "#D1D5DB"}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Review Text Input */}
          <TextInput
            style={styles.textInput}
            placeholder="Write your review (optional)"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            maxLength={500}
            value={review}
            onChangeText={setReview}
            textAlignVertical="top"
          />

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.submitButton,
                (rating === 0 || isSubmitting) && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Review</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  header: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF8F3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2D33",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#7D7D7D",
    textAlign: "center",
    marginBottom: 24,
  },
  starsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  starButton: {
    padding: 4,
  },
  textInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#1F2D33",
    minHeight: 100,
    marginBottom: 24,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2D33",
  },
  submitButton: {
    backgroundColor: "#F77C0B",
  },
  submitButtonDisabled: {
    backgroundColor: "#FDB98A",
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
