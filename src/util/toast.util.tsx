import { createToaster } from "@chakra-ui/react"

// Create toaster instance
export const toaster = createToaster({
  placement: "bottom-start",
  duration: 3000,
  max: 5,
})

export type ToastStatus = "success" | "error" | "warning" | "info"

interface ShowToastOptions {
  title: string
  description?: string
  status?: ToastStatus
  duration?: number
}

export const showToast = ({
  title,
  description,
  status = "info",
  duration,
}: ShowToastOptions) => {
  toaster.create({
    title,
    description,
    type: status,
    duration,
  })
}

export const showSuccessToast = (title: string, description?: string) => {
  showToast({ title, description, status: "success" })
}

export const showErrorToast = (title: string, description?: string) => {
  showToast({ title, description, status: "error" })
}

export const showWarningToast = (title: string, description?: string) => {
  showToast({ title, description, status: "warning" })
}

export const showInfoToast = (title: string, description?: string) => {
  showToast({ title, description, status: "info" })
}
