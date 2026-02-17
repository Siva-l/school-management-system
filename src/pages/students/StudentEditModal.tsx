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
} from "@chakra-ui/react"
import { FiX } from "react-icons/fi"
import { AppButton } from "../../components/common/AppButton"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { studentService } from "../../service/studentService"
import { showErrorToast, showSuccessToast } from "../../util/toast.util"
import type { CreateStudentInput } from "../../api/types"
import { StudentForm } from "./studentListingPage"

interface StudentEditModalProps {
  studentId: string | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function StudentEditModal({ studentId, isOpen, onClose, onSuccess }: StudentEditModalProps) {
  const [isFetching, setIsFetching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditMode = !!studentId && studentId !== 'new'

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateStudentInput>()

  // Fetch data when editing
  useEffect(() => {
    if (isOpen && studentId && studentId !== 'new') {
      setIsFetching(true)
      studentService.getStudentById(studentId)
        .then((response) => {
          if (response.success && response.data) {
            const student = response.data as any
            reset({
              name: student.name,
              admissionNo: student.admissionNo,
              gender: student.gender,
              dob: student.dob,
              phone: student.phone,
            })
          }
        })
        .catch(() => {
          showErrorToast("Error", "Failed to fetch student details")
          onClose()
        })
        .finally(() => {
          setIsFetching(false)
        })
    } else if (isOpen && (studentId === null || studentId === 'new')) {
      // Reset form for add mode
      reset({
        name: "",
        admissionNo: "",
        gender: "",
        dob: "",
        phone: "",
      })
    }
  }, [isOpen, studentId, reset, onClose])

  const onSubmit = async (data: CreateStudentInput) => {
    setIsSubmitting(true)
    try {
      if (isEditMode) {
        // Update existing student
        const response = await studentService.updateStudent(studentId!, data)
        if (response.success) {
          showSuccessToast("Success", "Student updated successfully")
          onSuccess()
          onClose()
        }
      } else {
        // Create new student
        const response = await studentService.createStudent(data)
        if (response.success) {
          showSuccessToast("Success", "Student created successfully")
          onSuccess()
          onClose()
        }
      }
    } catch (error) {
      showErrorToast("Error", isEditMode ? "Failed to update student" : "Failed to create student")
    } finally {
      setIsSubmitting(false)
    }
  }

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
            <DialogTitle>{isEditMode ? "Edit Student" : "Add New Student"}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {isFetching ? (
              <Center py={8}>
                <Spinner size="lg" color="blue.500" />
              </Center>
            ) : (
              <form id="student-form" onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={4}>
                  <StudentForm register={register} errors={errors} />
                </Stack>
              </form>
            )}
          </DialogBody>
          <DialogFooter gap={3}>
            <AppButton
              type="submit"
              form="student-form"
              colorPalette="blue"
              flex="1"
              loading={isSubmitting}
              disabled={isFetching}
            >
              {isEditMode ? "Update" : "Create"}
            </AppButton>
            <DialogActionTrigger asChild>
              <AppButton variant="subtle" colorPalette="gray" flex="1" onClick={onClose}>
                Cancel
              </AppButton>
            </DialogActionTrigger>
          </DialogFooter>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  )
}
