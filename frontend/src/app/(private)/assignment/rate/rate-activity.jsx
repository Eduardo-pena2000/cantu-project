"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Camera, Frown, Meh, Smile } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib";
import { safeUrlEncode } from "@/utils";

import { rateAssignment } from "@/actions/assignments";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from "@/components/ui/item";
import { Webcam } from "@/components/web-cam";

export function RateActivity({ assignmentId, isManager }) {
  const [isPending, startTransition] = React.useTransition();
  const [rate, setRate] = React.useState(null);
  const [observations, setObservations] = React.useState("");
  const [image, setImage] = React.useState(null);

  const router = useRouter();

  function handleRateActivity(rate) {
    return function () {
      setRate((prevRate) => {
        if (prevRate === rate) {
          return null;
        } else {
          return rate;
        }
      });
    };
  }

  function handleChange(event) {
    setObservations(event.target.value);
  }

  function handleTakeImage(img) {
    setImage(img);
  }

  async function handleSubmit() {
    if (rate === null) {
      toast.warning("Selecciona una calificación para esta actividad.", { id: "rate-activity" });
      return;
    }

    startTransition(async () => {
      try {
        const data = new FormData();
        data.append("assignment_activitie_id", assignmentId);

        if (image) {
          const blob = await fetch(image).then((res) => res.blob());
          data.append("image", blob);
        }

        if (isManager) {
          data.append("manager_note", rate);

          if (observations.trim()) {
            data.append("manager_comments", observations.trim());
          }

          await rateAssignment(data);
        } else {
          data.append("shift_manager_note", rate);

          if (observations.trim()) {
            data.append("shift_manager_comments", observations.trim());
          }

          await rateAssignment(data);
        }

        toast.success("Actividad calificada exitosamente.", { id: "rate-activity" });
        router.replace(`/assignment/details/${safeUrlEncode(assignmentId)}`);
      } catch (error) {
        toast.error(error.message, { id: "rate-activity" });
      }
    });
  }

  if (isManager) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={handleRateActivity(0)}
            variant="text"
            disabled={isPending}
            className={cn(
              "size-10 hover:text-destructive",
              rate === 0 && "text-destructive disabled:text-destructive"
            )}
          >
            <Frown className="size-10" />
          </Button>
          <Button
            onClick={handleRateActivity(50)}
            variant="text"
            disabled={isPending}
            className={cn(
              "size-10 hover:text-yellow-500",
              rate === 50 && "text-yellow-500 disabled:text-yellow-500"
            )}
          >
            <Meh className="size-10" />
          </Button>
          <Button
            onClick={handleRateActivity(100)}
            variant="text"
            disabled={isPending}
            className={cn(
              "size-10 hover:text-green-600",
              rate === 100 && "text-green-600 disabled:text-green-600"
            )}
          >
            <Smile className="size-10" />
          </Button>
        </div>

        <div className="grid gap-2">
          <Label className="text-muted-foreground font-semibold">Observaciones</Label>
          <Textarea
            disabled={isPending}
            rows={5}
            placeholder="Ingresa aquí cualquier observación que tengas sobre el cumplimiento de esta actividad."
            className="resize-none"
            value={observations}
            onChange={handleChange}
          />
        </div>

        {rate !== null && (
          <div className="flex justify-end items-center">
            <Button onClick={handleSubmit} disabled={isPending}>
              Confirmar
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          onClick={handleRateActivity(0)}
          variant="text"
          disabled={isPending}
          className={cn(
            "size-10 hover:text-destructive",
            rate === 0 && "text-destructive disabled:text-destructive"
          )}
        >
          <Frown className="size-10" />
        </Button>
        <Button
          onClick={handleRateActivity(50)}
          variant="text"
          disabled={isPending}
          className={cn(
            "size-10 hover:text-yellow-500",
            rate === 50 && "text-yellow-500 disabled:text-yellow-500"
          )}
        >
          <Meh className="size-10" />
        </Button>
        <Button
          onClick={handleRateActivity(100)}
          variant="text"
          disabled={isPending}
          className={cn(
            "size-10 hover:text-green-600",
            rate === 100 && "text-green-600 disabled:text-green-600"
          )}
        >
          <Smile className="size-10" />
        </Button>
      </div>

      <div className="grid gap-2">
        <Label className="text-muted-foreground font-semibold">Observaciones</Label>
        <Textarea
          disabled={isPending}
          rows={5}
          placeholder="Ingresa aquí cualquier observación que tengas sobre el cumplimiento de esta actividad."
          className="resize-none"
          value={observations}
          onChange={handleChange}
        />
      </div>

      {image === null ? (
        <Webcam
          title="Tomar evidencia"
          description={`
            Captura una imagen que sirva como evidencia del cumplimiento de la actividad.
            Asegúrate de que la foto refleje claramente el resultado o la tarea realizada.
          `}
          image={image}
          onTakeImage={handleTakeImage}
        >
          <button className="hover:cursor-pointer hover:opacity-50 duration-300 ">
            <Item variant="muted">
              <ItemHeader className="justify-center">
                <Camera className="size-24 aspect-square rounded-sm object-cover" />
              </ItemHeader>
              <ItemContent>
                <ItemTitle className="font-semibold mx-auto">Tomar evidencia</ItemTitle>
                <ItemDescription className="text-center line-clamp-none">
                  Captura una imagen que sirva como evidencia del cumplimiento de la actividad.
                  Asegúrate de que la foto refleje claramente el resultado o la tarea realizada.
                </ItemDescription>
              </ItemContent>
            </Item>
          </button>
        </Webcam>
      ) : (
        <div className="h-auto w-full overflow-hidden rounded-md">
          <img
            src={image}
            alt="Evidencia del cumplimiento de la actividad"
            className="h-full w-full object-contain"
          />
        </div>
      )}

      {rate !== null && image !== null && (
        <div className="flex justify-end items-center">
          <Button onClick={handleSubmit} disabled={isPending}>
            Confirmar
          </Button>
        </div>
      )}
    </div>
  );
}
