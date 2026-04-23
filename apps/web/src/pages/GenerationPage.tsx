import { GenerationForm } from "../features/generation/components/GenerationForm"

export function GenerationPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          Новая генерация
        </h1>
        <p className="text-muted-foreground">
          Создайте профессиональные фотосеты с помощью AI-моделей
        </p>
      </div>
      <GenerationForm />
    </div>
  )
}
