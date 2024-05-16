import { Hook } from "@/lib/useCsvParsing";
import { PDF } from "../document";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "../ui/button";
import { Printer } from "lucide-react";

type FormProps = { hook: Hook };

export function Preview({ hook }: FormProps) {
  const { curated, isLoading } = hook;
  const contentToPrint = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    documentTitle: isLoading ? "" : curated[0].escuela,
    removeAfterPrint: true,
  });

  if (isLoading) {
    return <div>Cargando</div>;
  }

  return (
    <>
      <div className="w-full p-5 pb-10 mx-auto mb-10 gap-5 columns-4 space-y-5">
        <div ref={contentToPrint}>
          <PDF items={curated} />
        </div>
      </div>
      <Button
        variant="secondary"
        onClick={() => {
          handlePrint(null, () => contentToPrint.current);
        }}
      >
        Imprimir <Printer className="w-4 h-4 ml-2" />
      </Button>
    </>
  );
}
