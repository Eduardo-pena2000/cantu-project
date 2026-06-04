"use client";

import { useState } from "react";
import { Save, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { CHECKLIST_SECTIONS } from "@/data/constants";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const SCORE_OPTIONS = [
    { label: "Bueno", value: 10, icon: CheckCircle2, colorClass: "text-green-500 hover:bg-green-500/10 data-[active=true]:bg-green-500/20 data-[active=true]:border-green-500" },
    { label: "Regular", value: 5, icon: AlertTriangle, colorClass: "text-yellow-500 hover:bg-yellow-500/10 data-[active=true]:bg-yellow-500/20 data-[active=true]:border-yellow-500" },
    { label: "Malo", value: 0, icon: XCircle, colorClass: "text-red-500 hover:bg-red-500/10 data-[active=true]:bg-red-500/20 data-[active=true]:border-red-500" }
];

export function ChecklistForm({ store, onSave }) {
    // State: { [itemId]: { score: number, observation: string } }
    const [answers, setAnswers] = useState({});

    const handleScoreChange = (itemId, score) => {
        setAnswers(prev => ({
            ...prev,
            [itemId]: { ...prev[itemId], score }
        }));
    };

    const handleObservationChange = (itemId, observation) => {
        setAnswers(prev => ({
            ...prev,
            [itemId]: { ...prev[itemId], observation }
        }));
    };

    // Calculate totals
    let totalScore = 0;
    let maxScore = 0;

    CHECKLIST_SECTIONS.forEach(section => {
        section.items.forEach(item => {
            maxScore += 10; // Max points per item is 10
            if (answers[item.id] && answers[item.id].score !== undefined) {
                totalScore += answers[item.id].score;
            }
        });
    });

    const isComplete = CHECKLIST_SECTIONS.every(section => 
        section.items.every(item => answers[item.id] && answers[item.id].score !== undefined)
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            answers,
            totalScore,
            maxScore,
            percentage: (totalScore / maxScore) * 100
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 pb-12">
            
            {/* Sticky Header for Progress */}
            <div className="sticky top-0 z-10 p-4 rounded-xl border bg-background/80 backdrop-blur-md shadow-sm flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">Progreso del Checklist</span>
                    <span className="text-xl font-bold">
                        {Object.keys(answers).filter(k => answers[k].score !== undefined).length} / {maxScore / 10} completados
                    </span>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-sm font-medium text-muted-foreground">Puntuación</span>
                    <span className="text-xl font-bold text-primary">{totalScore} pts</span>
                </div>
                <Button type="submit" disabled={!isComplete} className="gap-2">
                    <Save className="size-4" /> Guardar Checklist
                </Button>
            </div>

            {CHECKLIST_SECTIONS.map((section, idx) => (
                <Card key={section.id} className="border-sidebar-border/50 shadow-sm animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                    <CardHeader className="bg-sidebar-accent/30 border-b">
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {section.items.map((item, itemIdx) => {
                            const currentAnswer = answers[item.id] || {};
                            return (
                                <div key={item.id} className="flex flex-col md:flex-row gap-4 p-4 items-start md:items-center justify-between border-b last:border-0 hover:bg-muted/30 transition-colors">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium leading-tight mb-2">{itemIdx + 1}. {item.text}</p>
                                        <Input 
                                            placeholder="Observaciones (Opcional)" 
                                            className="h-8 text-xs max-w-sm bg-transparent"
                                            value={currentAnswer.observation || ""}
                                            onChange={(e) => handleObservationChange(item.id, e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-row gap-2 w-full md:w-auto shrink-0 justify-between md:justify-end">
                                        {SCORE_OPTIONS.map(opt => {
                                            const Icon = opt.icon;
                                            const isActive = currentAnswer.score === opt.value;
                                            return (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    data-active={isActive}
                                                    onClick={() => handleScoreChange(item.id, opt.value)}
                                                    className={`flex flex-col items-center justify-center border rounded-lg px-3 py-2 text-xs font-medium transition-all w-20
                                                        ${opt.colorClass} 
                                                        ${isActive ? 'border-2 scale-[1.02]' : 'border-transparent bg-muted text-muted-foreground opacity-70'}
                                                    `}
                                                >
                                                    <Icon className="size-4 mb-1" />
                                                    {opt.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            ))}

            <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" disabled={!isComplete} className="gap-2">
                    <Save className="size-5" /> Guardar Checklist
                </Button>
            </div>
            
        </form>
    );
}
