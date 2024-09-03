import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
   name: "localization-lang",
   initialState: {
      lang: "ru",
   },

   reducers: {
      changeLanguage(state, action) {
         switch (action.payload.type) {
            case "en":
               return { ...state, lang: "en" };
            case "ru":
               return { ...state, lang: "ru" };
            case "uz":
               return { ...state, lang: "uz" };
            default:
               return state;
         }
      },
   },
});

export const { changeLanguage } = cartSlice.actions;
export default cartSlice.reducer;

///My Code
