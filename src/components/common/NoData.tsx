import { Flex, Text, VStack } from "@chakra-ui/react"
import { FiInbox } from "react-icons/fi"

interface NoDataProps {
  message?: string
}

export const NoData = ({ message = "No data available" }: NoDataProps) => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      py={10}
      px={4}
      w="full"
      minH="300px"
      bg="gray.50"
      borderRadius="lg"
      border="1px dashed"
      borderColor="gray.200"
    >
      <VStack gap={4}>
        <FiInbox size={48} color="rgba(0,0,0,0.2)" />
        <Text color="gray.500" fontWeight="medium" fontSize="lg">
          {message}
        </Text>
      </VStack>
    </Flex>
  )
}
