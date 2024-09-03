import { createSlice } from "@reduxjs/toolkit";

const paginationSlice = createSlice({
  name: "commit",
  initialState: {
    pageCount: 5,
  },

  reducers: {
   
    changePage(state, action) {
      state.pageCount = action.payload.pageCount;
    },
  },
});

export const { changePage } = paginationSlice.actions;
export default paginationSlice.reducer;

///My Code
