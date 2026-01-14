import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

interface WaitlistResponse {
  success: boolean;
  message: string;
}

export function useCreateSubscriber() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { email: string }): Promise<WaitlistResponse> => {
      const validated = api.waitlist.join.input.parse(data);
      const res = await fetch(api.waitlist.join.path, {
        method: api.waitlist.join.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to join waitlist");
      }

      return json as WaitlistResponse;
    },
    onSuccess: (data) => {
      toast({
        title: "You're in!",
        description: data.message || "We'll notify you when Stable Alpha V.2 launches.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
