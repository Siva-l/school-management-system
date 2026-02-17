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
import { studentService } from "../../service/studentService"
import { showErrorToast } from "../../util/toast.util"
import type { Student } from "../../api/types"

interface StudentViewModalProps {
  studentId: string | null
  isOpen: boolean
  onClose: () => void
}

export function StudentViewModal({ studentId, isOpen, onClose }: StudentViewModalProps) {
  const [isFetching, setIsFetching] = useState(false)
  const [student, setStudent] = useState<Student | null>(null)

  useEffect(() => {
    if (isOpen && studentId) {
      setIsFetching(true)
      studentService.getStudentById(studentId)
        .then((response) => {
          if (response.success && response.data) {
            const studentData = response.data as any
            setStudent(studentData)
          }
        })
        .catch(() => {
          showErrorToast("Error", "Failed to fetch student details")
          onClose()
        })
        .finally(() => {
          setIsFetching(false)
        })
    } else {
      setStudent(null)
    }
  }, [isOpen, studentId, onClose])

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
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {isFetching ? (
              <Center py={8}>
                <Spinner size="lg" color="blue.500" />
              </Center>
            ) : student ? (
              <Stack gap={3}>
                <Stack gap={1}>
                  <Text fontWeight="semibold" fontSize="sm" color="gray.600">Name</Text>
                  <Text>{student.name}</Text>
                </Stack>
                <Stack gap={1}>
                  <Text fontWeight="semibold" fontSize="sm" color="gray.600">Admission No</Text>
                  <Text>{student.admissionNo}</Text>
                </Stack>
                <Stack gap={1}>
                  <Text fontWeight="semibold" fontSize="sm" color="gray.600">Gender</Text>
                  <Text>{student.gender}</Text>
                </Stack>
                <Stack gap={1}>
                  <Text fontWeight="semibold" fontSize="sm" color="gray.600">Date of Birth</Text>
                  <Text>{student.dob}</Text>
                </Stack>
                <Stack gap={1}>
                  <Text fontWeight="semibold" fontSize="sm" color="gray.600">Phone</Text>
                  <Text>{student.phone}</Text>
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
