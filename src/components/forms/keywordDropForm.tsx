"use client";
import { CloseIcon, LoadingIcon, UploadIcon } from "@/constant/icons";
import { handleClear } from "@/slices/keywordImageSlice";
import { handleInputChange } from "@/slices/keywordInputSlice";
import { RootState } from "@/store";
import { joinString } from "@/utils/lib";
import { ChangeEvent, Fragment, MouseEventHandler } from "react";
import Dropzone from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";

type InputEV = ChangeEvent<HTMLInputElement | HTMLSelectElement>;
interface Props {
  handleGenerate: MouseEventHandler<HTMLButtonElement> | undefined;
  handleDrop: (ev: File[]) => void;
}
export default function KeywordDropForm(props: Props) {
  const dispatch = useDispatch();
  const { handleDrop, handleGenerate } = props;
  // handle input
  function handleInput(ev: InputEV, type: "KEY" | "TAG") {
    const value = ev.target.value;
    dispatch(handleInputChange({ value, type }));
  }
  const keyData = useSelector((state: RootState) => state.keywordInput);
  const { images, isGenerateLoading } = useSelector(
    (state: RootState) => state.keywordImage
  );
  const { apiKey, numberOfTag } = keyData;

  // clear input and response
  function clear() {
    dispatch(handleClear());
  }
  return (
    <Fragment>
      {/* Input Key and number of tag */}
      <div className="grid gap-2 sm:grid-cols-4 ">
        <div className="sm:col-span-3 col-span-4">
          <label
            className="block text-gray-700 dark:text-gray-400 text-sm font-bold mb-2"
            htmlFor="password"
          >
            API Key
            <a
              target="_blank"
              className="text-blue-500 ms-2 "
              href="https://aistudio.google.com/app/apikey"
            >
              <span className="underline">Create key</span>
              <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                Free
              </span>
            </a>
          </label>
          <input
            value={apiKey}
            onChange={(e) => handleInput(e, "KEY")}
            className={joinString([
              apiKey ? "border-gray-300" : "border-red-500",
              "block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
            ])}
            type="text"
            placeholder="Enter API Key"
          />
        </div>
        <div className="sm:col-span-1 col-span-4">
          <label
            className="block text-gray-700  dark:text-gray-400 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Number of tags
          </label>
          <select
            value={numberOfTag}
            onChange={(e) => handleInput(e, "TAG")}
            id="countries"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
            <option value="40">40</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
      {/* Image Drop Zone */}
      <Dropzone
        noDragEventsBubbling
        accept={{ "image/*": [] }}
        onDrop={handleDrop}
      >
        {({ getRootProps, isDragActive, getInputProps }) => (
          <div
            {...getRootProps({ className: "dropzone" })}
            className="flex items-center my-2 justify-center w-full aa"
          >
            <div
              className={joinString([
                isDragActive ? "bg-blue-200" : "bg-gray-50",
                !images.length ? "justify-center" : "",
                "min-h-[calc(80vh-200px)] p-2 flex flex-col  w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer  dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 ",
              ])}
            >
              {!images.length ? (
                // Upload icon
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <span className="w-10 text-gray-500">
                    <UploadIcon />
                  </span>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Upload Images (max 50)
                  </p>
                </div>
              ) : (
                // Image gallery
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  gap-2">
                  {images.map((img, index) => (
                    <div key={index}>
                      <img
                        className="h-full max-h-[50vh] max-w-full object-cover rounded-lg"
                        src={img}
                        alt="image"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* File Input */}
              <input
                {...getInputProps()}
                hidden
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
        )}
      </Dropzone>
      {/* Handle Action buttons */}
      <div className="grid gap-5 grid-cols-3 ">
        <button
          onClick={handleGenerate}
          disabled={isGenerateLoading}
          className="relative col-span-2 inline-block p-px font-semibold leading-6 text-white no-underline bg-gray-800 shadow-2xl cursor-pointer group rounded-xl shadow-zinc-900"
        >
          <span className="absolute inset-0 overflow-hidden rounded-xl">
            <span className="absolute inset-0 rounded-xl bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
          </span>
          <div className="relative z-10 flex items-center justify-center px-6 py-3 space-x-2 rounded-xl bg-gray-950/50 ring-1 ring-white/10 ">
            {isGenerateLoading ? (
              <>
                <span className="h-4 w-4 me-1 animate-spin">
                  <LoadingIcon />
                </span>
                Generating...
              </>
            ) : (
              <>Generate</>
            )}
          </div>
          <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-gray-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
        </button>
        <button
          onClick={clear}
          type="button"
          className="col-span-1 gap-1 text-white bg-red-600 hover:bg-red-700  focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-xl px-5 py-2.5 inline-flex items-center justify-center"
        >
          <CloseIcon />
          Clear
        </button>
      </div>
    </Fragment>
  );
}
