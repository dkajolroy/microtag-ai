import { FileCopyIcon } from "@/constant/icons";
import { RootState } from "@/store";
import copy from "copy-to-clipboard";
import { enqueueSnackbar } from "notistack";
import { Fragment } from "react";
import { useSelector } from "react-redux";

interface Props {
  item: Result;
  index: number;
}
export default function ResultItem({ item, index }: Props) {
  const { images } = useSelector((state: RootState) => state.keywordImage);

  // copy clipboard
  function copyClipBoard(data: string) {
    copy(data);
    enqueueSnackbar("Copy clipboard !", {
      variant: "success",
      autoHideDuration: 1500,
    });
  }

  return (
    <Fragment>
      <div className="grid border p-5 gap-1 mb-5 bg-gray-200 rounded-md">
        <div className="grid grid-cols-5 gap-1">
          <div className="sm:col-span-1 col-span-5">
            <img
              src={images[index]}
              alt="image"
              className="object-cover  rounded-md max-h-36 sm:max-h-fit"
            />
          </div>
          <div className="sm:col-span-4 col-span-5">
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Title
              </label>
              <div className="flex">
                <input
                  readOnly
                  value={item.title.trim()}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-l-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Waiting to generate title..."
                />
                <button
                  onClick={() => copyClipBoard(item.title.trim())}
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
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <div className="flex">
                <textarea
                  rows={4}
                  readOnly
                  value={item.description.trim()}
                  className="block resize-none p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-l-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Waiting to generate description..."
                ></textarea>
                <button
                  onClick={() => copyClipBoard(item.description.trim())}
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
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                Tags
              </label>
              <div className="flex">
                <textarea
                  rows={3}
                  readOnly
                  value={item.tags}
                  className="block resize-none p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-l-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Waiting to generate tags..."
                ></textarea>
                <button
                  onClick={() => copyClipBoard(item.tags.toString().trim())}
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
    </Fragment>
  );
}
