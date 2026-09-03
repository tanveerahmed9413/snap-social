import { MessageCircle } from "lucide-react";

const MessagesPage = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 text-violet-600">
          <MessageCircle size={40} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Messages
        </h1>

        <p className="mt-2 text-gray-500">
          This page is currently under development.
        </p>

        <p className="mt-1 text-sm text-gray-400">
          Messaging feature is coming soon.
        </p>
      </div>
    </div>
  );
};

export default MessagesPage;