import { useNames } from "./features/names/hooks/use-names";

function App() {
  const { data: names, isLoading, error } = useNames();
  
  console.log({ names, isLoading, error });

  return (
      <div className="App"></div>
  )
}

export default App
