"use client";

import KeywordDropForm from "@/components/forms/keywordDropForm";
import { FileCopyIcon } from "@/constant/icons";
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
import copy from "copy-to-clipboard";
import { enqueueSnackbar } from "notistack";
import { Fragment } from "react";
import { CustomScroll } from "react-custom-scroll";
import { useDispatch, useSelector } from "react-redux";

export default function Keyword() {
  // state
  const dispatch = useDispatch();
  const { apiKey, numberOfTag } = useSelector(
    (state: RootState) => state.keywordInput
  );
  const { images, result } = useSelector(
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

  // copy clipboard
  function copyClipBoard(data: string) {
    copy(data);
    enqueueSnackbar("Copy clipboard !", {
      variant: "success",
      autoHideDuration: 1500,
    });
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
      <div className="grid lg:grid-cols-2 gap-5 ">
        <div className="grid">
          <h2 className="font-bold text-center text-xl">Upload Image</h2>
          <hr className="my-2" />
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
              <CustomScroll
                allowOuterScroll
                heightRelativeToParent="calc(100vh - 180px)"
              >
                {result.map((item, index) => {
                  return (
                    <Fragment key={index}>
                      <div className="grid  gap-1 mb-5 ">
                        <div className="grid grid-cols-5 gap-1">
                          <div className="col-span-1 flex">
                            <img
                              src={images[index]}
                              alt="image"
                              className="object-cover  rounded-md "
                            />
                          </div>
                          <div className="col-span-4">
                            <div className="grid gap-1">
                              <div className="flex">
                                <div className="flex ps-1 items-center w-full cursor-pointer text-xs text-gray-900 bg-gray-50 rounded-l-lg  border border-gray-300 outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                  <span className="font-semibold">Title:</span>
                                  <input
                                    readOnly
                                    value={item.title.trim()}
                                    className="block ps-1 py-2 w-full cursor-pointer text-xs text-gray-900 bg-gray-50 rounded-l-lg  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white border-none outline-none"
                                    placeholder="Waiting to generate title..."
                                  />
                                </div>
                                <button
                                  onClick={() => copyClipBoard("TITLE")}
                                  type="button"
                                  className="inline-flex transition-all items-center px-3 text-sm text-gray-900 hover:bg-gray-700 hover:border-gray-700 bg-gray-500 border rounded-e-0 border-gray-500 border-e-0 rounded-e-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
                                >
                                  <span className="w-7 flex">
                                    <FileCopyIcon />
                                  </span>
                                </button>
                              </div>
                              {/* desc */}
                              <div className="flex">
                                <textarea
                                  rows={3}
                                  readOnly
                                  value={`Description:  ${item.description.trim()}`}
                                  className="block resize-none cursor-pointer px-1 py-0.5  w-full text-xs text-gray-900 bg-gray-50 rounded-l-lg  border border-gray-300 outline-none  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white "
                                  placeholder="Waiting to generate description..."
                                ></textarea>
                                <button
                                  onClick={() => copyClipBoard("DESC")}
                                  type="button"
                                  className="inline-flex transition-all items-center px-3 text-sm text-gray-900 hover:bg-gray-700 hover:border-gray-700 bg-gray-500 border rounded-e-0 border-gray-500 border-e-0 rounded-e-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
                                >
                                  <span className="w-7 flex">
                                    <FileCopyIcon />
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex">
                          <textarea
                            rows={3}
                            readOnly
                            value={`Tag:  ${item.tags.toString().trim()}`}
                            className="block resize-none px-1 py-0.5  w-full text-xs cursor-pointer text-gray-900 bg-gray-50 rounded-l-lg border border-gray-300 outline-none  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  "
                            placeholder="Waiting to generate tags..."
                          ></textarea>
                          <button
                            onClick={() => copyClipBoard("TAG")}
                            type="button"
                            className="inline-flex transition-all items-center px-3 text-sm text-gray-900 hover:bg-gray-700 hover:border-gray-700 bg-gray-500 border rounded-e-0 border-gray-500 border-e-0 rounded-e-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
                          >
                            <span className="w-7 flex">
                              <FileCopyIcon />
                            </span>
                          </button>
                        </div>
                      </div>
                    </Fragment>
                  );
                })}
              </CustomScroll>
            </div>
          </div>
          <div
            className={joinString([
              "justify-center",
              !result.length ? "flex" : "hidden",
            ])}
          >
            <span className="py-10">Waiting for generate...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
