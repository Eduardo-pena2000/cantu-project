"use client";

import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function DataError({ error, onRetry }) {
  const router = useRouter();

  const isAppErrorInstance = error.name === "ApplicationError";

  function handleGoHomePage() {
    router.replace("/");
  }

  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="w-full flex flex-col justify-center items-center sm:flex-row gap-4 -translate-y-[var(--header-height)]">
        <div className='bg-[url("/svg/internal-error.svg")] bg-center w-full max-w-96 aspect-square' />
        <div className="text-center  max-w-xs space-y-2">
          <p>
            {isAppErrorInstance
              ? error.message
              : "Ha ocurrido un error inesperado. Por favor, intenta nuevamente."}
          </p>
          <p>Intenta refrescar la página, si el error persiste contacta nuestro soporte.</p>
          <div className="flex flex-col justify-center gap-2 sm:flex-row">
            <Button
              onClick={handleGoHomePage}
              variant="link"
              className="text-blue-400 font-semibold"
            >
              <span className="sr-only">Regresar al inicio</span>
              Regresar al inicio
            </Button>
            <Button
              onClick={onRetry}
              variant="ghost"
              className="text-blue-400 font-semibold hover:text-blue-400"
            >
              <span className="sr-only">Intentar de nuevo</span>
              Intentar de nuevo <RotateCcw />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
