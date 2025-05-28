"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import {
  MessageCircle,
  Send,
  Users,
  Bell,
  Search,
  Settings,
  Smile,
  Paperclip,
  MoreVertical,
  Edit3,
  Trash2,
  X,
  Home,
  Menu,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function ChatPage() {
  const [message, setMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showUserList, setShowUserList] = useState(true)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [editingMessage, setEditingMessage] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")

  const {
    user,
    users,
    onlineUsers,
    chatMessages,
    sendMessage,
    unreadNotifications,
    markNotificationsAsRead,
    updateUserActivity,
  } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatMessages])

  useEffect(() => {
    markNotificationsAsRead()
    // Atualizar atividade quando estiver no chat
    const interval = setInterval(() => {
      updateUserActivity()
    }, 30000)

    return () => clearInterval(interval)
  }, [markNotificationsAsRead, updateUserActivity])

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
    }
  }, [message])

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Extrair menções (@username)
    const mentionRegex = /@(\w+)/g
    const mentions: string[] = []
    let match

    while ((match = mentionRegex.exec(message)) !== null) {
      const username = match[1]
      if (users.find((u) => u.username === username)) {
        mentions.push(username)
      }
    }

    sendMessage(message, mentions)
    setMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const insertMention = (username: string) => {
    const newMessage = message + `@${username} `
    setMessage(newMessage)
    textareaRef.current?.focus()
  }

  const getMessagesForUser = () => {
    if (!user) return []

    let filteredMessages = chatMessages.filter((msg) => {
      // Mostrar mensagens públicas ou mensagens privadas direcionadas ao usuário atual
      return !msg.isPrivate || msg.senderId === user.id || msg.mentions.includes(user.username)
    })

    // Filtrar por usuário selecionado
    if (selectedUser) {
      filteredMessages = filteredMessages.filter(
        (msg) =>
          msg.senderId === selectedUser ||
          msg.mentions.includes(users.find((u) => u.id === selectedUser)?.username || ""),
      )
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filteredMessages = filteredMessages.filter(
        (msg) =>
          msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.senderName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return filteredMessages
  }

  const formatMessageContent = (content: string, mentions: string[]) => {
    let formattedContent = content

    mentions.forEach((username) => {
      const mentionedUser = users.find((u) => u.username === username)
      if (mentionedUser) {
        formattedContent = formattedContent.replace(
          new RegExp(`@${username}`, "g"),
          `<span class="bg-blue-100 text-blue-800 px-1 rounded font-medium">@${username}</span>`,
        )
      }
    })

    return formattedContent
  }

  const startEditMessage = (messageId: string, content: string) => {
    setEditingMessage(messageId)
    setEditContent(content)
  }

  const cancelEdit = () => {
    setEditingMessage(null)
    setEditContent("")
  }

  const saveEdit = () => {
    // Em uma implementação real, você salvaria a edição
    console.log("Editando mensagem:", editingMessage, "Novo conteúdo:", editContent)
    setEditingMessage(null)
    setEditContent("")
  }

  if (!user) return null

  const filteredMessages = getMessagesForUser()

  return (
    <div className="h-screen flex bg-slate-50">
      {/* Sidebar com usuários - responsivo */}
      {showUserList && (
        <div className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col md:relative absolute inset-0 z-10 md:z-auto">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Chat da Equipe</h2>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setShowUserList(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Buscar conversas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="p-4">
              <h3 className="text-sm font-medium text-slate-600 mb-3">USUÁRIOS ONLINE ({onlineUsers.length})</h3>
              <div className="space-y-2">
                <div
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedUser === null ? "bg-blue-100 text-blue-700" : "hover:bg-slate-100"
                  }`}
                  onClick={() => {
                    setSelectedUser(null)
                    if (window.innerWidth < 768) setShowUserList(false)
                  }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Todos</p>
                    <p className="text-xs text-slate-500">Chat geral</p>
                  </div>
                  {unreadNotifications > 0 && selectedUser === null && (
                    <Badge variant="destructive" className="text-xs">
                      {unreadNotifications}
                    </Badge>
                  )}
                </div>

                {onlineUsers.map((u) => (
                  <div
                    key={u.id}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedUser === u.id ? "bg-blue-100 text-blue-700" : "hover:bg-slate-100"
                    }`}
                    onClick={() => {
                      setSelectedUser(u.id)
                      if (window.innerWidth < 768) setShowUserList(false)
                    }}
                  >
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{u.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{u.name}</p>
                      <p className="text-xs text-slate-500">@{u.username}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        insertMention(u.username)
                      }}
                    >
                      <span className="text-xs">@</span>
                    </Button>
                  </div>
                ))}

                {onlineUsers.length === 0 && (
                  <div className="text-center py-4 text-slate-500">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhum usuário online</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Área principal do chat */}
      <div className="flex-1 flex flex-col">
        {/* Header do chat */}
        <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setShowUserList(!showUserList)} className="md:hidden">
              <Menu className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowUserList(!showUserList)} className="hidden md:flex">
              <Users className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">
                {selectedUser ? users.find((u) => u.id === selectedUser)?.name : "Chat Geral"}
              </h1>
              <p className="text-sm text-slate-500">
                {selectedUser
                  ? `Conversa privada com @${users.find((u) => u.id === selectedUser)?.username}`
                  : `${onlineUsers.length + 1} membros online`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Settings className="w-4 h-4" />
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Início</span>
              </Link>
            </Button>
            <Button asChild variant="destructive" size="sm">
              <Link href="/" className="flex items-center gap-2">
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-600 mb-2">
                    {selectedUser ? "Nenhuma conversa ainda" : "Seja o primeiro a enviar uma mensagem!"}
                  </h3>
                  <p className="text-slate-500">
                    {selectedUser ? "Inicie uma conversa enviando uma mensagem" : "Comece uma conversa com sua equipe"}
                  </p>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.senderId === user.id ? "flex-row-reverse" : ""}`}>
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">{msg.senderName.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className={`flex-1 max-w-[70%] ${msg.senderId === user.id ? "text-right" : ""}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{msg.senderName}</span>
                        <span className="text-xs text-slate-500">
                          {formatDistanceToNow(msg.timestamp, {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                        {msg.isPrivate && (
                          <Badge variant="secondary" className="text-xs">
                            <Bell className="w-3 h-3 mr-1" />
                            Privada
                          </Badge>
                        )}
                        {msg.senderId === user.id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreVertical className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => startEditMessage(msg.id, msg.content)}>
                                <Edit3 className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                      <div
                        className={`rounded-lg p-3 ${
                          msg.senderId === user.id
                            ? "bg-blue-500 text-white"
                            : msg.isPrivate
                              ? "bg-yellow-50 border border-yellow-200"
                              : "bg-slate-100"
                        }`}
                      >
                        {editingMessage === msg.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="min-h-[60px]"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={saveEdit}>
                                Salvar
                              </Button>
                              <Button size="sm" variant="outline" onClick={cancelEdit}>
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="text-sm whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{
                              __html: formatMessageContent(msg.content, msg.mentions),
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Input de mensagem */}
        <div className="bg-white border-t border-slate-200 p-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    selectedUser
                      ? `Mensagem para ${users.find((u) => u.id === selectedUser)?.name}...`
                      : "Digite sua mensagem... Use @username para mencionar alguém"
                  }
                  className="min-h-[60px] max-h-[120px] resize-none pr-12"
                  rows={1}
                />
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hidden sm:flex">
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hidden sm:flex">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-2 overflow-x-auto">
                  {onlineUsers.slice(0, 3).map((u) => (
                    <Button
                      key={u.id}
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs whitespace-nowrap"
                      onClick={() => insertMention(u.username)}
                    >
                      @{u.username}
                    </Button>
                  ))}
                </div>
                <div className="text-xs text-slate-500 hidden sm:block">Shift + Enter para nova linha</div>
              </div>
            </div>
            <Button onClick={handleSendMessage} disabled={!message.trim()} className="self-end">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
