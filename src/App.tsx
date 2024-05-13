import { useCsvParsing } from "./lib/useCsvParsing";
import { Form } from "./components/form";
import { Preview } from "./components/preview";

function App() {
  const hook = useCsvParsing();

  return (
    <div className="bg-primary flex flex-col w-screen min-h-screen justify-center items-center text-primary-foreground">
      {hook.showPreview ? <Preview hook={hook} /> : <Form hook={hook} />}
    </div>
  );
}

export default App;
