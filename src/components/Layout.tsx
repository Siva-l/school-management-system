import {
  Box,
  Flex,
  Heading,
  IconButton,
  HStack,
  VStack,
  Text,
} from "@chakra-ui/react"
import { FiMenu, FiBookOpen, FiBook, FiUsers, FiX } from "react-icons/fi"
import { useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
} from "./common/drawer"

export function Layout() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const currentPage = location.pathname === "/" ? "" : location.pathname.slice(1)

  const menuItems = [
    { id: "", label: "Dashboard", icon: <FiMenu /> },
    { id: "students", label: "Students", icon: <FiUsers /> },
    { id: "teachers", label: "Teachers", icon: <FiUsers /> },
    { id: "subjects", label: "Subjects", icon: <FiBook /> },
  ]

  return (
    <Box minH="100vh" bg="gray.50">
    
      <Flex
        as="header"
        align="center"
        justify="space-between"
        px={6}
        py={4}
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <HStack gap={4}>
          <IconButton
            aria-label="Toggle Navigation"
            variant="ghost"
            onClick={() => setOpen(true)}
          >
            <FiMenu />
          </IconButton>
          
          <HStack gap={2}>
             <FiBookOpen size={24} color="#3182ce" />
            <Heading size="md" color="black.800">
               School Management System
            </Heading>
          </HStack>
        </HStack>
      </Flex>

      <Box as="main"><Outlet /></Box>

      <DrawerRoot open={open} onOpenChange={(e: any) => setOpen(e.open)} placement="start">
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px" display="flex" alignItems="center" justifyContent="space-between">
             <HStack>
                <FiBookOpen color="#3182ce" />
                <DrawerTitle>Menu</DrawerTitle>
             </HStack>
            <DrawerCloseTrigger position="static">
                <FiX />
            </DrawerCloseTrigger>
          </DrawerHeader>
          <DrawerBody p={4}>
             <VStack align="stretch" gap={2}>
                {menuItems.map((item) => (
                    <Box
                        key={item.id}
                        px={4}
                        py={3}
                        cursor="pointer"
                        bg={currentPage === item.id ? "blue.50" : "transparent"}
                        color={currentPage === item.id ? "blue.600" : "gray.700"}
                        _hover={{ bg: currentPage === item.id ? "blue.50" : "gray.100" }}
                        onClick={() => {
                            navigate(`/${item.id}`)
                            setOpen(false)
                        }}
                        display="flex"
                        alignItems="center"
                        gap={4}
                        borderRadius="lg"
                    >
                        <Box as="span" fontSize="lg">
                            {item.icon}
                        </Box>
                        <Text fontWeight={currentPage === item.id ? "semibold" : "medium"}>
                            {item.label}
                        </Text>
                    </Box>
                ))}
             </VStack>
          </DrawerBody>
        </DrawerContent>
      </DrawerRoot>
    </Box>
  )
}
