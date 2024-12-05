import Resizer from "react-image-file-resizer";

export async function imageResizeToBase64(file: File) {
  // const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  const data = await new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      500,
      500,
      "webp",
      90,
      0,
      (value) => {
        resolve(value);
      },
      "base64"
    );
  });
  return data as string;
}
