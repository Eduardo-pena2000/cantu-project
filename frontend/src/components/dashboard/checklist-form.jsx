"use client";

import { useState } from "react";
import { Save, CheckCircle2, AlertTriangle, XCircle, ClipboardCheck, Sparkles, Wand2 } from "lucide-react";
import { CHECKLIST_SECTIONS } from "@/data/constants";
import { motion, AnimatePresence } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SCORE_OPTIONS = [
    { label: "Bueno", value: 10, icon: CheckCircle2, colorClass: "text-emerald-500", activeBg: "bg-emerald-50 border-emerald-500", inactiveBg: "bg-slate-50 border-slate-200 hover:border-emerald-200" },
    { label: "Regular", value: 5, icon: AlertTriangle, colorClass: "text-amber-500", activeBg: "bg-amber-50 border-amber-500", inactiveBg: "bg-slate-50 border-slate-200 hover:border-amber-200" },
    { label: "Malo", value: 0, icon: XCircle, colorClass: "text-rose-500", activeBg: "bg-rose-50 border-rose-500", inactiveBg: "bg-slate-50 border-slate-200 hover:border-rose-200" }
];

export function ChecklistForm({ store, onSave }) {
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

    const handleRandomFill = () => {
        const newAnswers = { ...answers };
        const possibleScores = [10, 5, 0];
        CHECKLIST_SECTIONS.forEach(section => {
            section.items.forEach(item => {
                const randomScore = possibleScores[Math.floor(Math.random() * possibleScores.length)];
                newAnswers[item.id] = { ...newAnswers[item.id], score: randomScore };
            });
        });
        setAnswers(newAnswers);
    };

    let totalScore = 0;
    let maxScore = 0;
    let completedItems = 0;

    CHECKLIST_SECTIONS.forEach(section => {
        section.items.forEach(item => {
            maxScore += 10;
            if (answers[item.id] && answers[item.id].score !== undefined) {
                totalScore += answers[item.id].score;
                completedItems++;
            }
        });
    });

    const totalItems = maxScore / 10;
    const progressPercentage = (completedItems / totalItems) * 100;
    const isComplete = completedItems === totalItems;

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
        <form onSubmit={handleSubmit} className="flex flex-col gap-10 pb-16 relative">
            
            {/* Sticky Header Premium */}
            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-4 z-40 p-5 rounded-[2rem] border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(27,79,143,0.08)] flex flex-col gap-4 overflow-hidden"
            >
                {/* Fondo animado del header */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-transparent pointer-events-none" />
                
                <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-[#1B4F8F] rounded-2xl shadow-lg shadow-blue-500/20 hidden md:block">
                            <ClipboardCheck className="text-white size-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Progreso Diario</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black tracking-tight text-[#1B4F8F]">{completedItems}</span>
                                <span className="text-sm font-bold text-slate-400">/ {totalItems}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="hidden lg:flex flex-col text-right">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Puntuación</span>
                        <div className="flex items-baseline justify-end gap-1">
                            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-[#1B4F8F]">
                                {totalScore}
                            </span>
                            <span className="text-sm font-bold text-slate-400">pts</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                        <Button 
                            type="button" 
                            variant="outline"
                            onClick={handleRandomFill}
                            className="rounded-full px-4 border-dashed border-blue-300 text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            title="Llenar aleatoriamente (Pruebas)"
                        >
                            <Wand2 className="size-4 mr-2" />
                            Auto-Llenar
                        </Button>

                        <Button 
                            type="submit" 
                            disabled={!isComplete} 
                            className={`rounded-full px-8 py-6 h-auto font-bold tracking-wide transition-all shadow-xl ${isComplete ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-blue-500/30 hover:scale-105' : 'bg-slate-100 text-slate-400 shadow-none'}`}
                        >
                            {isComplete ? <Sparkles className="size-5 mr-2 animate-pulse text-white" /> : <Save className="size-5 mr-2" />}
                            Terminar Revisión
                        </Button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative z-10 w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`h-full rounded-full ${progressPercentage === 100 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-blue-400 to-[#1B4F8F]'}`}
                    />
                </div>
            </motion.div>

            <div className="flex flex-col gap-8">
                {CHECKLIST_SECTIONS.map((section, idx) => (
                    <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                    >
                        <Card className="overflow-hidden border-0 rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.04)] bg-white/80 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 px-8 py-6">
                                <CardTitle className="text-xl font-extrabold text-[#1B4F8F] flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm">{idx + 1}</span>
                                    {section.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                {section.items.map((item, itemIdx) => {
                                    const currentAnswer = answers[item.id] || {};
                                    const isAnswered = currentAnswer.score !== undefined;
                                    
                                    return (
                                        <div key={item.id} className={`flex flex-col xl:flex-row gap-6 p-6 md:p-8 items-start xl:items-center justify-between border-b border-slate-50 last:border-0 transition-colors ${isAnswered ? 'bg-white' : 'hover:bg-slate-50/50'}`}>
                                            <div className="flex-1 w-full">
                                                <div className="flex items-start gap-3 mb-3">
                                                    <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${isAnswered ? 'bg-emerald-400' : 'bg-slate-300 animate-pulse'}`} />
                                                    <p className="text-base md:text-lg font-semibold text-slate-700 leading-snug">{item.text}</p>
                                                </div>
                                                <Input 
                                                    placeholder="Añadir observaciones (Opcional)..." 
                                                    className="h-10 text-sm max-w-xl bg-slate-50/50 border-slate-200/60 focus:border-blue-300 focus:bg-white rounded-xl shadow-none ml-5 transition-all"
                                                    value={currentAnswer.observation || ""}
                                                    onChange={(e) => handleObservationChange(item.id, e.target.value)}
                                                />
                                            </div>
                                            
                                            <div className="flex flex-row gap-3 w-full xl:w-auto shrink-0 pl-5 xl:pl-0">
                                                <motion.button
                                                    whileHover={{ scale: currentAnswer.score === 10 ? 1 : 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    type="button"
                                                    onClick={() => handleScoreChange(item.id, 10)}
                                                    className={`relative flex flex-col items-center justify-center rounded-2xl px-4 py-3 md:py-4 transition-all duration-300 w-full sm:w-24 overflow-hidden border-2
                                                        ${currentAnswer.score === 10 
                                                            ? 'border-emerald-500 text-white shadow-md shadow-emerald-500/20 bg-transparent' 
                                                            : 'bg-slate-50 border-slate-200 text-emerald-500 hover:border-emerald-200 opacity-80'}
                                                    `}
                                                >
                                                    {currentAnswer.score === 10 && (
                                                        <motion.div layoutId={`bg-${item.id}`} className="absolute inset-0 bg-emerald-500 z-0 pointer-events-none" />
                                                    )}
                                                    <div className="relative z-10 flex flex-col items-center justify-center">
                                                        <CheckCircle2 className={`size-6 mb-2 ${currentAnswer.score === 10 ? 'animate-bounce' : ''}`} />
                                                        <span className="text-xs font-bold uppercase tracking-wider">Bueno</span>
                                                    </div>
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: currentAnswer.score === 5 ? 1 : 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    type="button"
                                                    onClick={() => handleScoreChange(item.id, 5)}
                                                    className={`relative flex flex-col items-center justify-center rounded-2xl px-4 py-3 md:py-4 transition-all duration-300 w-full sm:w-24 overflow-hidden border-2
                                                        ${currentAnswer.score === 5 
                                                            ? 'border-[var(--accent)] text-white shadow-md bg-transparent' 
                                                            : 'bg-slate-50 border-slate-200 text-[var(--accent)] hover:border-[var(--accent)] opacity-80'}
                                                    `}
                                                >
                                                    {currentAnswer.score === 5 && (
                                                        <motion.div layoutId={`bg-${item.id}`} className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundColor: 'var(--accent)' }} />
                                                    )}
                                                    <div className="relative z-10 flex flex-col items-center justify-center">
                                                        <AlertTriangle className={`size-6 mb-2 ${currentAnswer.score === 5 ? 'animate-bounce' : ''}`} />
                                                        <span className="text-xs font-bold uppercase tracking-wider">Regular</span>
                                                    </div>
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: currentAnswer.score === 0 ? 1 : 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    type="button"
                                                    onClick={() => handleScoreChange(item.id, 0)}
                                                    className={`relative flex flex-col items-center justify-center rounded-2xl px-4 py-3 md:py-4 transition-all duration-300 w-full sm:w-24 overflow-hidden border-2
                                                        ${currentAnswer.score === 0 
                                                            ? 'border-red-500 text-white shadow-md shadow-red-500/20 bg-transparent' 
                                                            : 'bg-slate-50 border-slate-200 text-red-500 hover:border-red-200 opacity-80'}
                                                    `}
                                                >
                                                    {currentAnswer.score === 0 && (
                                                        <motion.div layoutId={`bg-${item.id}`} className="absolute inset-0 bg-red-500 z-0 pointer-events-none" />
                                                    )}
                                                    <div className="relative z-10 flex flex-col items-center justify-center">
                                                        <XCircle className={`size-6 mb-2 ${currentAnswer.score === 0 ? 'animate-bounce' : ''}`} />
                                                        <span className="text-xs font-bold uppercase tracking-wider">Malo</span>
                                                    </div>
                                                </motion.button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </form>
    );
}
// Force HMR
