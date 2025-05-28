"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/lib/auth-context"
import { MessageCircle, Send, X, Users, Bell } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [showUserList, setShowUserList] = useState(false)
  const { user, users, onlineUsers, chatMessages, sendMessage, unreadNotifications, markNotificationsAsRead } =
    useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chatMessages])

  useEffect(() => {
    if (isOpen) {
      markNotificationsAsRead()
    }
  }, [isOpen, markNotificationsAsRead])

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
    setShowUserList(false)
    inputRef.current?.focus()
  }

  const getMessagesForUser = () => {
    if (!user) return []

    return chatMessages.filter((msg) => {
      // Mostrar mensagens públicas ou mensagens privadas direcionadas ao usuário atual
      return !msg.isPrivate || msg.senderId === user.id || msg.mentions.includes(user.username)
    })
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

  if (!user) return null

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={() => setIsOpen(!isOpen)} className="h-14 w-14 rounded-full shadow-lg relative" size="icon">
          <MessageCircle className="h-6 w-6" />
          {unreadNotifications > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadNotifications}
            </Badge>
          )}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-96">
          <Card className="h-full flex flex-col shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Chat da Equipe
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowUserList(!showUserList)}>
                    <Users className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* User List */}
              {showUserList && (
                <div className="border-b p-3 bg-slate-50">
                  <h4 className="text-sm font-medium mb-2">Usuários Online ({onlineUsers.length}):</h4>
                  <div className="flex flex-wrap gap-1">
                    {onlineUsers.map((u) => (
                      <Button
                        key={u.id}
                        variant="outline"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={() => insertMention(u.username)}
                      >
                        @{u.username}
                      </Button>
                    ))}
                    {onlineUsers.length === 0 && <p className="text-xs text-slate-500">Nenhum usuário online</p>}
                  </div>
                </div>
              )}

              {/* Messages */}
              <ScrollArea className="flex-1 p-3">
                <div className="space-y-3">
                  {getMessagesForUser().map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.senderId === user.id ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-2 ${
                          msg.senderId === user.id
                            ? "bg-blue-500 text-white"
                            : msg.isPrivate
                              ? "bg-yellow-100 border border-yellow-300"
                              : "bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">{msg.senderName}</span>
                          {msg.isPrivate && (
                            <Badge variant="secondary" className="text-xs">
                              <Bell className="w-3 h-3 mr-1" />
                              Privada
                            </Badge>
                          )}
                        </div>
                        <div
                          className="text-sm"
                          dangerouslySetInnerHTML={{
                            __html: formatMessageContent(msg.content, msg.mentions),
                          }}
                        />
                        <div className="text-xs opacity-70 mt-1">
                          {formatDistanceToNow(msg.timestamp, {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem... Use @username para mencionar"
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-1">Use @username para enviar mensagem privada</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
