import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="w-full flex flex-col justify-center items-center gap-4">
        <div className='bg-[url("/svg/not-found.svg")] bg-center bg-no-repeat w-full max-w-xl aspect-video object-cover' />
        <div className="text-center max-w-xl space-y-4">
          <h1 className="text-2xl sm:text-4xl font-semibold leading-none">Página no encontrada</h1>
          <p>Lo sentimos, la página que buscas no existe.</p>
          <Button asChild variant="link" className="text-blue-400 font-semibold">
            <Link href="/">
              <span className="sr-only">Regresar al inicio</span>
              Regresar al inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
