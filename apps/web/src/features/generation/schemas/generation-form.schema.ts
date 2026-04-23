import { z } from "zod"

export const generationFormSchema = z.object({
  modelTier: z.enum(["standard", "premium"], {
    message: "Выберите уровень модели",
  }),
  photos: z
    .array(z.instanceof(File))
    .min(1, "Добавьте хотя бы одну фотографию")
    .max(6, "Можно добавить не более 6 фотографий"),
  selectedModel: z.string({
    message: "Выберите модель или загрузите свою",
  }),
  prompt: z.string().optional(),
})

export type GenerationFormValues = z.infer<typeof generationFormSchema>
