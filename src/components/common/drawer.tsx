import {
  DrawerRoot as Root,
  DrawerBackdrop as Backdrop,
  DrawerTrigger as Trigger,
  DrawerCloseTrigger as CloseTrigger,
  DrawerPositioner as Positioner,
  DrawerContent as Content,
  DrawerHeader as Header,
  DrawerBody as Body,
  DrawerFooter as Footer,
  DrawerTitle as Title,
  DrawerActionTrigger as ActionTrigger,
} from "@chakra-ui/react"
import { Portal } from "@chakra-ui/react"
import * as React from "react"

export const DrawerRoot = Root
export const DrawerBackdrop = Backdrop
export const DrawerTrigger = Trigger
export const DrawerCloseTrigger = CloseTrigger
export const DrawerPositioner = Positioner

export const DrawerContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Content>
>(function DrawerContent(props, ref) {
  return (
    <Portal>
      <DrawerPositioner>
        <Content ref={ref} {...props} />
      </DrawerPositioner>
    </Portal>
  )
})

export const DrawerHeader = Header
export const DrawerBody = Body
export const DrawerFooter = Footer
export const DrawerTitle = Title
export const DrawerActionTrigger = ActionTrigger
