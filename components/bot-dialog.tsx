"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircleIcon, ShuffleIcon } from "lucide-react"
import { useId, useState, type ComponentProps, type ReactNode } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import { createBot } from "@/actions/bot"
import { ChatAvatar } from "@/components/chat-avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { botPresets } from "@/lib/bot-presets"
import { createBotSchema } from "@/lib/db/schema"

type BotDialogProps = {
  children: ReactNode
  initialAvatar: string
  finalFocus?: ComponentProps<typeof DialogContent>["finalFocus"]
}

export function BotDialog({
  children,
  initialAvatar,
  finalFocus,
}: BotDialogProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const form = useForm<
    z.input<typeof createBotSchema>,
    unknown,
    z.output<typeof createBotSchema>
  >({
    resolver: zodResolver(createBotSchema),
    defaultValues: {
      avatar: initialAvatar,
      name: "",
      job: "",
      instructions: "",
    },
  })
  const [name, job, instructions] = useWatch({
    control: form.control,
    name: ["name", "job", "instructions"],
  })
  const selectedPreset = botPresets.find(
    (preset) =>
      preset.name === name &&
      preset.job === job &&
      preset.instructions === instructions
  )
  const { isSubmitting, errors } = form.formState

  function showSubmitError(message: string) {
    form.setError("root", { message })
    toast.add({
      type: "error",
      title: "Could not create bot",
      description: message,
      priority: "high",
    })
  }

  async function onSubmit(values: z.output<typeof createBotSchema>) {
    form.clearErrors("root")

    try {
      const result = await createBot(values)

      if (!result.success) {
        if (result.fieldErrors) {
          for (const name of [
            "name",
            "avatar",
            "job",
            "instructions",
          ] as const) {
            const message = result.fieldErrors[name]?.[0]
            if (message) form.setError(name, { message })
          }
        }
        showSubmitError(result.error)
        return
      }

      setOpen(false)
      toast.add({
        type: "success",
        title: "Bot created",
        description: `${values.name} was created successfully.`,
      })
    } catch {
      showSubmitError("Your bot could not be created. Please try again.")
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isSubmitting) return
        if (nextOpen) {
          form.reset({
            avatar: crypto.randomUUID(),
            name: "",
            job: "",
            instructions: "",
          })
        }
        setOpen(nextOpen)
      }}
    >
      {children}
      <DialogContent
        finalFocus={finalFocus}
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-xl"
        showCloseButton={!isSubmitting}
      >
        <DialogHeader className="pr-8">
          <DialogTitle>New bot</DialogTitle>
          <DialogDescription>
            Give it a face, a name, and a job to do.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-6"
          onSubmit={form.handleSubmit(onSubmit, () => {
            toast.add({
              type: "error",
              title: "Check your bot details",
              description: "Please fix the highlighted fields and try again.",
              priority: "high",
            })
          })}
          aria-busy={isSubmitting}
        >
          <ToggleGroup
            aria-label="Suggested jobs"
            variant="outline"
            className="w-full flex-wrap justify-start"
            value={selectedPreset ? [selectedPreset.job] : []}
            disabled={isSubmitting}
            onValueChange={(value) => {
              const preset = botPresets.find((item) => item.job === value[0])
              if (preset) {
                form.clearErrors("root")
                for (const field of ["name", "job", "instructions"] as const) {
                  form.setValue(field, preset[field], {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              }
            }}
          >
            {botPresets.map((preset) => (
              <ToggleGroupItem
                key={preset.job}
                value={preset.job}
                className="rounded-full"
              >
                {preset.job}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <FieldGroup>
            <Controller
              control={form.control}
              name="avatar"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex flex-wrap items-center gap-3">
                    <ChatAvatar seed={field.value} className="size-14" />
                    <FieldContent className="min-w-32">
                      <FieldTitle>Face</FieldTitle>
                      <FieldDescription id={`${id}-avatar-description`}>
                        Shuffle until you find one you like.
                      </FieldDescription>
                    </FieldContent>
                    <Button
                      ref={field.ref}
                      type="button"
                      variant="outline"
                      disabled={isSubmitting}
                      aria-describedby={`${id}-avatar-description${fieldState.invalid ? ` ${id}-avatar-error` : ""}`}
                      aria-invalid={fieldState.invalid}
                      onBlur={field.onBlur}
                      onClick={() => field.onChange(crypto.randomUUID())}
                    >
                      <ShuffleIcon aria-hidden data-icon="inline-start" />
                      Shuffle
                    </Button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError
                      id={`${id}-avatar-error`}
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${id}-name`}>Name</FieldLabel>
                  <Input
                    {...field}
                    id={`${id}-name`}
                    placeholder="Ada"
                    autoComplete="off"
                    required
                    disabled={isSubmitting}
                    aria-invalid={fieldState.invalid}
                    aria-describedby={
                      fieldState.invalid ? `${id}-name-error` : undefined
                    }
                  />
                  {fieldState.invalid && (
                    <FieldError
                      id={`${id}-name-error`}
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="job"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${id}-job`}>Job</FieldLabel>
                  <Input
                    {...field}
                    id={`${id}-job`}
                    placeholder="Research assistant"
                    autoComplete="off"
                    required
                    disabled={isSubmitting}
                    aria-invalid={fieldState.invalid}
                    aria-describedby={
                      fieldState.invalid ? `${id}-job-error` : undefined
                    }
                  />
                  {fieldState.invalid && (
                    <FieldError
                      id={`${id}-job-error`}
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="instructions"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${id}-instructions`}>
                    How it should work
                  </FieldLabel>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    id={`${id}-instructions`}
                    className="min-h-28 resize-y"
                    placeholder="Answer briefly, cite sources, and ask before running anything destructive."
                    disabled={isSubmitting}
                    aria-invalid={fieldState.invalid}
                    aria-describedby={
                      fieldState.invalid
                        ? `${id}-instructions-error`
                        : undefined
                    }
                  />
                  {fieldState.invalid && (
                    <FieldError
                      id={`${id}-instructions-error`}
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />
            {errors.root && <FieldError>{errors.root.message}</FieldError>}
          </FieldGroup>
          <DialogFooter>
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                />
              }
            >
              Cancel
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <LoaderCircleIcon
                  aria-hidden
                  data-icon="inline-start"
                  className="motion-safe:animate-spin"
                />
              )}
              {isSubmitting ? "Creating bot…" : "Create bot"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
