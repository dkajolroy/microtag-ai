import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Result {
  title: string;
  tags: string[];
  description: string;
}

interface Init {
  isImgResizeLoading: boolean;
  isGenerateLoading: boolean;
  result: Result[];
  images: string[];
}
const initialState: Init = {
  isImgResizeLoading: false,
  isGenerateLoading: false,
  result: [],
  images: [],
};

const keywordImageSlice = createSlice({
  name: "keywordImageSlice",
  initialState,
  reducers: {
    handleClear(state) {
      state.isGenerateLoading = false;
      state.result = [];
      state.images = [];
    },
    handleResizeLoading(state, { payload }: PayloadAction<boolean>) {
      state.isImgResizeLoading = payload;
    },
    handleGenerateLoading(state, { payload }: PayloadAction<boolean>) {
      state.isGenerateLoading = payload;
    },
    handleDropChange(state, { payload }: PayloadAction<string[]>) {
      // changes input value to persist
      const arr = state.images.concat(payload);
      const withoutDuplicate = arr.filter((item, index) => {
        return arr.indexOf(item) === index;
      });
      if (withoutDuplicate.length <= 50) state.images = withoutDuplicate;
      state.isImgResizeLoading = false;
    },
    handleResult(state, { payload }: PayloadAction<Result[]>) {
      state.result = payload;
      state.isGenerateLoading = false;
    },
  },
});

export const {
  handleDropChange,
  handleResult,
  handleClear,
  handleResizeLoading,
  handleGenerateLoading,
} = keywordImageSlice.actions;
export default keywordImageSlice.reducer;
