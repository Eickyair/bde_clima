'use client'
import Head from "next/head";
import Link from "next/link";
import Visualizacion from "~/components/Visualizacion";
import { MapasProvider } from "~/context/Mapas";

import { api } from "~/utils/api";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <main>
        <MapasProvider>
        <Visualizacion />
        </MapasProvider>
      </main>
    </>
  );
}
