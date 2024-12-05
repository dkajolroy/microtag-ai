"use client";

import { appInfo } from "@/constant/app";
import { imageResizeToBase64 } from "@/utils/image_compress";
import { joinString } from "@/utils/lib";
import axios from "axios";
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
      } catch (error) {
        // toast
        console.log(error);
      }
    } else {
      // toast
    }
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
          <div className="grid gap-2 grid-cols-4 ">
            <div className="col-span-3">
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
                className="shadow  appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Gemini API Key"
              />
            </div>
            <div className="col-span-1">
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
                    {/* <UploadCloud size="30px" className="text-gray-500 " /> */}
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      JPG or PNG (MAX. 50)
                    </p>
                    {/* File Input */}
                    <input {...getInputProps()} hidden className="hidden" />
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
                          className="h-full max-w-full object-cover rounded-lg"
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
              className="col-span-2 text-white bg-gradient-to-r  from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg px-5 py-2.5 text-center"
            >
              {data.isLoading ? "Generating..." : "Generate"}
            </button>
            <button
              onClick={clear}
              type="button"
              className="col-span-1 text-white bg-red-700 hover:bg-red-800  focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg px-5 py-2.5 text-center"
            >
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
            <input
              readOnly
              value={data.title.trim()}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Waiting to generate title..."
            ></input>
          </div>
          <div>
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Description
            </label>
            <textarea
              rows={4}
              readOnly
              value={data.description.trim()}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Waiting to generate description..."
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Tags
            </label>
            <textarea
              rows={4}
              readOnly
              value={data.tags}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Waiting to generate tags..."
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}
