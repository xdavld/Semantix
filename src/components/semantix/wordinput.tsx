import { Guess } from "@/types/types";
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
import { WordInputProps } from "@/types/types";

const formSchema = z.object({
  word: z
    .string()
    .min(1, { message: "Das Wort darf nicht leer sein." })
    .regex(/^[A-Za-zäöüßÄÖÜ]+$/, { message: "Bitte nur Buchstaben verwenden." })
    .max(50, { message: "Das Wort darf höchstens 50 Zeichen lang sein." }),
});

export default function WordInput({ onGuess }: WordInputProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      word: "",
    },
    mode: "onChange",
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onGuess(values.word);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full max-w-md mb-6"
      >
        <FormField
          control={form.control}
          name="word"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl font-bold">
                Errate das Wort:
              </FormLabel>{" "}
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
