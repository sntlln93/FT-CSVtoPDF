import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { Hook } from "@/lib/useCsvParsing";
import { Label } from "../ui/label";

type FormProps = { hook: Hook };

export function Form({ hook }: FormProps) {
  const { handleChange, isLoading, handleImages, handleGenerate } = hook;

  return (
    <div className="max-w-[500px] flex flex-col gap-5">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="csv">Datos</Label>
        <Input id="csv" type="file" accept=".csv" onChange={handleChange} />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="photos">Fotos</Label>
        <Input
          id="photos"
          type="file"
          accept=".jpg"
          webkitdirectory=""
          mozdirectory=""
          directory=""
          onChange={handleImages}
        />
      </div>
      <Button variant="secondary" disabled={isLoading} onClick={handleGenerate}>
        Siguiente{" "}
        {isLoading ? (
          <Spinner className="w-4 h-4 ml-2" />
        ) : (
          <ArrowRight className="w-4 h-4 ml-2" />
        )}
      </Button>
    </div>
  );
}
