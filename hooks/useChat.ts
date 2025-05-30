"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context"; // useAuth to get the current user
import { getSupabaseClient } from "@/lib/supabaseClient";
import type { User, ChatMessage } from "@/lib/auth-context"; // Import types

interface UseChat {
  chatMessages: ChatMessage[];
  sendMessage: (content: string, mentions: string[]) => void;
  unreadNotifications: number;
  markNotificationsAsRead: () => void;
  isLoadingMessages: boolean;
  users: User[]; // Provide users here for convenience or get from useAuth in ChatPage
}

export function useChat(): UseChat {
  const { user, users } = useAuth(); // Get user and all users from auth context

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null); // Keep local ref if needed for scrolling

  // Effect to fetch initial messages and set up real-time subscription
  useEffect(() => {
    if (!user) {
      setChatMessages([]); // Clear messages if user logs out
      setIsLoadingMessages(false);
      return;
    }

    const fetchMessages = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) {
        console.warn("Supabase client not available.");
        setIsLoadingMessages(false);
        return;
      }
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("timestamp", { ascending: true });
      if (!error && data) {
        setChatMessages(
          data.map((msg: any) => ({
            id: msg.id,
            senderId: msg.sender_id,
            senderName: msg.sender_name || "",
            content: msg.content,
            mentions: msg.mentions,
            timestamp: new Date(msg.timestamp),
            isPrivate: msg.is_private,
          }))
        );
      } else {
        console.error("Error fetching messages:", error);
      }
      setIsLoadingMessages(false);
    };

    fetchMessages();

    // Escutar mensagens em tempo real
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.warn("Supabase client not available for realtime.");
      return;
    }
    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            const msg = payload.new;
            console.log("Realtime INSERT payload:", payload);
            const newMsg = {
              id: msg.id,
              senderId: msg.sender_id,
              senderName: msg.sender_name || "", // Ensure senderName is a string
              content: msg.content,
              mentions: msg.mentions,
              timestamp: new Date(msg.timestamp),
              isPrivate: msg.is_private,
            };
            setChatMessages((prev) => {
              const newState = [...prev, newMsg];
              console.log("chatMessages state updated:", newState);
              return newState;
            });

            // Notificação: se o usuário for mencionado ou for mensagem privada para ele
            if (
              user &&
              ((newMsg.isPrivate && newMsg.mentions.includes(user.username)) ||
                (!newMsg.isPrivate && newMsg.mentions.includes(user.username)))
            ) {
              setUnreadNotifications((prev) => prev + 1);
            }
          }
          // TODO: Handle UPDATE and DELETE events for real-time editing/deleting
        }
      )
      .subscribe();

    return () => {
      const supabase = getSupabaseClient();
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [user]); // Depend on user to re-subscribe on login/logout

  const sendMessage = async (content: string, mentions: string[]) => {
    if (!user) {
      console.warn("Cannot send message: User not authenticated.");
      return;
    }
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.warn("Supabase client not available.");
      return;
    }

    // Determine if the message is private
    const isPrivate = mentions.length > 0; // Assuming any mention makes it private

    const { data, error } = await supabase.from("messages").insert([
      {
        sender_id: user.id,
        sender_name: user.name, // Use user's name from auth context
        content: content,
        mentions: mentions,
        is_private: isPrivate,
        // timestamp will be set by the database trigger/default value
      },
    ]);

    if (error) {
      console.error("Error sending message:", error);
    } else {
      console.log("Message sent successfully:", data);
      // Realtime subscription will add the message to state for all clients
    }
  };

  const markNotificationsAsRead = () => {
    setUnreadNotifications(0);
    // TODO: Implement logic to mark notifications as read in the backend if necessary
    // localStorage.setItem("unread-notifications", "0"); // If using local storage
  };

  // You might want to expose messagesEndRef and other state/functions as needed
  return {
    chatMessages,
    sendMessage,
    unreadNotifications,
    markNotificationsAsRead,
    isLoadingMessages,
    users, // Pass users from useAuth
  };
}
