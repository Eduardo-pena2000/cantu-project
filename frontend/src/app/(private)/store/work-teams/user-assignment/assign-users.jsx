"use client";

import * as React from "react";

import { getTeams } from "@/lib/queries";

import { AsyncSelect } from "@/components/async-select";
import { SelectUsers } from "./select-users";

export default function AssignUsers() {
  const [teamId, setTeamId] = React.useState(null);

  function handleSelectTeam(newTeam) {
    setTeamId(newTeam ?? null);
  }

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <p className="text-muted-foreground leading-tight text-sm">
          Selecciona un equipo de trabajo para continuar con la asignación de usuarios.
        </p>
        <AsyncSelect
          optionsKey="teams"
          value={teamId ?? ""}
          searchLabel="Buscar equipo de trabajo..."
          dtoFn={(team) => ({ value: team.id, label: team.name })}
          getOptions={(params) => getTeams({ ...params, isActive: true })}
          onValueChange={handleSelectTeam}
        />
      </div>

      {teamId && <SelectUsers key={teamId} teamId={teamId} />}
    </section>
  );
}
