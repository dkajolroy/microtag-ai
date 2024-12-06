"use client";

import { appInfo } from "@/constant/app";
import {
  CloseIcon,
  FileCopyIcon,
  LoadingIcon,
  UploadIcon,
} from "@/constant/icons";
import { imageResizeToBase64 } from "@/utils/image_compress";
import { joinString } from "@/utils/lib";
import axios from "axios";
import copy from "copy-to-clipboard";
import { enqueueSnackbar } from "notistack";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

interface Response {
  title: string;
  description: string;
  tags: string[];
  isLoading: boolean;
}

export default function Home() {
  const [formData, setFormData] = useState({
    isLoading: false,
    apiKey: "",
    numberOfTags: 25,
  });
  useEffect(() => {
    const getKey = localStorage.getItem("key") || undefined;
    const getTags = localStorage.getItem("tags") || undefined;
    if (getKey) {
      setFormData((x) => ({ ...x, apiKey: getKey }));
    }
    if (getTags) {
      setFormData((x) => ({ ...x, numberOfTags: parseInt(getTags) }));
    }
  }, []);
  function handleInput(
    ev: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    type: "KEY" | "TAG"
  ) {
    const value = ev.target.value.trim();
    if (type === "KEY") {
      localStorage.setItem("key", value);
      setFormData((x) => ({ ...x, apiKey: value }));
    } else {
      console.log(value);
      localStorage.setItem("tags", value);
      setFormData((x) => ({ ...x, numberOfTags: parseInt(value) }));
    }
  }
  // Drop-zon config
  const [images, SetImages] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    if (acceptedFiles.length) {
      (async () => {
        const base64All = await Promise.all(
          acceptedFiles.map((x) => imageResizeToBase64(x))
        );
        SetImages(base64All);
      })();
    }
  }, []);
  const { getRootProps, isDragActive, getInputProps } = useDropzone({
    maxFiles: 10,
    onDrop,
  });
  function clear() {
    setData({ description: "", tags: [], title: "", isLoading: false });
    SetImages([]);
  }

  // Generate handler
  const [data, setData] = useState<Response>({
    description: "",
    tags: [],
    title: "",
    isLoading: false,
  });
  async function handleGenerate() {
    if (images.length && formData.apiKey && formData.numberOfTags) {
      setData((x) => ({ ...x, isLoading: true }));
      try {
        const data = { image: images[0], ...formData };
        const res = await axios.post("/api/ai", data);
        setData(() => ({ ...res.data, isLoading: false }));
        enqueueSnackbar("Congrats ! Successfully generate !", {
          variant: "success",
        });
      } catch (error) {
        setData((xx) => ({ ...xx, isLoading: false }));
        enqueueSnackbar("Request error something wrong !", {
          variant: "error",
        });
      }
    } else {
      // toast
      enqueueSnackbar("Missing API key or Image !", {
        variant: "error",
      });
    }
  }

  // copy clipboard
  function copyClipBoard(type: "TITLE" | "DESC" | "TAG") {
    switch (type) {
      case "TITLE":
        copy(data.title, { debug: true, message: "OK" });
        break;
      case "DESC":
        copy(data.description);
        break;
      default:
        copy(data.tags.toString());
    }
    enqueueSnackbar("Copy clipboard !", {
      variant: "success",
      autoHideDuration: 1500,
    });
  }
  return (
    <div className="container ">
      <h1 className="mb-4 text-2xl text-center my-5 font-extrabold text-gray-900 dark:text-white md:text-2xl  ">
        Free photo tags by
        <span className="text-transparent ms-2 bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          {appInfo.appName}
        </span>
      </h1>
      <hr />
      <div className="grid lg:grid-cols-2 gap-5 my-5">
        <div>
          <div className="grid gap-2 sm:grid-cols-4 ">
            <div className="sm:col-span-3 col-span-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Gemini API Key
                <a
                  target="_blank"
                  className="text-blue-500 ms-2 underline"
                  href="https://aistudio.google.com/app/apikey"
                >
                  Your key
                </a>
              </label>
              <input
                value={formData.apiKey}
                onChange={(e) => handleInput(e, "KEY")}
                className={joinString([
                  formData.apiKey ? "border-gray-300" : "border-red-500",
                  "block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                ])}
                type="text"
                placeholder="Gemini API Key"
              />
            </div>
            <div className="sm:col-span-1 col-span-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Number of tags
              </label>
              <select
                value={formData.numberOfTags}
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

          <div>
            {formData.isLoading && <span>Loading......</span>}
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
                  // Image gallery
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <span className="w-10 text-gray-500">
                      <UploadIcon />
                    </span>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Upload Images
                    </p>
                    {/* File Input */}
                    <input
                      {...getInputProps()}
                      hidden
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                ) : (
                  // Image gallery
                  <div
                    {...getRootProps({ className: "dropzone" })}
                    // className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  gap-2"
                    className="flex justify-center items-center"
                  >
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
              </div>
            </div>
          </div>
          <div className="grid gap-5 grid-cols-3 ">
            <button
              onClick={handleGenerate}
              disabled={data.isLoading}
              type="button"
              className="col-span-2 gap-1 text-white bg-gradient-to-r  from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg px-5 py-2.5 inline-flex items-center justify-center"
            >
              {data.isLoading && <LoadingIcon />}Generate
            </button>
            <button
              onClick={clear}
              type="button"
              className="col-span-1 gap-1 text-white bg-red-700 hover:bg-red-800  focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg px-5 py-2.5 inline-flex items-center justify-center"
            >
              <CloseIcon />
              Clear
            </button>
          </div>
        </div>
        <div className="grid ">
          <div>
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Title
            </label>
            <div className="flex">
              <input
                readOnly
                value={data.title.trim()}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-l-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Waiting to generate title..."
              />
              <button
                onClick={() => copyClipBoard("TITLE")}
                type="button"
                className="inline-flex transition-all items-center px-3 text-sm text-gray-900 hover:bg-gray-700 hover:border-gray-700 bg-gray-500 border rounded-e-0 border-gray-500 border-e-0 rounded-e-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
              >
                <span className="w-8 flex">
                  <FileCopyIcon />
                </span>
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Description
            </label>
            <div className="flex">
              <textarea
                rows={4}
                readOnly
                value={data.description.trim()}
                className="block resize-none p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-l-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Waiting to generate description..."
              ></textarea>
              <button
                onClick={() => copyClipBoard("DESC")}
                type="button"
                className="inline-flex transition-all items-center px-3 text-sm text-gray-900 hover:bg-gray-700 hover:border-gray-700 bg-gray-500 border rounded-e-0 border-gray-500 border-e-0 rounded-e-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
              >
                <span className="w-8 flex">
                  <FileCopyIcon />
                </span>
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Tags
            </label>
            <div className="flex">
              <textarea
                rows={4}
                readOnly
                value={data.tags}
                className="block resize-none p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-l-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Waiting to generate tags..."
              ></textarea>
              <button
                onClick={() => copyClipBoard("TAG")}
                type="button"
                className="inline-flex transition-all items-center px-3 text-sm text-gray-900 hover:bg-gray-700 hover:border-gray-700 bg-gray-500 border rounded-e-0 border-gray-500 border-e-0 rounded-e-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
              >
                <span className="w-8 flex">
                  <FileCopyIcon />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
