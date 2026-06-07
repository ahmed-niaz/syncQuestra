"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ position = "top-center", ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position={position}
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-emerald-500 dark:text-emerald-400" />
        ),
        info: (
          <InfoIcon className="size-4 text-blue-500 dark:text-blue-400" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-amber-500 dark:text-amber-400" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-destructive dark:text-red-400" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl group-[.toaster]:border group-[.toaster]:px-4 group-[.toaster]:py-3 group-[.toaster]:text-sm group-[.toaster]:font-sans group-[.toaster]:flex group-[.toaster]:items-center group-[.toaster]:gap-3",
          description: "group-[.toast]:text-muted-foreground text-xs",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-medium text-xs rounded-md px-3 py-1.5",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-medium text-xs rounded-md px-3 py-1.5",
          error:
            "group-[.toaster]:border-destructive/30 group-[.toaster]:bg-destructive/5 dark:group-[.toaster]:bg-destructive/10",
          success:
            "group-[.toaster]:border-emerald-500/30 group-[.toaster]:bg-emerald-500/5 dark:group-[.toaster]:bg-emerald-500/10",
          warning:
            "group-[.toaster]:border-amber-500/30 group-[.toaster]:bg-amber-500/5 dark:group-[.toaster]:bg-amber-500/10",
          info:
            "group-[.toaster]:border-blue-500/30 group-[.toaster]:bg-blue-500/5 dark:group-[.toaster]:bg-blue-500/10",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
