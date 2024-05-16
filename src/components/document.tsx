import { CuratedRow } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

type PDFProps = { items: CuratedRow[] };
const getPageMargins = () => {
  return `@page { margin: 0.5cm 0.5cm 0.5cm 0.5cm !important; }`;
};

export const PDF = ({ items }: PDFProps) => {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="flex justify-between flex-wrap flex-grow">
      <style>{getPageMargins()}</style>
      {items.map((item, index) => {
        return (
          <div
            key={index}
            className="flex border relative"
            style={{
              flexDirection: "row",
              width: "10cm",
              height: "5cm",
              flexShrink: 1,
              overflow: "hidden",
            }}
          >
            <img
              className={cn(
                "absolute w-[40px] h-[40px] right-0 mr-2",
                item.orientation === "landscape"
                  ? "rotate-[270deg] top-0 mt-3 mr-1"
                  : " bottom-0"
              )}
              src="/logo.svg"
            />
            {item.orientation === "landscape" ? (
              <img
                src={item.foto}
                style={{
                  width: "5cm",
                  height: `${5 * (3 / 4)}cm`, // Calculate height based on aspect ratio
                  marginInline: "-.6cm", // Don't ask me where this values come from, they're just magic.
                  marginTop: ".6cm", // Don't ask me where this values come from, they're just magic.
                  transform: "rotate(270deg)",
                }}
              />
            ) : (
              <img
                src={item.foto}
                style={{
                  height: "5cm",
                  aspectRatio: 3 / 4,
                }} // Set fixed height and let width adjust
              />
            )}

            <div
              className={
                item.orientation === "landscape" ? "rotate-[270deg]" : ""
              }
            >
              <div className="p-2">
                <span className="font-bold">Escuela</span>
                <span className="block">{item.escuela}</span>

                <div className="flex gap-3">
                  <div>
                    <span className="font-bold">Curso</span>
                    <span className="block">{item.division}</span>
                  </div>

                  <div>
                    <span className="font-bold">Orden</span>
                    <span className="block">{item.orden}</span>
                  </div>
                  <div>
                    <span className="font-bold">Año</span>
                    <span className="block">{year}</span>
                  </div>
                </div>

                <span className="font-bold">Nombre</span>
                <span className="block">{item.nombre}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
