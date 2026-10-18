import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCategories, getEventById, searchEvents } from "../../services/ticketmaster";

const defaultFilters = {
  keyword: "",
  category: "",
  city: "",
  startDate: "",
  endDate: "",
  sort: "date,asc",
};

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { getState, rejectWithValue }) => {
    const { filters, page } = getState().events;
    try {
      return await searchEvents({ ...filters, page: page.number });
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const fetchEventDetails = createAsyncThunk(
  "events/fetchEventDetails",
  async (id, { rejectWithValue }) => {
    try {
      return await getEventById(id);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "events/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      return await getCategories();
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    list: [],
    status: "idle",
    error: null,
    page: { number: 0, totalPages: 0, totalElements: 0 },
    filters: defaultFilters,
    selected: null,
    detailStatus: "idle",
    detailError: null,
    categories: [],
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      state.page.number = 0; // any filter change returns to the first page
    },
    resetFilters(state) {
      state.filters = defaultFilters;
      state.page.number = 0;
    },
    setPage(state, action) {
      state.page.number = action.payload;
    },
    clearSelected(state) {
      state.selected = null;
      state.detailStatus = "idle";
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(fetchEvents.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.list = a.payload.events;
        s.page.totalPages = a.payload.totalPages;
        s.page.totalElements = a.payload.totalElements;
      })
      .addCase(fetchEvents.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || "Could not load events.";
      })
      .addCase(fetchEventDetails.pending, (s) => { s.detailStatus = "loading"; s.detailError = null; })
      .addCase(fetchEventDetails.fulfilled, (s, a) => { s.detailStatus = "succeeded"; s.selected = a.payload; })
      .addCase(fetchEventDetails.rejected, (s, a) => {
        s.detailStatus = "failed";
        s.detailError = a.payload || "Could not load this event.";
      })
      .addCase(fetchCategories.fulfilled, (s, a) => { s.categories = a.payload; });
  },
});

export const { setFilters, resetFilters, setPage, clearSelected } = eventsSlice.actions;
export default eventsSlice.reducer;
