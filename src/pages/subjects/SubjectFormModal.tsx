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
import { subjectService } from "../../service/subjectService"
import { showErrorToast, showSuccessToast } from "../../util/toast.util"
import type { CreateSubjectInput } from "../../api/types"
import { SubjectForm } from "./subjectListingPage"

interface SubjectFormModalProps {
  subjectId: string | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function SubjectFormModal({ subjectId, isOpen, onClose, onSuccess }: SubjectFormModalProps) {
  const [isFetching, setIsFetching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditMode = !!subjectId

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateSubjectInput>()

  useEffect(() => {
    if (isOpen && subjectId) {
      setIsFetching(true)
      subjectService.getSubjectById(subjectId)
        .then((response) => {
          if (response.success && response.data) {
            const subject = response.data as any
            reset({
              name: subject.name,
              code: subject.code,
            })
          }
        })
        .catch(() => {
          showErrorToast("Error", "Failed to fetch subject details")
          onClose()
        })
        .finally(() => {
          setIsFetching(false)
        })
    } else if (isOpen && !subjectId) {
      reset({
        name: "",
        code: "",
      })
    }
  }, [isOpen, subjectId, reset, onClose])

  const onSubmit = async (data: CreateSubjectInput) => {
    setIsSubmitting(true)
    try {
      if (isEditMode) {
        const response = await subjectService.updateSubject(subjectId, data)
        if (response.success) {
          showSuccessToast("Success", "Subject updated successfully")
          onSuccess()
          onClose()
        }
      } else {
        const response = await subjectService.createSubject(data)
        if (response.success) {
          showSuccessToast("Success", "Subject created successfully")
          onSuccess()
          onClose()
        }
      }
    } catch (error) {
      showErrorToast("Error", isEditMode ? "Failed to update subject" : "Failed to create subject")
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
            <DialogTitle>{isEditMode ? "Edit Subject" : "Add New Subject"}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {isFetching ? (
              <Center py={8}>
                <Spinner size="lg" color="blue.500" />
              </Center>
            ) : (
              <form id="subject-form" onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={4}>
                  <SubjectForm register={register} errors={errors} />
                </Stack>
              </form>
            )}
          </DialogBody>
          <DialogFooter gap={3}>
            <AppButton
              type="submit"
              form="subject-form"
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
