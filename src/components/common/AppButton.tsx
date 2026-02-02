import { Button } from "@chakra-ui/react"
import type { ButtonProps } from "@chakra-ui/react"

interface AppButtonProps extends ButtonProps {}

export const AppButton = ({ borderRadius = 10, ...props }: AppButtonProps) => {
  return (
    <Button 
      borderRadius={borderRadius} 
      {...props} 
    />
  )
}
