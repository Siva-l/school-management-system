import {
  DialogRoot,
  DialogBackdrop,
  DialogPositioner,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogActionTrigger,
  IconButton,
  Stack,
  Spinner,
  Center,
  Text,
} from "@chakra-ui/react"
import { FiX } from "react-icons/fi"
import { AppButton } from "../../components/common/AppButton"
import { useEffect, useState } from "react"
import { teacherService } from "../../service/teacherService"
import { showErrorToast } from "../../util/toast.util"
import type { Teacher } from "../../api/types"

interface TeacherViewModalProps {
  teacherId: string | null
  isOpen: boolean
  onClose: () => void
}

export function TeacherViewModal({ teacherId, isOpen, onClose }: TeacherViewModalProps) {
  const [isFetching, setIsFetching] = useState(false)
  const [teacher, setTeacher] = useState<Teacher | null>(null)

  useEffect(() => {
    if (isOpen && teacherId) {
      setIsFetching(true)
      teacherService.getTeacherById(teacherId)
        .then((response) => {
          if (response.success && response.data) {
            const teacherData = response.data as any
            setTeacher(teacherData)
          }
        })
        .catch(() => {
          showErrorToast("Error", "Failed to fetch teacher details")
          onClose()
        })
        .finally(() => {
          setIsFetching(false)
        })
    } else {
      setTeacher(null)
    }
  }, [isOpen, teacherId, onClose])

  return (
    <DialogRoot open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent>
          <DialogCloseTrigger asChild position="absolute" top="2" right="2">
            <IconButton variant="ghost" size="sm" aria-label="Close">
              <FiX />
            </IconButton>
          </DialogCloseTrigger>
          <DialogHeader>
            <DialogTitle>Teacher Details</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {isFetching ? (
              <Center py={8}>
                <Spinner size="lg" color="blue.500" />
              </Center>
            ) : teacher ? (
              <Stack gap={3}>
                <Stack gap={1}>
                  <Text fontWeight="semibold" fontSize="sm" color="gray.600">Name</Text>
                  <Text>{teacher.name}</Text>
                </Stack>
                <Stack gap={1}>
                  <Text fontWeight="semibold" fontSize="sm" color="gray.600">Email</Text>
                  <Text>{teacher.email}</Text>
                </Stack>
                <Stack gap={1}>
                  <Text fontWeight="semibold" fontSize="sm" color="gray.600">Phone</Text>
                  <Text>{teacher.phone}</Text>
                </Stack>
              </Stack>
            ) : null}
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <AppButton variant="solid" colorPalette="blue" onClick={onClose}>
                Close
              </AppButton>
            </DialogActionTrigger>
          </DialogFooter>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  )
}
