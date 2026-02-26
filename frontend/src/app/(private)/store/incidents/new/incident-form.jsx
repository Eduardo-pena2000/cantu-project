"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImageIcon, Loader, Save } from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib";
import { createIncident } from "@/lib/mutations";

import { Title } from "@/components/title";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CancelButtonForm } from "@/components/cancel-button-form";
import { useSession } from "next-auth/react";

const formSchema = z.object({
    title: z.string().trim().min(3, "El título debe tener al menos 3 caracteres.").max(150, "El título es demasiado largo."),
    description: z.string().trim().min(10, "La descripción debe tener al menos 10 caracteres para entender el problema."),
    category: z.enum(["maintenance", "inventory", "hr", "operations", "suggestion"], {
        required_error: "Debes seleccionar una categoría.",
    }),
    priority: z.enum(["low", "medium", "high", "urgent"], {
        required_error: "Debes seleccionar una prioridad.",
    }),
});

export function IncidentForm({ onFormSubmit, className }) {
    const [img, setImg] = React.useState(null);
    const { data: session } = useSession();
    const storeId = session?.store?.id;

    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "",
            priority: "",
        },
    });

    function handleChangeImg(e) {
        const file = e.target?.files?.[0] ?? null;
        const validMimeTypes = ["image/jpeg", "image/jpg", "image/png"];

        if (file && validMimeTypes.includes(file.type)) {
            setImg(file);
        }
    }

    function handleCancel() {
        router.replace("/store/incidents");
    }

    async function onSubmit(values) {
        try {
            if (!storeId) {
                toast.error("No se encontró la tienda asociada a tu cuenta.");
                return;
            }

            if (img) {
                // Send as FormData to support file upload
                const formData = new FormData();
                formData.append("title", values.title);
                formData.append("description", values.description);
                formData.append("category", values.category);
                formData.append("priority", values.priority);
                formData.append("storeId", String(storeId));
                formData.append("image", img);

                const response = await fetch("/api/incidents", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || "Ocurrió un error al reportar la incidencia.");
                }
            } else {
                // Send as JSON (no image)
                const incidentData = {
                    ...values,
                    storeId: Number(storeId),
                };
                await createIncident({ data: incidentData });
            }

            toast.success("Tu incidencia ha sido reportada exitosamente.", { id: "create-incident" });

            if (onFormSubmit) {
                onFormSubmit();
            } else {
                router.replace("/store/incidents");
            }
        } catch (error) {
            toast.error(error.message || "Ocurrió un error al reportar la incidencia.", { id: "create-incident" });
        }
    }

    return (
        <div className={cn("w-full max-w-prose space-y-8 mx-auto", className)}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white/80 font-medium">
                                    Título de la incidencia
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus-visible:ring-primary/50"
                                        disabled={form.formState.isSubmitting}
                                        placeholder="Ej. Fuga de agua en el área de corte"
                                        type="text"
                                        autoComplete="off"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white/80 font-medium">Categoría</FormLabel>
                                    <Select
                                        disabled={form.formState.isSubmitting}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-primary/50">
                                                <SelectValue placeholder="Selecciona una categoría" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                                            <SelectItem value="maintenance">Mantenimiento</SelectItem>
                                            <SelectItem value="inventory">Inventario</SelectItem>
                                            <SelectItem value="operations">Operaciones</SelectItem>
                                            <SelectItem value="hr">Recursos Humanos</SelectItem>
                                            <SelectItem value="suggestion">Sugerencias</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white/80 font-medium">Prioridad</FormLabel>
                                    <Select
                                        disabled={form.formState.isSubmitting}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-primary/50">
                                                <SelectValue placeholder="Selecciona la prioridad" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                                            <SelectItem value="low">Baja</SelectItem>
                                            <SelectItem value="medium">Media</SelectItem>
                                            <SelectItem value="high">Alta</SelectItem>
                                            <SelectItem value="urgent">Urgente</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white/80 font-medium">
                                    Descripción detallada
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus-visible:ring-primary/50 min-h-[120px] resize-y"
                                        disabled={form.formState.isSubmitting}
                                        placeholder="Describe el problema con el mayor detalle posible..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-red-400" />
                            </FormItem>
                        )}
                    />

                    <div className="space-y-4">
                        <Label className="text-white/80 font-medium">Evidencia Fotográfica (Opcional)</Label>
                        <div className="flex items-center gap-4">
                            {img ? (
                                <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-primary/50">
                                    <Image
                                        src={URL.createObjectURL(img)}
                                        alt="Evidencia adjunta"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-32 h-32 rounded-xl border-2 border-dashed border-white/20 bg-white/5 flex flex-col items-center justify-center text-white/50 gap-2">
                                    <ImageIcon className="w-8 h-8 opacity-50" />
                                    <span className="text-xs text-center px-2">Sin imagen</span>
                                </div>
                            )}
                            <div className="flex flex-col gap-2">
                                <Button asChild variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white w-fit">
                                    <Label htmlFor="img" className="cursor-pointer">
                                        <ImageIcon className="w-4 h-4 mr-2" />
                                        <span>{!img ? "Subir fotografía" : "Cambiar fotografía"}</span>
                                    </Label>
                                </Button>
                                <p className="text-xs text-white/40 max-w-[200px]">
                                    Formatos soportados: JPG, PNG. Tamaño máximo: 5MB.
                                </p>
                                <Input
                                    hidden
                                    type="file"
                                    id="img"
                                    className="hidden"
                                    onChange={handleChangeImg}
                                    accept={["image/jpeg", "image/jpg", "image/png"].join(", ")}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-white/10">
                        <CancelButtonForm
                            disabled={form.formState.isSubmitting || form.formState.isSubmitSuccessful}
                            onCancel={handleCancel}
                            className="grow bg-white/5 border-white/10 text-white hover:bg-white/10"
                        />
                        <Button
                            disabled={form.formState.isSubmitting || form.formState.isSubmitSuccessful}
                            type="submit"
                            className="grow bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(255,107,0,0.3)] transition-all"
                        >
                            {form.formState.isSubmitting ? <Loader className="animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />} Enviar Reporte
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
