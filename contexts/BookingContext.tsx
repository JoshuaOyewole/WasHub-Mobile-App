import React, { createContext, useCallback, useContext, useState } from "react";

export type WashType = "Quick Wash" | "Basic" | "Premium";

export interface BookingState {
  carId: string;
  outletId: string;
  washType: WashType;
  date: Date | null;
  time: string;
  price: number;
}

interface BookingContextValue {
  booking: BookingState;
  setCarId: (carId: string) => void;
  setOutletId: (outletId: string) => void;
  setWashType: (washType: WashType) => void;
  setDateTime: (date: Date, time: string) => void;
  clearBooking: () => void;
  isBookingValid: () => boolean;
  setPrice: (price: number) => void;
}

const BookingContext = createContext<BookingContextValue | undefined>(
  undefined,
);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [booking, setBooking] = useState<BookingState>({
    carId: "",
    outletId: "",
    washType: undefined as unknown as WashType,
    date: null,
    time: "",
    price: 0,
  });

  const setCarId = useCallback((carId: string) => {
    setBooking((prev) => ({ ...prev, carId }));
  }, []);

  const setPrice = useCallback((price: number) => {
    setBooking((prev) => ({ ...prev, price }));
  }, []);
  const setOutletId = useCallback((outletId: string) => {
    setBooking((prev) => ({ ...prev, outletId }));
  }, []);

  const setWashType = useCallback((washType: WashType) => {
    setBooking((prev) => ({ ...prev, washType }));
  }, []);

  const setDateTime = useCallback((date: Date, time: string) => {
    setBooking((prev) => ({ ...prev, date, time }));
  }, []);

  const clearBooking = useCallback(() => {
    setBooking({
      carId: "",
      outletId: "",
      washType: undefined as unknown as WashType,
      date: null,
      time: "",
      price: 0,
    });
  }, []);

  const isBookingValid = useCallback(() => {
    return !!(
      booking.carId &&
      booking.outletId &&
      booking.washType &&
      booking.date &&
      booking.time &&
      booking.price
    );
  }, [booking]);

  return (
    <BookingContext.Provider
      value={{
        booking,
        setPrice,
        setCarId,
        setOutletId,
        setWashType,
        setDateTime,
        clearBooking,
        isBookingValid,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextValue => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within BookingProvider");
  }
  return context;
};
