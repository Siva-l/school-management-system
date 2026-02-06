import { Toaster as ChakraToaster, Portal, Spinner, Stack, Toast } from "@chakra-ui/react"
import { toaster } from "../../util/toast.util"

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetBlockEnd="24px" insetInlineEnd="24px">
        {(toast) => (
          <Toast.Root width={{ base: "full", sm: "sm" }}>
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.solid" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            <Toast.CloseTrigger />
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
