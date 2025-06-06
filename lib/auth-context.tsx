"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  username: string;
  name: string;
  role: "admin" | "engineer" | "user";
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  mentions: string[]; // usernames mencionados
  timestamp: Date;
  isPrivate: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  users: User[];
  onlineUsers: User[];
  chatMessages: ChatMessage[];
  sendMessage: (content: string, mentions: string[]) => void;
  unreadNotifications: number;
  markNotificationsAsRead: () => void;
  updateUserActivity: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuários pré-definidos para demonstração
const defaultUsers: User[] = [
  {
    id: "1",
    username: "admin",
    name: "Administrador",
    role: "admin",
    isOnline: false,
  },
  {
    id: "2",
    username: "paloma",
    name: "Paloma",
    role: "engineer",
    isOnline: false,
  },
  {
    id: "3",
    username: "giovanni",
    name: "Giovanni",
    role: "engineer",
    isOnline: false,
  },
  {
    id: "4",
    username: "lucas",
    name: "Lucas",
    role: "engineer",
    isOnline: false,
  },
  {
    id: "5",
    username: "marcelo",
    name: "Marcelo",
    role: "engineer",
    isOnline: false,
  },
  {
    id: "6",
    username: "consultor1",
    name: "Consultor 1",
    role: "user",
    isOnline: false,
  },
  {
    id: "7",
    username: "consultor2",
    name: "Consultor 2",
    role: "user",
    isOnline: false,
  },
];

// Senhas padrão (em produção, isso seria criptografado)
const userCredentials: Record<string, string> = {
  admin: "admin123",
  paloma: "paloma123",
  giovanni: "giovanni123",
  lucas: "lucas123",
  marcelo: "marcelo123",
  consultor1: "consultor123",
  consultor2: "consultor123",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const router = useRouter();

  // Atualizar atividade do usuário a cada 30 segundos
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (user) {
      updateUserActivity();
      interval = setInterval(() => {
        updateUserActivity();
      }, 30000); // 30 segundos
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [user]);

  // Limpar usuários offline a cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setUsers((prevUsers) =>
        prevUsers.map((u) => {
          if (u.lastSeen && now.getTime() - u.lastSeen.getTime() > 120000) {
            // 2 minutos
            return { ...u, isOnline: false };
          }
          return u;
        })
      );
    }, 60000); // 1 minuto

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Carregar usuário salvo
    const savedUser = localStorage.getItem("auth-user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // Marcar como online ao carregar
        updateUserOnlineStatus(parsedUser.id, true);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      }
    }

    // Carregar mensagens do chat
    const savedMessages = localStorage.getItem("chat-messages");
    if (savedMessages) {
      try {
        const messages = JSON.parse(savedMessages);
        setChatMessages(
          messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
        );
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
      }
    }

    // Carregar notificações não lidas
    const savedNotifications = localStorage.getItem("unread-notifications");
    if (savedNotifications) {
      setUnreadNotifications(Number.parseInt(savedNotifications, 10));
    }

    // Carregar status online dos usuários
    const savedOnlineUsers = localStorage.getItem("online-users");
    if (savedOnlineUsers) {
      try {
        const onlineUserIds = JSON.parse(savedOnlineUsers);
        setUsers((prevUsers) =>
          prevUsers.map((u) => ({
            ...u,
            isOnline: onlineUserIds.includes(u.id),
            lastSeen: onlineUserIds.includes(u.id) ? new Date() : u.lastSeen,
          }))
        );
      } catch (error) {
        console.error("Erro ao carregar usuários online:", error);
      }
    }
  }, []);

  const updateUserOnlineStatus = (userId: string, isOnline: boolean) => {
    setUsers((prevUsers) => {
      const updatedUsers = prevUsers.map((u) =>
        u.id === userId
          ? { ...u, isOnline, lastSeen: isOnline ? new Date() : u.lastSeen }
          : u
      );

      // Salvar usuários online
      const onlineUserIds = updatedUsers
        .filter((u) => u.isOnline)
        .map((u) => u.id);
      localStorage.setItem("online-users", JSON.stringify(onlineUserIds));

      return updatedUsers;
    });
  };

  const updateUserActivity = () => {
    if (user) {
      updateUserOnlineStatus(user.id, true);
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    const foundUser = users.find((u) => u.username === username);

    if (foundUser && userCredentials[username] === password) {
      const userWithOnline = {
        ...foundUser,
        isOnline: true,
        lastSeen: new Date(),
      };
      setUser(userWithOnline);
      localStorage.setItem("auth-user", JSON.stringify(userWithOnline));
      updateUserOnlineStatus(foundUser.id, true);
      return true;
    }

    return false;
  };

  const logout = () => {
    if (user) {
      updateUserOnlineStatus(user.id, false);
    }
    setUser(null);
    localStorage.removeItem("auth-user");
    localStorage.removeItem("admin-auth"); // Limpar auth admin também
    router.push("/"); // Redireciona para a página inicial (login)
  };

  const sendMessage = (content: string, mentions: string[]) => {
    if (!user) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      content,
      mentions,
      timestamp: new Date(),
      isPrivate: mentions.length > 0,
    };

    const updatedMessages = [...chatMessages, newMessage];
    setChatMessages(updatedMessages);
    localStorage.setItem("chat-messages", JSON.stringify(updatedMessages));

    // Se a mensagem menciona outros usuários, incrementar notificações
    if (mentions.length > 0) {
      const newNotifications = unreadNotifications + mentions.length;
      setUnreadNotifications(newNotifications);
      localStorage.setItem("unread-notifications", newNotifications.toString());
    }
  };

  const markNotificationsAsRead = () => {
    setUnreadNotifications(0);
    localStorage.setItem("unread-notifications", "0");
  };

  const onlineUsers = users.filter((u) => u.isOnline && u.id !== user?.id);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        users,
        onlineUsers,
        chatMessages,
        sendMessage,
        unreadNotifications,
        markNotificationsAsRead,
        updateUserActivity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
