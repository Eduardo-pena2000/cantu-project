"use client";

import * as React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";

export function ReportsDetailList({ employees }) {
  if (!employees || employees.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-4">
      <Accordion type="multiple" className="w-full flex flex-col gap-3">
        {employees.map((employee) => {
          // Calcular el promedio general de todas sus asistencias
          let totalNotes = 0;
          let totalActivities = 0;

          employee.assistances?.forEach(ast => {
            ast.activities_asigments?.forEach(act => {
              if (act.note !== undefined && act.note !== null && act.is_completed) {
                totalNotes += Number(act.note);
                totalActivities++;
              }
            });
          });

          const avgScore = totalActivities > 0 ? Math.round(totalNotes / totalActivities) : 0;
          
          let avgColor = "bg-slate-100 text-slate-700";
          if (avgScore >= 80) avgColor = "bg-green-100 text-green-800 border-green-200";
          else if (avgScore >= 50) avgColor = "bg-yellow-100 text-yellow-800 border-yellow-200";
          else if (totalActivities > 0) avgColor = "bg-red-100 text-red-800 border-red-200";

          return (
            <AccordionItem 
              key={employee.id} 
              value={String(employee.id)}
              className="border rounded-xl bg-card px-4 shadow-sm"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-4 text-left w-full">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={employee.avatar_url || ""} />
                    <AvatarFallback>{employee.names?.charAt(0)}{employee.last_names?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{employee.names} {employee.last_names}</p>
                    <p className="text-xs text-muted-foreground truncate">{employee.roles?.name || "Trabajador"}</p>
                  </div>
                  <div className="mr-4 flex flex-col items-end">
                    <Badge variant="secondary" className={avgColor}>
                      {totalActivities > 0 ? `${avgScore} Promedio Global` : 'Sin calificaciones'}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground mt-1">
                      {employee.assistances?.length || 0} Días registrados
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-6">
                <div className="space-y-6">
                  {employee.assistances?.sort((a, b) => new Date(b.date_assistance) - new Date(a.date_assistance)).map((assistance) => {
                    // Evitar el error si la fecha es inválida
                    let dateFormatted = "Fecha no disponible";
                    try {
                        if (assistance.date_assistance) {
                            dateFormatted = format(new Date(assistance.date_assistance), "EEEE, d 'de' MMMM yyyy", { locale: es });
                        }
                    } catch (e) {}

                    const activities = assistance.activities_asigments || [];

                    return (
                      <div key={assistance.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-muted/30 px-4 py-2 border-b flex justify-between items-center">
                          <span className="font-medium text-sm capitalize">{dateFormatted}</span>
                          <span className="text-xs text-muted-foreground">{activities.length} Tareas Asignadas</span>
                        </div>
                        
                        {activities.length > 0 ? (
                          <div className="divide-y">
                            {activities.map(act => {
                              const note = Number(act.note || 0);
                              let noteColor = "text-slate-500 bg-slate-100";
                              let StatusIcon = AlertCircle;
                              
                              if (act.is_completed) {
                                if (note >= 80) {
                                  noteColor = "text-green-700 bg-green-100/50";
                                  StatusIcon = CheckCircle2;
                                } else if (note >= 50) {
                                  noteColor = "text-yellow-700 bg-yellow-100/50";
                                  StatusIcon = Clock;
                                } else {
                                  noteColor = "text-red-700 bg-red-100/50";
                                  StatusIcon = XCircle;
                                }
                              }

                              return (
                                <div key={act.id} className="p-3 flex items-start gap-3 hover:bg-muted/10 transition-colors">
                                  <div className={`mt-0.5 rounded-full p-1 ${noteColor}`}>
                                    <StatusIcon className="h-4 w-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">{act.activity?.name || "Actividad Desconocida"}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{act.activity?.description || "Sin descripción"}</p>
                                    
                                    <div className="flex gap-2 mt-2">
                                      {act.is_late && (
                                        <Badge variant="outline" className="text-[10px] text-red-600 border-red-200 bg-red-50">
                                          Entregado Tarde
                                        </Badge>
                                      )}
                                      {!act.is_completed && (
                                        <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-200">
                                          Pendiente
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end justify-center">
                                    {act.is_completed ? (
                                      <div className="text-right">
                                        <span className={`text-lg font-bold ${noteColor.split(' ')[0]}`}>{note}</span>
                                        <span className="text-xs text-muted-foreground block">Calificación</span>
                                      </div>
                                    ) : (
                                      <span className="text-xs text-muted-foreground italic mt-2">Sin calificar</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-sm text-muted-foreground italic">
                            No se asignaron tareas en este día.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
