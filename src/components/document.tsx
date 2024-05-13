import { Row } from "@/lib/types";

type PDFProps = { items: Row[] };
const getPageMargins = () => {
  return `@page { margin: 0.5cm 0.5cm 0.5cm 0.5cm !important; }`;
};

export const PDF = ({ items }: PDFProps) => {
  return (
    <div className="flex justify-between flex-wrap flex-grow">
      <style>{getPageMargins()}</style>
      {items.map((item, index) => {
        return (
          <div
            key={index}
            className="flex border"
            style={{
              flexDirection: "row",
              width: "10cm",
              height: "5cm",
              flexShrink: 1,
              overflow: "hidden",
            }}
          >
            <img
              src={item.foto}
              style={{ height: "100%", aspectRatio: 2 / 3 }}
            />
            <div className="p-2">
              <span className="font-bold">Escuela</span>
              <span className="block">{item.escuela}</span>

              <span className="font-bold">Curso</span>
              <span className="block">{item.division}</span>

              <span className="font-bold">Nombre</span>
              <span className="block">{item.nombre}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
