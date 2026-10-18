import { createSlice } from "@reduxjs/toolkit";
import { KEYS, loadJSON } from "../../utils/storage";

// byUserId: { [userId]: Registration[] }
// A registration stores a snapshot of the event so My Events works even after
// the API stops returning past events.
const registrationsSlice = createSlice({
  name: "registrations",
  initialState: { byUserId: loadJSON(KEYS.registrations, {}) },
  reducers: {
    registerForEvent(state, action) {
      const { userId, event } = action.payload;
      const list = state.byUserId[userId] || [];
      if (list.some((r) => r.id === event.id)) return; // block duplicates
      state.byUserId[userId] = [
        ...list,
        {
          id: event.id,
          name: event.name,
          image: event.image,
          dateTime: event.dateTime,
          localDate: event.localDate,
          localTime: event.localTime,
          venue: event.venue,
          city: event.city,
          category: event.category,
          registeredAt: new Date().toISOString(),
        },
      ];
    },
    cancelRegistration(state, action) {
      const { userId, eventId } = action.payload;
      state.byUserId[userId] = (state.byUserId[userId] || []).filter((r) => r.id !== eventId);
    },
  },
});

export const { registerForEvent, cancelRegistration } = registrationsSlice.actions;

const EMPTY = [];
export const selectUserRegistrations = (userId) => (state) =>
  (userId && state.registrations.byUserId[userId]) || EMPTY;
export const selectIsRegistered = (userId, eventId) => (state) =>
  !!userId && (state.registrations.byUserId[userId] || EMPTY).some((r) => r.id === eventId);

export default registrationsSlice.reducer;
