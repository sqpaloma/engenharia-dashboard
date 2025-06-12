"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ConsultoresPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    departamento: "",
    especialidade: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to save consultant
    console.log("Form data:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Consultor</CardTitle>
          <CardDescription>
            Preencha os dados do novo consultor para adicioná-lo ao sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Digite o nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Digite o e-mail"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="Digite o telefone"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="departamento">Departamento</Label>
                <Select
                  value={formData.departamento}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, departamento: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bombas-pistoes">
                      Bombas e motores de pistões e engrenagem
                    </SelectItem>
                    <SelectItem value="bombas-escavadeira">
                      Bombas, motores e comandos de escavadeira
                    </SelectItem>
                    <SelectItem value="blocos-valvulas">
                      Blocos, válvulas, orbitrol e pedal de freio
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="especialidade">Especialidade</Label>
                <Input
                  id="especialidade"
                  name="especialidade"
                  value={formData.especialidade}
                  onChange={handleChange}
                  placeholder="Digite a especialidade"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">Adicionar Consultor</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
