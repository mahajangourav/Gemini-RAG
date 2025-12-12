import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function FileUploader({ onIndexed }) {
  const onDrop = useCallback(async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      const form = new FormData();
      form.append("file", file);

      try {
        const res = await axios.post("http://localhost:5000/index/file", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        onIndexed?.(res.data);
        alert("Indexed: " + file.name);
      } catch (err) {
        console.error("Upload/index error:", err?.response?.data ?? err.message);
        alert("Upload failed: " + (err?.response?.data?.error || err.message));
      }
    }
  }, [onIndexed]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, multiple: true });

  return (
    <div
      {...getRootProps()}
      className="dropzone cursor-pointer hover:border-purple-400 transition border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white flex flex-col items-center justify-center"
    >
      <input {...getInputProps()} />
      <p className="text-gray-500">Drag & drop PDF/TXT files here or click to select</p>
    </div>
  );
}
