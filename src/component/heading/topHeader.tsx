import { appInfo } from "@/constant/app";

export default function TopHeader() {
  return (
    <div className="container">
      <div className="  items-center justify-center   rounded text-sm font-semibold cursor-pointer   from-green-300 via-blue-500 to-purple-600 p-0.5 ">
        <h1 className="mb-4 text-2xl text-center my-5 font-extrabold text-gray-900 dark:text-white  ">
          <span>Free photo tags by</span>
          <span className="text-transparent font-extrabold ms-2 bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
            {appInfo.appName}
          </span>
          <span className="text-xs"> v{appInfo.version}</span>
        </h1>
      </div>
    </div>
  );
}
