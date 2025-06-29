"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/pt-br";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { format } from "date-fns";

moment.locale("pt-br");
const localizer = momentLocalizer(moment);

interface Task {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
}

function CalendarioContent() {
  const [myEvents, setMyEvents] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
  });
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const handleSelectSlot = useCallback(
    (slotInfo: { start: Date; end: Date }) => {
      if (moment(slotInfo.start).isBefore(moment().startOf("day"))) {
        alert("Não é possível adicionar tarefas em datas passadas.");
        return;
      }
      setSelectedSlot(slotInfo);
      setNewTask({
        title: "",
        description: "",
        date: format(slotInfo.start, "yyyy-MM-dd"),
        startTime: format(slotInfo.start, "HH:mm"),
        endTime: format(slotInfo.end, "HH:mm"),
      });
      setIsModalOpen(true);
    },
    []
  );

  const handleSelectEvent = useCallback((event: Task) => {
    // Aqui você pode implementar a visualização ou edição de uma tarefa existente
    // Por enquanto, apenas exibimos um alerta simples
    alert(
      `Detalhes da Tarefa:\nTítulo: ${event.title}\nDescrição: ${
        event.description
      }\nInício: ${event.start.toLocaleString()}\nFim: ${event.end.toLocaleString()}`
    );
  }, []);

  const handleAddTask = () => {
    if (
      !newTask.title ||
      !newTask.date ||
      !newTask.startTime ||
      !newTask.endTime ||
      !selectedSlot
    )
      return;

    const startDateTime = moment(
      `${newTask.date} ${newTask.startTime}`
    ).toDate();
    const endDateTime = moment(`${newTask.date} ${newTask.endTime}`).toDate();

    if (moment(startDateTime).isBefore(moment().startOf("day"))) {
      alert("Não é possível adicionar tarefas em datas passadas.");
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      start: startDateTime,
      end: endDateTime,
    };

    setMyEvents([...myEvents, task]);
    setNewTask({
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
    });
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  const handleAddTaskButton = () => {
    setSelectedSlot(null);
    setNewTask({
      title: "",
      description: "",
      date: format(new Date(), "yyyy-MM-dd"),
      startTime: format(new Date(), "HH:mm"),
      endTime: format(new Date(new Date().getTime() + 60 * 60 * 1000), "HH:mm"), // 1 hour later
    });
    setIsModalOpen(true);
  };

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(),
      scrollToTime: moment().set({ h: 9, m: 0, s: 0 }).toDate(),
    }),
    []
  );

  return (
    <div className="flex h-screen">
      <div className="flex-1 overflow-auto bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Calendário
              </h1>
              <p className="text-slate-600">
                Gerencie suas tarefas e compromissos
              </p>
            </div>
            <Button
              onClick={handleAddTaskButton}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Adicionar Tarefa
            </Button>
          </div>

          <div className="h-[600px]">
            <BigCalendar
              localizer={localizer}
              events={myEvents}
              defaultView={Views.WEEK}
              views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
              defaultDate={defaultDate}
              scrollToTime={scrollToTime}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              culture="pt-br"
              messages={{
                allDay: "Dia Inteiro",
                previous: "Anterior",
                next: "Próximo",
                today: "Hoje",
                month: "Mês",
                week: "Semana",
                day: "Dia",
                agenda: "Agenda",
                date: "Data",
                time: "Hora",
                event: "Evento",
                noEventsInRange: "Sem eventos neste período.",
              }}
            />
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Tarefa</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    placeholder="Digite o título da tarefa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    placeholder="Digite a descrição da tarefa"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newTask.date}
                      min={moment().format("YYYY-MM-DD")}
                      onChange={(e) =>
                        setNewTask({ ...newTask, date: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Início</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={newTask.startTime}
                        onChange={(e) =>
                          setNewTask({ ...newTask, startTime: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">Fim</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={newTask.endTime}
                        onChange={(e) =>
                          setNewTask({ ...newTask, endTime: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddTask} className="w-full">
                  Adicionar Tarefa
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default function CalendarioPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CalendarioContent />
    </Suspense>
  );
}
