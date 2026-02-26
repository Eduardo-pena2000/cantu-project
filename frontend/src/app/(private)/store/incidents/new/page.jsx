import { Title } from "@/components/title";
import { Subtitle } from "@/components/subtitle";
import { IncidentForm } from "./incident-form";

export default function NewIncidentPage() {
    return (
        <div className="flex flex-col gap-6 w-full relative z-10 m-auto mt-0 max-w-3xl h-full p-6">
            <div className="flex items-center justify-between">
                <div>
                    <Title>Reportar nueva incidencia</Title>
                    <Subtitle>Completa el formulario y adjunta evidencia fotográfica si es necesario.</Subtitle>
                </div>
            </div>

            <div className="bg-sidebar/50 backdrop-blur-xl border border-white/10 rounded-2xl w-full flex flex-col p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
                <IncidentForm />
            </div>
        </div>
    );
}
