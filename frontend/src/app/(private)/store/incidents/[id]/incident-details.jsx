"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader, Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib";
import { updateIncidentStatus } from "@/lib/mutations";
import { formatDate } from "@/utils";
import { useSession } from "next-auth/react";
import { hasRole } from "@/utils/user";
import { ROLES } from "@/data/constants";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
    status: z.enum(["pending", "in_progress", "resolved", "rejected"], {
        required_error: "Debes seleccionar un estado.",
    }),
    resolutionNotes: z.string().trim().optional(),
});

export function IncidentDetails({ incident, className }) {
    const router = useRouter();
    const { data: session } = useSession();

    const isManager = hasRole(session, [
        ROLES.ADMIN.slug,
        ROLES.GENERAL_MANAGER.slug,
        ROLES.STORE_MANAGER.slug,
        ROLES.SHIFT_MANAGER.slug,
        ROLES.TEMPORARY_SHIFT_MANAGER.slug,
        ROLES.SUPERVISOR.slug
    ]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: incident.status,
            resolutionNotes: incident.resolutionNotes || "",
        },
    });

    async function onSubmit(values) {
        try {
            await updateIncidentStatus({ id: incident.id, data: values });
            toast.success("El estado de la incidencia ha sido actualizado exitosamente.");
            router.refresh();
        } catch (error) {
            toast.error(error.message || "Ocurrió un error al actualizar la incidencia.");
        }
    }

    const categoryLabels = {
        maintenance: "Mantenimiento",
        inventory: "Inventario",
        hr: "Recursos Humanos",
        operations: "Operaciones",
        suggestion: "Sugerencias",
    };

    const priorityColors = {
        low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
        urgent: "bg-red-500/10 text-red-500 border-red-500/20",
    };

    const priorityLabels = {
        low: "Baja",
        medium: "Media",
        high: "Alta",
        urgent: "Urgente"
    };

    const statusColors = {
        pending: "bg-slate-500/10 text-slate-500 border-slate-500/20",
        in_progress: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        resolved: "bg-green-500/10 text-green-500 border-green-500/20",
        rejected: "bg-red-500/10 text-red-500 border-red-500/20",
    };

    const statusLabels = {
        pending: "Pendiente",
        in_progress: "En progreso",
        resolved: "Resuelta",
        rejected: "Rechazada"
    };

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <Button
                variant="ghost"
                className="w-fit mb-2 text-white/50 hover:text-white hover:bg-white/5 bg-transparent"
                onClick={() => router.back()}
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a incidencias
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-sidebar/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white">{incident.title}</h2>
                                <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                                    <span>Reportado el {formatDate(incident.createdAt)}</span>
                                    <span className="flex items-center gap-2">
                                        <Badge variant="outline" className={statusColors[incident.status]}>
                                            {statusLabels[incident.status]}
                                        </Badge>
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 text-sm">
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                    {categoryLabels[incident.category]}
                                </Badge>
                                <Badge variant="outline" className={priorityColors[incident.priority]}>
                                    {priorityLabels[incident.priority]}
                                </Badge>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-semibold text-white/90">Descripción del problema</h3>
                            <p className="text-white/70 whitespace-pre-wrap leading-relaxed">
                                {incident.description}
                            </p>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50 overflow-hidden">
                                {incident.reportedBy?.avatar ? (
                                    <Image src={incident.reportedBy.avatar} alt="Avatar" width={40} height={40} className="object-cover" />
                                ) : (
                                    <span className="font-medium text-sm text-white/80">{incident.reportedBy?.names?.[0] || "?"}</span>
                                )}
                            </div>
                            <div className="flex flex-col text-sm">
                                <span className="text-white/90 font-medium">Reportado por</span>
                                <span className="text-white/50">{incident.reportedBy?.names} {incident.reportedBy?.last_names}</span>
                            </div>
                        </div>
                    </div>

                    {/* Image Evidence display, assuming future integration */}
                    <div className="bg-sidebar/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
                        <h3 className="font-semibold text-white/90 mb-4">Evidencia Fotográfica</h3>
                        {incident.imageUrl ? (
                            <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border border-white/10">
                                <Image src={incident.imageUrl} alt="Evidencia" fill className="object-contain bg-black/20" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 rounded-xl bg-white/5 text-white/50 gap-2">
                                <ImageIcon className="w-8 h-8 opacity-50" />
                                <span>No se adjuntó evidencia fotográfica</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Actions (Visible mainly for managers) */}
                <div className="space-y-6">
                    <div className="bg-sidebar/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] sticky top-6">
                        <h3 className="font-semibold text-white/90 mb-4 pb-2 border-b border-white/10">Resolución</h3>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white/80 font-medium">Estado de la incidencia</FormLabel>
                                            <Select
                                                disabled={!isManager || form.formState.isSubmitting}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-primary/50">
                                                        <SelectValue placeholder="Actualizar estado" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-slate-900 border-white/10 text-white">
                                                    <SelectItem value="pending">Pendiente</SelectItem>
                                                    <SelectItem value="in_progress">En progreso</SelectItem>
                                                    <SelectItem value="resolved">Resuelta</SelectItem>
                                                    <SelectItem value="rejected">Rechazada</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="resolutionNotes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-white/80 font-medium">Notas de resolución</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus-visible:ring-primary/50 min-h-[120px] resize-y"
                                                    disabled={!isManager || form.formState.isSubmitting}
                                                    placeholder="Añade comentarios sobre cómo se resolvió o por qué se rechazó..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                {isManager ? (
                                    <Button
                                        disabled={form.formState.isSubmitting}
                                        type="submit"
                                        className="w-full bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(255,107,0,0.3)] transition-all"
                                    >
                                        {form.formState.isSubmitting ? <Loader className="animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Actualizar
                                    </Button>
                                ) : (
                                    <p className="text-xs text-white/40 text-center">
                                        Solo los gerentes pueden actualizar el estado de las incidencias.
                                    </p>
                                )}
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}
