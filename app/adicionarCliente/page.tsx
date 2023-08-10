"use client";

import db from "@/firebase/initFirebase";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import Header from "../_components/Header";
import "@reach/combobox/styles.css";

const API_KEY = "AIzaSyB-Rc5-aabPwuKWTFLBm65UHo7jqwJuXeE";

function Map({ value, setValue }: any) {
  const [selected, setSelected] = useState<any>(null);

  return (
    <>
      <div className="places-container">
        <PlacesAutocomplete
          setSelected={setSelected}
          valueString={value}
          setValueString={setValue}
        />
      </div>

      <GoogleMap
        zoom={70}
        center={selected}
        mapContainerClassName="map-container"
      >
        {selected && <Marker position={selected} />}
      </GoogleMap>
    </>
  );
}

const PlacesAutocomplete = ({
  setSelected,
  valueString,
  setValueString,
}: any) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const searchAddress = () => {
    setValue(valueString);
  };

  const handleSelect = async (address: any) => {
    setValue(address);
    clearSuggestions();
    setValueString(address);
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setSelected({ lat, lng });
  };

  return (
    <div className="flex w-full gap-2">
      <Combobox onSelect={handleSelect} className="w-full">
        <ComboboxInput
          required
          value={valueString}
          onChange={(e) => setValueString(e.target.value)}
          disabled={!ready}
          className="bg-gray-50 border text-lg border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Procurar endereço"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
      <button
        type="button"
        onClick={searchAddress}
        className="bg-blue-400 hover:bg-blue-500 px-4 rounded-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>
    </div>
  );
};

export function Places({ value, setValue }: any) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map value={value} setValue={setValue} />;
}

const AdicionarCliente = () => {
  const [email, setEmail] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const idCliente = searchParams.get("idCliente");

  const [distance, setDistance] = useState("");

  const getClienteAtual = async () => {
    try {
      if (idCliente !== "") {
        const clienteRef = doc(db, "clientes", idCliente!);
        const clienteData = (await getDoc(clienteRef)).data();

        setEmail(clienteData?.email);
        setOrigin(clienteData?.map.origem);
        setDestination(clienteData?.map.destino);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getClienteAtual();
  }, [idCliente]);

  const getDistance = async () => {
    if (origin !== "" && destination !== "") {
      const { distancia, tempo, status }: any = await calculateDistance();

      if (status === "ERRO") {
        console.log("erro");
        return;
      }

      setDistance(`Distância: ${distancia} metros em ${tempo}`);
    }
  };

  const calculateDistance = async () => {
    try {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${API_KEY}`;

      const response = await fetch(url);
      const json = await response.json();

      if (json.status === "OK") {
        const data = json.rows[0].elements[0];

        const distancia = data.distance.value;
        const tempo = data.duration.text;

        return { distancia, tempo, status: json.status };
      } else {
        return { distancia: 0, tempo: "", status: "ERRO" };
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addCliente = async (e: any) => {
    e.preventDefault();
    const { distancia, tempo, status }: any = await calculateDistance();

    if (status === "ERRO") {
      console.log("erro");
      return;
    }

    if (email !== "") {
      try {
        if (idCliente && idCliente !== "") {
          const clienteRef = doc(db, "clientes", idCliente!);
          await updateDoc(clienteRef, {
            email: email,
            map: {
              distancia,
              tempo,
              origem: origin,
              destino: destination,
            },
          });
        } else {
          console.log(email);
          console.log(distancia);
          console.log(tempo);

          console.log(origin);
          console.log(destination);
          await addDoc(collection(db, "clientes"), {
            email: email,
            map: {
              distancia,
              tempo,
              origem: origin,
              destino: destination,
            },
          });
        }

        router.push("/clientes");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="dark:text-white">
      <Header titulo="Adicionar Cliente" />
      <form
        onSubmit={addCliente}
        className="flex flex-col justify-center w-full gap-4"
      >
        <div className="w-full flex flex-col md:flex-row gap-4  justify-between place-items-center">
          <div className="w-full md:w-1/3">
            <label className="font-medium text-lg">
              Digite o nome do cliente:
            </label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              className="bg-gray-50 border text-lg border-gray-300 text-gray-900 mt-2 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Nome"
            />
          </div>
          {distance !== "" ? (
            <div className="p-4 border rounded-lg">
              <label className="text-xl">{distance}</label>
            </div>
          ) : null}
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-8 w-full">
          <div className="flex flex-col w-full gap-2">
            <label className="font-medium text-lg">Origem:</label>
            <Places value={origin} setValue={setOrigin} />
          </div>
          <div className="flex flex-col w-full gap-2">
            <label className="font-medium text-lg">Destino:</label>
            <Places value={destination} setValue={setDestination} />
          </div>
        </div>

        <div className="mt-4 flex justify-between w-full">
          <button
            onClick={(e) => {
              e.preventDefault();
              router.push("/");
            }}
            type="button"
            className="bg-gray-400 hover:bg-gray-500 mb-2 text-lg py-2 px-4 rounded-lg text-white font-medium"
          >
            Cancelar
          </button>
          <div>
            <button
              type="button"
              onClick={getDistance}
              className="bg-blue-400 px-4 py-2 rounded-lg"
            >
              Calcular
            </button>
          </div>

          <button
            type="submit"
            className="bg-green-400 hover:bg-green-500 mb-2 text-lg py-2 px-4 rounded-lg text-white font-medium"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdicionarCliente;
