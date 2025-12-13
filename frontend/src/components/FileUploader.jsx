import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function FileUploader({ onIndexed }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;

    setUploading(true);
    setProgress(0);

    const results = [];

    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      const form = new FormData();
      form.append("file", file);

      try {
        await axios.post("http://localhost:5000/index/file", form, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (event) => {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(Math.round(((i + percent / 100) / acceptedFiles.length) * 100));
          },
        }).then(res => results.push({ file: file.name, detail: res.data }));
      } catch (err) {
        results.push({ file: file.name, error: err.message });
        console.error("Upload/index error:", err?.response?.data ?? err.message);
      }
    }

    setUploading(false);
    setProgress(100);

    onIndexed?.(results);
  }, [onIndexed]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: true });

  return (
    <div className="flex flex-col gap-2">
      <div
        {...getRootProps()}
        className={`dropzone cursor-pointer hover:border-purple-400 transition border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white flex flex-col items-center justify-center ${
          uploading ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-500">
          {uploading ? "Uploading files..." : "Drag & drop PDF/TXT files here or click to select"}
        </p>
      </div>

      {uploading && (
        <div className="w-full bg-gray-200 rounded h-2 mt-2">
          <div
            className="bg-purple-500 h-2 rounded transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
