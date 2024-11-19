import { Visualizacion } from "./components/Visualizacion";
import { GeoJSONProvider } from "./context/GeoJSON";
import { MapasProvider } from "./context/Mapas";
import { PrimeReactProvider } from 'primereact/api';


const App = () => {
  return (
    <>
      <PrimeReactProvider><MapasProvider>
        <Visualizacion />
      </MapasProvider></PrimeReactProvider>
    </>
  );
};

export default App;