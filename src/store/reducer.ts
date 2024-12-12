import keywordImageSlice from "@/slices/keywordImageSlice";
import keywordInputSlice from "@/slices/keywordInputSlice";
import { combineSlices } from "@reduxjs/toolkit";

const reducer = combineSlices({
  keywordInput: keywordInputSlice,
  keywordImage: keywordImageSlice,
});

export default reducer;
