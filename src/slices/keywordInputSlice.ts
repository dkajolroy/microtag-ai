import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Init {
  numberOfTag: number;
  apiKey: string;
}
const initialState: Init = {
  numberOfTag: 25,
  apiKey: "",
};

const keywordInputSlice = createSlice({
  name: "keywordInputSlice",
  initialState,
  reducers: {
    handleInputChange(
      state,
      { payload }: PayloadAction<{ value: string; type: "KEY" | "TAG" }>
    ) {
      // changes input value to persist
      if (payload.type === "KEY") {
        state.apiKey = payload.value;
      } else {
        state.numberOfTag = parseInt(payload.value);
      }
    },
  },
});

export const { handleInputChange } = keywordInputSlice.actions;
export default keywordInputSlice.reducer;
