import { ChangeEvent, useEffect, useState } from "react";
import Papa from "papaparse";
import { CuratedRow, Row } from "./types";

export function useCsvParsing() {
  const [file, setFile] = useState<File>();
  const [rows, setRows] = useState<Row[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<FileList>();
  const [showPreview, setShowPreview] = useState(false);

  const [curated, setCurated] = useState<CuratedRow[]>([]);

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

  async function handleGenerate() {
    if (rows && images) {
      setIsLoading(true);
      setShowPreview(true);

      const processed = await Promise.all(
        Array.from(images).map(async (image) => {
          const row = rows.find((row) => row.orden == image.name.split(".")[0]);
          if (!row) {
            return;
          }
          const imageUrl = window.URL.createObjectURL(image);
          const img = new Image();
          img.src = imageUrl;
          return new Promise((resolve) => {
            img.onload = () => {
              const orientation =
                img.width > img.height ? "landscape" : "portrait";
              resolve({ ...row, foto: imageUrl, orientation: orientation });
            };
          });
        })
      );
      const newCurated = processed.filter(
        (r): r is CuratedRow => r !== undefined
      );
      console.log({ processed, newCurated });
      setCurated(newCurated);
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
