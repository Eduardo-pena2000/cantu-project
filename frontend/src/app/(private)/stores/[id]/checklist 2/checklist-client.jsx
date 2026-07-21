"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ClipboardList, History } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Title } from "@/components/title";
import { Subtitle } from "@/components/subtitle";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ChecklistForm } from "@/components/dashboard/checklist-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHECKLIST_SECTIONS } from "@/data/constants";

export function ChecklistClient({ store }) {
    const [history, setHistory] = useState([]);
    const [activeTab, setActiveTab] = useState("nuevo");

    // Load history on mount
    useEffect(() => {
        const stored = localStorage.getItem(`checklist_history_${store.id}`);
        if (stored) {
            try {
                setHistory(JSON.parse(stored));
            } catch (e) {
                console.error("Error parsing checklist history", e);
            }
        }
    }, [store.id]);

    const handleSaveChecklist = (newChecklistData) => {
        const newRecord = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            ...newChecklistData
        };
        const updatedHistory = [newRecord, ...history];
        setHistory(updatedHistory);
        localStorage.setItem(`checklist_history_${store.id}`, JSON.stringify(updatedHistory));
        setActiveTab("historial");
    };

    return (
        <div className="flex flex-col gap-6">
            <header className="flex flex-col gap-2">
                <Link href={`/stores/${store.id}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-fit mb-2 transition-colors">
                    <ArrowLeft className="size-4" /> Regresar a Tienda
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <Title>Checklist Diario</Title>
                        <Subtitle className="flex items-center gap-2">
                            {store.name} <Badge variant="outline">{store.code}</Badge>
                        </Subtitle>
                    </div>
                </div>
            </header>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mb-4">
                    <TabsTrigger value="nuevo" className="flex items-center gap-2">
                        <ClipboardList className="size-4" /> Nuevo Checklist
                    </TabsTrigger>
                    <TabsTrigger value="historial" className="flex items-center gap-2">
                        <History className="size-4" /> Historial
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="nuevo" className="mt-4">
                    <ChecklistForm store={store} onSave={handleSaveChecklist} />
                </TabsContent>

                <TabsContent value="historial" className="mt-4">
                    {history.length === 0 ? (
                        <Card className="glass border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                <History className="size-12 mb-4 opacity-20" />
                                <p>No hay checklists guardados en el historial para esta tienda.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2">
                            {history.map((record) => (
                                <Card key={record.id} className="hover-glow-border glass">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex justify-between items-center text-lg">
                                            <span>Checklist</span>
                                            <span className="text-sm font-normal text-muted-foreground">
                                                {format(new Date(record.date), "dd MMM yyyy, HH:mm", { locale: es })}
                                            </span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col gap-4 mt-2">
                                            <div className="flex justify-between items-center">
                                                <div className="text-sm">
                                                    <span className="text-muted-foreground">Puntuación Total: </span>
                                                    <span className="font-bold">{record.totalScore} / {record.maxScore}</span>
                                                </div>
                                                <Badge variant={record.totalScore >= record.maxScore * 0.8 ? "default" : "destructive"}>
                                                    {((record.totalScore / record.maxScore) * 100).toFixed(0)}%
                                                </Badge>
                                            </div>

                                            {/* Render comments if any exist */}
                                            {(() => {
                                                const comments = Object.entries(record.answers || {})
                                                    .filter(([_, answer]) => answer.observation && answer.observation.trim() !== "")
                                                    .map(([itemId, answer]) => {
                                                        let itemText = "Elemento";
                                                        let sectionText = "Categoría";
                                                        CHECKLIST_SECTIONS.forEach(sec => {
                                                            const found = sec.items.find(i => i.id === itemId);
                                                            if (found) {
                                                                itemText = found.text;
                                                                sectionText = sec.title;
                                                            }
                                                        });
                                                        return { section: sectionText, text: itemText, observation: answer.observation };
                                                    });

                                                if (comments.length === 0) return null;

                                                return (
                                                    <div className="mt-2 pt-4 border-t border-slate-100">
                                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Comentarios Adicionales</p>
                                                        <div className="flex flex-col gap-3">
                                                            {comments.map((comment, i) => (
                                                                <div key={i} className="bg-slate-50 rounded-xl p-3 text-sm">
                                                                    <p className="text-xs font-bold text-blue-600 uppercase mb-1">{comment.section}</p>
                                                                    <p className="font-semibold text-slate-700 mb-1 leading-tight">{comment.text}</p>
                                                                    <p className="text-slate-600 italic">"{comment.observation}"</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
