import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, UploadCloud, X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/Button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form"
import { Textarea } from "@/components/ui/Textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup"
import { Card, CardContent } from "@/components/ui/Card"

import { generationFormSchema, type GenerationFormValues } from "../schemas/generation-form.schema"
import { MODEL_PRESETS } from "../constants/model-presets"

export function GenerationForm() {
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const form = useForm({
    resolver: zodResolver(generationFormSchema),
    defaultValues: {
      modelTier: "standard",
      photos: [],
      selectedModel: "",
      prompt: "",
    },
  })

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const newFiles = Array.from(e.target.files)
    const currentFiles = form.getValues("photos") || []
    
    if (currentFiles.length + newFiles.length > 6) {
      form.setError("photos", { message: "Можно добавить не более 6 фотографий" })
      return
    }

    const updatedFiles = [...currentFiles, ...newFiles]
    form.setValue("photos", updatedFiles, { shouldValidate: true })

    // Create previews
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file))
    setPreviewUrls(prev => [...prev, ...newPreviewUrls])
  }

  const removePhoto = (index: number) => {
    const currentFiles = form.getValues("photos") || []
    const updatedFiles = currentFiles.filter((_, i) => i !== index)
    form.setValue("photos", updatedFiles, { shouldValidate: true })

    setPreviewUrls(prev => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index])
      updated.splice(index, 1)
      return updated
    })
  }

  const onSubmit = (data: GenerationFormValues) => {
    const formData = new FormData()
    
    formData.append("modelTier", data.modelTier)
    formData.append("selectedModel", data.selectedModel)
    if (data.prompt) {
      formData.append("prompt", data.prompt)
    }
    
    data.photos.forEach((photo, index) => {
      formData.append(`photo_${index}`, photo)
    })

    console.log("=== Form Submitted ===")
    console.log("Request Body (FormData representation):")
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value)
    }
    console.log("======================")
  }

  return (
    <Card className="border-border/50 shadow-md">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Уровень модели */}
            <FormField
              control={form.control}
              name="modelTier"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base">Уровень модели</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0 border border-border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors flex-1">
                        <FormControl>
                          <RadioGroupItem value="standard" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer w-full">
                          Стандарт (Быстро)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0 border border-border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors flex-1">
                        <FormControl>
                          <RadioGroupItem value="premium" />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer w-full">
                          Премиум (Высокое качество)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Загрузка фотографий */}
            <FormField
              control={form.control}
              name="photos"
              render={() => (
                <FormItem>
                  <FormLabel className="text-base">Ваши фотографии (до 6 штук)</FormLabel>
                  <FormDescription>
                    Загрузите фото товара на белом фоне или обычные снимки
                  </FormDescription>
                  <FormControl>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-4">
                        {previewUrls.map((url, index) => (
                          <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border group">
                            <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        
                        {previewUrls.length < 6 && (
                          <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 hover:border-primary/50 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <UploadCloud className="w-6 h-6 text-muted-foreground mb-2" />
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              multiple 
                              accept="image/*"
                              onChange={handlePhotoUpload}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Выбор модели */}
            <FormField
              control={form.control}
              name="selectedModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Выберите модель</FormLabel>
                  <FormDescription>
                    Выберите из готовых типажей или загрузите свой вариант
                  </FormDescription>
                  <FormControl>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-2">
                      {MODEL_PRESETS.map((preset) => (
                        <div 
                          key={preset.id}
                          onClick={() => field.onChange(preset.id)}
                          className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                            field.value === preset.id 
                              ? "border-primary shadow-md scale-[1.02]" 
                              : "border-transparent hover:border-primary/30"
                          }`}
                        >
                          <img 
                            src={preset.imageUrl} 
                            alt={preset.name} 
                            className="w-full aspect-[3/4] object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                            <p className="text-white text-sm font-medium">{preset.name}</p>
                          </div>
                        </div>
                      ))}
                      
                      {/* Слот для своей модели */}
                      <div 
                        onClick={() => field.onChange("custom")}
                        className={`flex flex-col items-center justify-center aspect-[3/4] rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                          field.value === "custom"
                            ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                            : "border-border hover:border-primary/50 hover:bg-accent/30"
                        }`}
                      >
                        <Plus className={`w-8 h-8 mb-2 ${field.value === "custom" ? "text-primary" : "text-muted-foreground"}`} />
                        <span className={`text-sm font-medium ${field.value === "custom" ? "text-primary" : "text-muted-foreground"}`}>Своя модель</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Промпт */}
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Дополнительные пожелания (опционально)</FormLabel>
                  <FormDescription>
                    Опишите локацию, стиль одежды или настроение кадра
                  </FormDescription>
                  <FormControl>
                    <Textarea 
                      placeholder="Например: Девушка в кафе, пьет кофе, мягкий утренний свет..." 
                      className="resize-none min-h-[100px] focus-visible:ring-primary"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full sm:w-auto px-8 py-6 text-lg rounded-xl shadow-sm hover:shadow-md transition-all">
              Начать генерацию
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
