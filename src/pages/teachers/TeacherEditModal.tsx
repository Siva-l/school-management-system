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
import { teacherService } from "../../service/teacherService"
import { showErrorToast, showSuccessToast } from "../../util/toast.util"
import type { CreateTeacherInput } from "../../api/types"
import { TeacherForm } from "./teacherListingPage"

interface TeacherEditModalProps {
  teacherId: string | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function TeacherEditModal({ teacherId, isOpen, onClose, onSuccess }: TeacherEditModalProps) {
  const [isFetching, setIsFetching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditMode = !!teacherId && teacherId !== 'new'

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateTeacherInput>()

  useEffect(() => {
    if (isOpen && teacherId && teacherId !== 'new') {
      setIsFetching(true)
      teacherService.getTeacherById(teacherId)
        .then((response) => {
          if (response.success && response.data) {
            const teacher = response.data as any
            reset({
              name: teacher.name,
              email: teacher.email,
              phone: teacher.phone,
              password: "", // Password is not returned from API
            })
          }
        })
        .catch(() => {
          showErrorToast("Error", "Failed to fetch teacher details")
          onClose()
        })
        .finally(() => {
          setIsFetching(false)
        })
    } else if (isOpen && (teacherId === null || teacherId === 'new')) {
      reset({
        name: "",
        email: "",
        phone: "",
        password: "",
      })
    }
  }, [isOpen, teacherId, reset, onClose])

  const onSubmit = async (data: CreateTeacherInput) => {
    setIsSubmitting(true)
    try {
      if (isEditMode) {
        const response = await teacherService.updateTeacher(teacherId!, data)
        if (response.success) {
          showSuccessToast("Success", "Teacher updated successfully")
          onSuccess()
          onClose()
        }
      } else {
        const response = await teacherService.createTeacher(data)
        if (response.success) {
          showSuccessToast("Success", "Teacher created successfully")
          onSuccess()
          onClose()
        }
      }
    } catch (error) {
      showErrorToast("Error", isEditMode ? "Failed to update teacher" : "Failed to create teacher")
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
            <DialogTitle>{isEditMode ? "Edit Teacher" : "Add New Teacher"}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {isFetching ? (
              <Center py={8}>
                <Spinner size="lg" color="blue.500" />
              </Center>
            ) : (
              <form id="teacher-form" onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={4}>
                  <TeacherForm register={register} errors={errors} />
                </Stack>
              </form>
            )}
          </DialogBody>
          <DialogFooter gap={3}>
            <AppButton
              type="submit"
              form="teacher-form"
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
