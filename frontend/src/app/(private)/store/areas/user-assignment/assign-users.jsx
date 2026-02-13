"use client";

import * as React from "react";

import { getAreas } from "@/lib/queries";

import { AsyncSelect } from "@/components/async-select";
import { SelectUsers } from "./select-users";

export default function AssignUsers() {
  const [area, setArea] = React.useState(null);

  function handleSelectArea(newArea) {
    setArea(newArea ?? null);
  }

  function handleCancel() {
    setArea(null);
  }

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <p className="text-muted-foreground leading-tight text-sm">
          Selecciona un área para continuar con la asignación de usuarios.
        </p>
        <AsyncSelect
          optionsKey="areas"
          value={area ?? ""}
          searchLabel="Buscar área..."
          dtoFn={(area) => ({ value: area.id, label: area.name })}
          getOptions={getAreas}
          onValueChange={handleSelectArea}
        />
      </div>

      {area && <SelectUsers key={area} area={area} onCancel={handleCancel} />}
    </section>
  );
}
