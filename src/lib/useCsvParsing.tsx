import { ChangeEvent, useEffect, useState } from "react";
import Papa from "papaparse";
import { CuratedRow, Row } from "./types";

const COLUMNS: (keyof Row)[] = ["escuela", "division", "orden", "nombre"];

const HEADER_ALIASES: Record<string, keyof Row> = {
  escuela: "escuela",
  division: "division",
  curso: "division",
  sala: "division",
  seno: "division",
  orden: "orden",
  nombre: "nombre",
};

// Normaliza el encabezado (minúsculas, sin acentos ni caracteres raros) y lo
// mapea a una columna conocida. Si no se reconoce, se usa la posición.
function normalizeHeader(header: string, index: number) {
  const key = header
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
  return HEADER_ALIASES[key] ?? COLUMNS[index] ?? header;
}

// Excel en español suele exportar en Windows-1252 en vez de UTF-8.
async function readFileText(file: File) {
  const buffer = await file.arrayBuffer();
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    return new TextDecoder("windows-1252").decode(buffer);
  }
}

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
      readFileText(file).then((text) => {
        const results = Papa.parse<Row>(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          transformHeader: normalizeHeader,
        });
        if (results.errors.length) {
          console.error("Errors while parsing:", results.errors);
        }
        setRows(results.data);
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
