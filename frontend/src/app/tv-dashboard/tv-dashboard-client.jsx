"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Activity, Users, Store, Crown, Megaphone, Clock, Calendar } from "lucide-react";
import Image from "next/image";
import useSocket from "@/hooks/use-socket";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchStores = async () => {
  try {
    const res = await fetch(`${API_URL}/public/stores`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.body?.data || [];
  } catch (error) {
    return [];
  }
};

const fetchDashboard = async (storeId) => {
  if (!storeId) return [];
  try {
    const res = await fetch(`${API_URL}/public/tv-dashboard/${storeId}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.body || [];
  } catch (error) {
    return [];
  }
};

// Sonido de victoria (Web Audio API) - No requiere archivos externos
const playLevelUpSound = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    // Arpegio victorioso
    oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
    oscillator.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.3); // C6
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime + 0.4);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.8);
  } catch (e) {
    console.log("Audio not supported or interaction needed first");
  }
};

const getStatus = (employee) => {
  if (!employee.has_assistance_today || Number(employee.has_assistance_today) === 0) {
    return { 
      emoji: "😴", 
      color: "text-slate-500", 
      badgeText: "text-slate-600",
      badgeBg: "bg-slate-100",
      bgGradient: "from-slate-50 to-transparent",
      ring: "ring-slate-200",
      label: "Pendiente"
    };
  }
  const score = Number(employee.today_score);
  const late = Number(employee.late_activities);
  
  if (score < 50 || late > 2) {
    return { 
      emoji: "☹️", 
      color: "text-red-500", 
      badgeText: "text-red-700",
      badgeBg: "bg-red-100/80",
      bgGradient: "from-red-50/50 to-transparent",
      ring: "ring-red-100",
      label: "Atención"
    };
  }
  if (score >= 80 && late === 0) {
    return { 
      emoji: "😊", 
      color: "text-[#1B4F8F]", 
      badgeText: "text-[#1B4F8F]",
      badgeBg: "bg-blue-100/60",
      bgGradient: "from-blue-50/50 to-transparent",
      ring: "ring-blue-100",
      label: "Excelente"
    };
  }
  return { 
    emoji: "😐", 
    color: "text-[#F5C518]", 
    badgeText: "text-yellow-700",
    badgeBg: "bg-yellow-100/60",
    bgGradient: "from-yellow-50/50 to-transparent",
    ring: "ring-yellow-200",
    label: "Regular"
  };
};

function LiveClock() {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col items-end justify-center px-6 py-2 bg-slate-50 rounded-2xl border border-slate-100 min-w-[150px] min-h-[60px]">
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end justify-center px-6 py-2 bg-slate-50 rounded-2xl border border-slate-100">
      <span className="text-3xl md:text-4xl font-extrabold text-[#1B4F8F] font-heading tabular-nums tracking-tight leading-none">
        {time.toLocaleTimeString('es-MX', { hour12: false })}
      </span>
      <span className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
        {time.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })}
      </span>
    </div>
  );
}

export function TvDashboardClient() {
  const [selectedStore, setSelectedStore] = useState("");
  const [controlsVisible, setControlsVisible] = useState(true);
  const [selectedEmployeeTask, setSelectedEmployeeTask] = useState(null);
  const hideControlsTimeout = useRef(null);
  const prevScoresRef = useRef({});
  const queryClient = useQueryClient();

  const { socket, connectSocket, disconnectSocket } = useSocket({
    url: process.env.NEXT_PUBLIC_WS_API_URL,
    token: "", // Anonymous connection
  });

  useEffect(() => {
    connectSocket();
    return () => disconnectSocket();
  }, [connectSocket, disconnectSocket]);

  useEffect(() => {
    if (!socket) return;
    
    const handleUpdate = (data) => {
      // Refresh the query when any dashboard update is received
      if (!data.store_id || String(data.store_id) === String(selectedStore)) {
        queryClient.invalidateQueries({ queryKey: ["tv-dashboard", selectedStore] });
      }
    };

    socket.on("dashboard-updated", handleUpdate);
    return () => socket.off("dashboard-updated", handleUpdate);
  }, [socket, selectedStore, queryClient]);

  const { data: stores } = useQuery({
    queryKey: ["public-stores"],
    queryFn: fetchStores,
  });

  useEffect(() => {
    if (stores && stores.length > 0 && !selectedStore) {
      setSelectedStore(stores[0].id.toString());
    }
  }, [stores, selectedStore]);

  const { data: employees, isLoading } = useQuery({
    queryKey: ["tv-dashboard", selectedStore],
    queryFn: () => fetchDashboard(selectedStore),
    enabled: !!selectedStore,
    refetchInterval: 60000,
  });

  // Procesar datos (incluyendo mocks para la demo de puntuaciones)
  const mockedEmployees = employees?.map((emp) => {
    const pseudoRandomScore = emp.today_score ?? ((emp.id * 137) % 100); 
    const pseudoLate = emp.late_activities ?? ((emp.id * 43) % 4);
    const pseudoAssistance = emp.has_assistance_today ?? ((emp.id * 17) % 5 === 0 ? 0 : 1); 
    
    return {
      ...emp,
      today_score: pseudoRandomScore,
      late_activities: pseudoLate,
      has_assistance_today: pseudoAssistance,
      // Usamos el avatar real si existe
      avatar_url: emp.avatar_url || `https://i.pravatar.cc/150?u=${emp.id * 13}`
    };
  });

  // Rey del día
  const topEmployee = mockedEmployees?.reduce((prev, current) => {
    if (current.late_activities > 0) return prev;
    if (!prev) return current;
    return (current.today_score > prev.today_score) ? current : prev;
  }, null);

  // Progreso Global
  const averageScore = mockedEmployees?.length > 0 
    ? mockedEmployees.reduce((acc, emp) => acc + emp.today_score, 0) / mockedEmployees.length
    : 0;

  // Sonidos de Logro
  useEffect(() => {
    let played = false;
    mockedEmployees?.forEach(emp => {
      const prev = prevScoresRef.current[emp.id];
      if (prev !== undefined && prev < 80 && emp.today_score >= 80) {
        if (!played) {
          playLevelUpSound();
          played = true;
        }
      }
      prevScoresRef.current[emp.id] = emp.today_score;
    });
  }, [mockedEmployees]);

  // Controles inactividad
  useEffect(() => {
    const resetTimer = () => {
      setControlsVisible(true);
      if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
      hideControlsTimeout.current = setTimeout(() => {
        setControlsVisible(false);
      }, 5000);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer();

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden relative selection:bg-[#1B4F8F]/20 pb-16">
      {/* Fondo minimalista moderno */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-100/40 via-transparent to-transparent rounded-full blur-3xl opacity-60 transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-yellow-100/30 via-transparent to-transparent rounded-full blur-3xl opacity-60 transform -translate-x-1/3 translate-y-1/3" />
      </div>
      
      <div className="p-8 md:p-12 pb-24">
        {/* Cabecera Principal */}
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-50 flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 bg-white/90 p-4 md:p-6 rounded-[2rem] backdrop-blur-xl border border-slate-200/50 shadow-[0_8px_30px_rgb(27,79,143,0.06)] gap-6"
          >
            <div className="flex items-center gap-5 w-full xl:w-auto">
              <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl shadow-lg overflow-hidden flex items-center justify-center bg-white border border-slate-100">
                <Image src="/logo.jpg" alt="Logo El Ofertón" width={80} height={80} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#1B4F8F] font-heading flex items-center gap-3">
                  EL OFERTÓN <span className="text-xs md:text-sm px-3 py-1 bg-blue-50 text-[#1B4F8F] rounded-full tracking-widest font-bold uppercase border border-blue-100/50 shadow-sm animate-pulse">En Vivo</span>
                </h1>
                <p className="text-slate-500 font-medium text-xs md:text-sm mt-1 md:mt-2 uppercase tracking-wider">Panel de Operaciones de Sucursales</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 w-full xl:w-auto">
              {/* Termómetro Global */}
              <div className="flex-1 w-full md:w-64 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-500">
                  <span>Rendimiento Global</span>
                  <span className="text-[#1B4F8F]">{Math.round(averageScore)}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${averageScore}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${averageScore >= 80 ? 'bg-[#1B4F8F]' : averageScore >= 50 ? 'bg-[#F5C518]' : 'bg-red-500'}`}
                  />
                </div>
              </div>

              {/* Controles de Tienda (Ocultables) */}
              {controlsVisible && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="w-full md:w-72"
                >
                  <Select value={selectedStore} onValueChange={setSelectedStore}>
                    <SelectTrigger className="bg-white border-slate-200 hover:border-[#1B4F8F]/30 text-lg py-6 px-6 rounded-2xl shadow-sm text-slate-700 font-semibold focus:ring-4 focus:ring-[#1B4F8F]/10">
                      <SelectValue placeholder="Seleccionar Sucursal" />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-2xl shadow-2xl">
                      {stores?.map((s) => (
                        <SelectItem key={s.id} value={s.id.toString()} className="text-base py-3 font-medium text-slate-700 focus:bg-blue-50 focus:text-[#1B4F8F] rounded-xl cursor-pointer">
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}

              {/* Reloj */}
              <LiveClock />
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10">
          {isLoading && !mockedEmployees && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-40"
            >
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="p-6 bg-white rounded-full shadow-[0_8px_30px_rgb(27,79,143,0.1)] mb-6">
                <Activity className="w-12 h-12 text-[#1B4F8F]" />
              </motion.div>
              <p className="text-xl font-bold tracking-widest uppercase text-slate-400 font-heading">Sincronizando Sistema...</p>
            </motion.div>
          )}
          
          {mockedEmployees && mockedEmployees.length > 0 && (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 auto-rows-max px-2"
            >
              {mockedEmployees.map((emp) => {
                const status = getStatus(emp);
                const isKing = topEmployee && emp.id === topEmployee.id && emp.today_score >= 80;
                
                return (
                  <motion.div
                    key={emp.id}
                    variants={itemVariants}
                    whileHover={{ y: -5, scale: 1.02 }}
                    onClick={() => setSelectedEmployeeTask(emp)}
                    className={`group relative flex flex-col p-8 pt-10 rounded-[2.5rem] bg-white border cursor-pointer ${isKing ? 'border-[#F5C518]/50 shadow-[0_0_40px_rgba(245,197,24,0.3)]' : 'border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)]'} hover:shadow-[0_12px_40px_rgba(27,79,143,0.08)] hover:ring-4 hover:ring-[#1B4F8F]/10 transition-all duration-300 overflow-hidden`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${status.bgGradient} opacity-60 pointer-events-none`} />
                    {isKing && <div className="absolute inset-0 bg-gradient-to-tr from-[#F5C518]/5 via-transparent to-transparent pointer-events-none" />}
                    
                    <motion.div 
                      initial={{ scale: 0, rotate: -15 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
                      className="absolute top-4 right-4 z-20 pointer-events-none drop-shadow-xl"
                    >
                      <span className="text-6xl md:text-7xl filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.15)] leading-none">{status.emoji}</span>
                    </motion.div>
                    
                    <div className="flex flex-col items-center mt-4">
                      <div className="relative mb-6">
                        {/* Corona del Rey del Día */}
                        {isKing && (
                          <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6, type: "spring", bounce: 0.7 }}
                            className="absolute -top-10 -right-4 z-30 transform rotate-12"
                          >
                            <Crown className="w-16 h-16 text-[#F5C518] fill-[#F5C518] filter drop-shadow-lg" />
                          </motion.div>
                        )}

                        <div className={`absolute inset-0 ring-4 ring-offset-4 ring-offset-white ${isKing ? 'ring-[#F5C518]' : status.ring} rounded-[2.5rem] opacity-50 blur-[2px]`} />
                        
                        <Avatar className={`w-40 h-40 md:w-48 md:h-48 rounded-[2.5rem] shadow-md relative z-10 bg-slate-50 overflow-hidden ring-2 ${isKing ? 'ring-[#F5C518]' : 'ring-white'}`}>
                          {emp.avatar_url ? (
                            <Image src={emp.avatar_url} alt={emp.names} fill sizes="192px" className="object-cover" />
                          ) : (
                            <AvatarFallback className="text-6xl font-bold bg-slate-50 text-[#1B4F8F]">
                              {emp.names?.charAt(0)}{emp.last_names?.charAt(0)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </div>
                      
                      <div className="text-center relative z-10 w-full mt-2">
                        <h2 className={`text-3xl md:text-4xl font-extrabold tracking-tight ${isKing ? 'text-[#F5C518]' : 'text-[#111827]'} mb-2 truncate font-heading leading-tight drop-shadow-sm`}>
                          {emp.names}
                        </h2>
                        <h3 className="text-xl md:text-2xl font-medium text-slate-500 truncate mb-6 tracking-tight">
                          {emp.last_names}
                        </h3>
                        
                        <div className="w-full flex justify-center">
                          <span className={`inline-flex items-center justify-center px-6 py-2.5 rounded-full text-base font-bold tracking-[0.15em] uppercase ${status.badgeBg} ${status.badgeText} shadow-sm border border-white/50 backdrop-blur-sm`}>
                            {status.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
          
          {mockedEmployees?.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-40 text-slate-400"
            >
              <div className="p-8 bg-white rounded-full shadow-xl mb-6 border border-slate-100">
                <Users className="w-16 h-16 text-slate-300" />
              </div>
              <p className="text-2xl font-bold tracking-widest uppercase text-slate-400 font-heading">Sin personal activo en la sucursal</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modal de Tareas */}
      <Dialog open={!!selectedEmployeeTask} onOpenChange={(open) => !open && setSelectedEmployeeTask(null)}>
        <DialogContent className="sm:max-w-[500px] bg-white rounded-[2rem] p-0 overflow-hidden border-0 shadow-2xl">
          {selectedEmployeeTask && (
            <div className="flex flex-col">
              <div className="bg-[#1B4F8F] p-6 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3" />
                 <DialogHeader className="relative z-10">
                   <div className="flex items-center gap-4 mb-2">
                     <Avatar className="w-16 h-16 border-2 border-white/20 shadow-md bg-white relative overflow-hidden">
                        {selectedEmployeeTask.avatar_url ? (
                          <Image src={selectedEmployeeTask.avatar_url} alt={selectedEmployeeTask.names} fill sizes="64px" className="object-cover" />
                        ) : (
                          <AvatarFallback className="text-xl bg-[#1B4F8F] text-white">{selectedEmployeeTask.names?.charAt(0)}</AvatarFallback>
                        )}
                     </Avatar>
                     <div className="text-left">
                       <DialogTitle className="text-2xl font-bold font-heading tracking-tight">{selectedEmployeeTask.names} {selectedEmployeeTask.last_names}</DialogTitle>
                       <DialogDescription className="text-blue-100 font-medium text-sm mt-1">
                         Tareas Asignadas del Día
                       </DialogDescription>
                     </div>
                   </div>
                 </DialogHeader>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#F5C518]" />
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-yellow-100 text-yellow-800 shadow-sm">
                      En progreso
                    </span>
                    <div className="flex items-center text-slate-400 text-xs font-semibold gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date().toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' }).toUpperCase()}
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-bold text-slate-800 leading-snug mb-2 font-heading">
                    Acomodar y surtir el pasillo principal
                  </h4>
                  <p className="text-slate-500 text-sm mb-5 leading-relaxed">
                    Verificar caducidades, reponer inventario de las cabeceras y limpiar la zona de exhibición.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 border-t border-slate-200/60 pt-4 mt-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-xl text-[#1B4F8F]">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Asignada</span>
                        <span className="text-sm font-semibold text-slate-700">08:30 AM</span>
                      </div>
                    </div>
                    
                    <div className="w-px h-8 bg-slate-200 hidden sm:block my-auto"></div>
                    
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-50 rounded-xl text-red-600">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Fecha Límite</span>
                        <span className="text-sm font-bold text-red-600">12:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Marquesina Fija Inferior (Noticiero) */}
      <div className="fixed bottom-0 left-0 w-full bg-[#1B4F8F] text-white overflow-hidden flex items-center z-50 h-14 border-t-4 border-[#F5C518] shadow-[0_-10px_30px_rgba(27,79,143,0.3)]">
        <div className="flex items-center px-4 bg-[#0a2f5e] h-full z-10 absolute left-0 border-r border-[#1B4F8F]">
          <Megaphone className="w-6 h-6 text-[#F5C518] mr-2 animate-bounce" />
          <span className="font-bold tracking-widest uppercase text-sm">Avisos</span>
        </div>
        <motion.div 
          initial={{ x: "100%" }}
          animate={{ x: "-100%" }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="whitespace-nowrap flex items-center h-full pl-32 text-lg font-medium tracking-wide"
        >
          <span className="mx-8 text-[#F5C518]">•</span>
          ¡Excelente esfuerzo equipo! Vamos por las metas de este mes.
          <span className="mx-8 text-[#F5C518]">•</span>
          Recuerden la junta general todos los lunes a las 8:00 AM.
          <span className="mx-8 text-[#F5C518]">•</span>
          ¡Felicidades a los Empleados del Mes por su dedicación!
          <span className="mx-8 text-[#F5C518]">•</span>
          Mantengamos el almacén limpio y ordenado, el Ofertón es de todos.
          <span className="mx-8 text-[#F5C518]">•</span>
        </motion.div>
      </div>
    </div>
  );
}
