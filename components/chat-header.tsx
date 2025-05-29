import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, X } from "lucide-react";

interface ChatHeaderProps {
  onToggleUserList: () => void;
  onClose: () => void;
  showUserList: boolean;
}

export function ChatHeader({
  onToggleUserList,
  onClose,
  showUserList,
}: ChatHeaderProps) {
  return (
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Chat da Equipe
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleUserList}
            className={showUserList ? "bg-slate-100" : ""}
          >
            <Users className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </CardHeader>
  );
}
