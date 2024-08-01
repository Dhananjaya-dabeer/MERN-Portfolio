import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    loading: false,
    messages: [],
    error: null,
    message: false,
  },
  reducers: {
    getAllMessagesRequest(state) {
      state.messages = [];
      state.error = null;
      state.loading = true;
    },
    getAllMessagesSuccess(state, action) {
      state.messages = action.payload;
      state.error = null;
      state.loading = false;
    },
    getAllMessagesFail(state) {
      state.messages = state.messages;
      state.error = null;
      state.loading = false;
    },
    getAllMessagesDeleteSuccess(state, action) {
      state.messages = action.payload;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  getAllMessagesFail,
  getAllMessagesSuccess,
  getAllMessagesRequest,
  getAllMessagesDeleteSuccess,
} = messageSlice.actions;
export default messageSlice.reducer;
