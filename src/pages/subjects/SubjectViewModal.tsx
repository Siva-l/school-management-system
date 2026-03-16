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
import { subjectService } from "../../service/subjectService"
import { showErrorToast } from "../../util/toast.util"
import type { Subject } from "../../api/types"

interface SubjectViewModalProps {
  subjectId: string | null
  isOpen: boolean
  onClose: () => void
}

export function SubjectViewModal({ subjectId, isOpen, onClose }: SubjectViewModalProps) {
  const [isFetching, setIsFetching] = useState(false)
  const [subject, setSubject] = useState<Subject | null>(null)

  useEffect(() => {
    if (isOpen && subjectId) {
      setIsFetching(true)
      subjectService.getSubjectById(subjectId)
        .then((response) => {
          if (response.success && response.data) {
            const subjectData = response.data as any
            setSubject(subjectData)
          }
        })
        .catch(() => {
          showErrorToast("Error", "Failed to fetch subject details")
          onClose()
        })
        .finally(() => {
          setIsFetching(false)
        })
    } else {
      setSubject(null)
    }
  }, [isOpen, subjectId, onClose])

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
            <DialogTitle>Subject Details</DialogTitle>
          </DialogHeader>
          <DialogBody>
            {isFetching ? (
              <Center py={8}>
                <Spinner size="lg" color="blue.500" />
              </Center>
            ) : subject ? (
              <Stack gap={3}>
                <Stack gap={1}>
                  <Text fontWeight="semibold" fontSize="sm" color="gray.600">Name</Text>
                  <Text>{subject.name}</Text>
                </Stack>
                <Stack gap={1}>
                  <Text fontWeight="semibold" fontSize="sm" color="gray.600">Code</Text>
                  <Text>{subject.code}</Text>
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
