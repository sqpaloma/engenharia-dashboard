"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
}

export default function CalendarioPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
  });

  const handleAddTask = () => {
    if (!selectedDate || !newTask.title) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      date: selectedDate,
    };

    setTasks([...tasks, task]);
    setNewTask({ title: "", description: "" });
    setIsModalOpen(false);
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(
      (task) =>
        task.date.getDate() === date.getDate() &&
        task.date.getMonth() === date.getMonth() &&
        task.date.getFullYear() === date.getFullYear()
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
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
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Calendário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={ptBR}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Tarefas do Dia</span>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Tarefa
                    </Button>
                  </DialogTrigger>
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
                            setNewTask({
                              ...newTask,
                              description: e.target.value,
                            })
                          }
                          placeholder="Digite a descrição da tarefa"
                        />
                      </div>
                      <div className="text-sm text-slate-500">
                        Data selecionada:{" "}
                        {selectedDate
                          ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
                              locale: ptBR,
                            })
                          : "Nenhuma data selecionada"}
                      </div>
                      <Button onClick={handleAddTask} className="w-full">
                        Adicionar Tarefa
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                <div className="space-y-4">
                  {getTasksForDate(selectedDate).length > 0 ? (
                    getTasksForDate(selectedDate).map((task) => (
                      <Card key={task.id} className="p-4">
                        <h3 className="font-semibold text-lg mb-2">
                          {task.title}
                        </h3>
                        <p className="text-slate-600">{task.description}</p>
                      </Card>
                    ))
                  ) : (
                    <p className="text-slate-500 text-center py-4">
                      Nenhuma tarefa para este dia
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-4">
                  Selecione uma data no calendário
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
