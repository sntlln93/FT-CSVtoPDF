import { ChangeEvent, useEffect, useState } from "react";
import Papa from "papaparse";
import { Row } from "./types";

export function useCsvParsing() {
  const [file, setFile] = useState<File>();
  const [rows, setRows] = useState<Row[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<FileList>();
  const [showPreview, setShowPreview] = useState(false);

  const [curated, setCurated] = useState<Row[]>([]);

  const handleImages = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.files) {
      setImages(target.files);
    }
  };

  function handleChange({ target }: ChangeEvent<HTMLInputElement>) {
    if (target.files) {
      setFile(target.files[0]);
    }
  }

  function handleGenerate() {
    if (rows && images) {
      setIsLoading(true);
      setShowPreview(true);

      const processed = Array.from(images).map((image) => {
        const row = rows.find((row) => row.orden == image.name.split(".")[0]);
        if (!row) {
          return {
            ...rows[0],
            orden: "0",
            nombre: "Grupal",
            foto: window.URL.createObjectURL(image),
          };
        }
        return { ...row, foto: window.URL.createObjectURL(image) };
      });

      setCurated(processed);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (file) {
      Papa.parse<Row>(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length) {
            console.error("Errors while parsing:", results.errors);
          }
          setRows(results.data);
        },
      });
    }
  }, [file]);

  return {
    rows,
    curated,
    isLoading,
    handleChange,
    images,
    handleImages,
    showPreview,
    handleGenerate,
  };
}

export type Hook = ReturnType<typeof useCsvParsing>;
