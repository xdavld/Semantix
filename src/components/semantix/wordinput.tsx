"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  word: z
    .string()
    .min(1, { message: "Das Wort darf nicht leer sein." })
    .max(50, { message: "Das Wort darf höchstens 50 Zeichen lang sein." }),
});

interface WordInputProps {
  onGuess: (word: string) => void;
}

export default function WordInput({ onGuess }: WordInputProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      word: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onGuess(values.word);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4 mb-4"
      >
        <FormField
          control={form.control}
          name="word"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Errate das Wort:</FormLabel>
              <FormControl>
                <Input placeholder="Ein Wort eingeben" {...field} />
              </FormControl>
              <FormDescription>
                Drücke <strong>Enter</strong>, um deine Antwort abzugeben.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
