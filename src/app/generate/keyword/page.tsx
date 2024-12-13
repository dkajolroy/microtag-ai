"use client";

import KeywordDropForm from "@/components/forms/keywordDropForm";
import ResultItem from "@/components/keyword/resultItem";
import ResultItemSkeleton from "@/components/keyword/resultItemSkeleton";
import {
  handleDropChange,
  handleGenerateLoading,
  handleResizeLoading,
  handleResult,
} from "@/slices/keywordImageSlice";
import { RootState } from "@/store";
import { imageResizeToBase64 } from "@/utils/image_compress";
import { joinString } from "@/utils/lib";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";

export default function Keyword() {
  // state
  const dispatch = useDispatch();
  const { apiKey, numberOfTag } = useSelector(
    (state: RootState) => state.keywordInput
  );
  const { images, result, isGenerateLoading } = useSelector(
    (state: RootState) => state.keywordImage
  );

  function handleDrop(acceptedFiles: File[]) {
    dispatch(handleResizeLoading(true));
    if (acceptedFiles.length) {
      (async () => {
        const base64All = await Promise.all(
          acceptedFiles.map((x) => imageResizeToBase64(x))
        );
        return dispatch(handleDropChange(base64All));
      })();
    }
  }

  async function handleGenerate() {
    if (!images.length || !apiKey || !numberOfTag) {
      // toast
      enqueueSnackbar("Missing API key or Image !", {
        variant: "error",
      });
    } else {
      try {
        dispatch(handleGenerateLoading(true));
        const data = { images, numberOfTag, apiKey };
        const res = await axios.post("/api/ai/keyword", data);
        console.log(res.data);
        dispatch(handleResult(res.data));
        enqueueSnackbar("Congrats ! Successfully generate !", {
          variant: "success",
          autoHideDuration: 2000,
        });
      } catch (error) {
        dispatch(handleGenerateLoading(false));
        enqueueSnackbar("Request error something wrong !", {
          variant: "error",
          autoHideDuration: 2000,
        });
      }
    }
  }
  return (
    <div className="container">
      <div className="grid  gap-20 ">
        <div className="grid">
          <KeywordDropForm
            handleGenerate={handleGenerate}
            handleDrop={handleDrop}
          />
        </div>
        <div className="grid ">
          <div className="h-full">
            <h2 className="font-bold text-center text-xl">Result</h2>
            <hr className="my-2" />
            <div className="gird">
              {result.map((item, index) => {
                return <ResultItem key={index} item={item} index={index} />;
              })}
            </div>
            <div
              className={joinString([
                "flex-col items-center  my-10",
                !isGenerateLoading && !result.length ? "flex" : "hidden",
              ])}
            >
              <span className="font-semibold">No data found</span>
              <span className="text-sm">
                No data here yet. We will notify you when there's an update.
              </span>
            </div>
            <div
              className={joinString([
                "gap-8",
                isGenerateLoading ? "grid" : "hidden",
              ])}
            >
              {[1, 2, 3, 4].map((x) => (
                <ResultItemSkeleton key={x} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
