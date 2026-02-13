"use client";

import * as React from "react";
import ReactWebcam from "react-webcam";
import { Check, CircleX, RotateCcw } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function Webcam({
  children,
  title,
  description,
  image,
  onTakeImage,
  facingMode = "environment",
}) {
  const [temporalImage, setTemporalImage] = React.useState(image ?? null);

  const videoConstraints = {
    facingMode,
    focusMode: "continuous",
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        className="bg-foreground h-dvh w-screen !max-h-none !max-w-none rounded-none [&>div]:p-0 border-none"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="webcam-container">
          {temporalImage === null ? (
            <ReactWebcam
              audio={false}
              imageSmoothing
              screenshotFormat="image/jpeg"
              screenshotQuality={1}
              videoConstraints={videoConstraints}
              className="webcam"
            >
              {({ getScreenshot }) => (
                <button
                  onClick={() => {
                    const imageSrc = getScreenshot();
                    setTemporalImage(imageSrc);
                  }}
                  className="capture-btn"
                />
              )}
            </ReactWebcam>
          ) : (
            <div className="h-full w-full absolute inset-0 object-cover">
              <img
                src={temporalImage}
                alt="Evidencia del cumplimiento de la actividad"
                className="h-full w-full object-cover"
              />
              <div className="webcam-actions">
                <button
                  onClick={() => setTemporalImage(null)}
                  className="bg-foreground p-2 rounded-full"
                >
                  <RotateCcw className="text-white size-9" />
                </button>
                <DialogClose asChild>
                  <button
                    onClick={() => onTakeImage(temporalImage)}
                    className="bg-green-600 p-2 rounded-full"
                  >
                    <Check className="text-white size-9" />
                  </button>
                </DialogClose>
              </div>
            </div>
          )}
          <DialogClose asChild>
            <Button variant="text" size="icon" className="absolute top-2 right-2">
              <CircleX className="text-destructive size-8" />
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
