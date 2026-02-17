import { Box, Text, VStack, Input, FieldRoot, FieldLabel, Center, Spinner } from "@chakra-ui/react"
import { useSubjectListing } from "../../hooks/useSubjectListing"
import { ListingPage } from "../../components/common/ListingPage"
import type { Column } from "../../components/common/ListingPage"
import { type UseFormRegister, type FieldErrors } from "react-hook-form"
import type { Subject as ApiSubject, CreateSubjectInput } from "../../api/types"
import { SubjectEditModal } from "./SubjectEditModal"
import { SubjectViewModal } from "./SubjectViewModal"

const columns: Column<ApiSubject>[] = [
  { key: "name", label: "Subject Name" },
  { key: "code", label: "Subject Code" },
  { key: "actions", label: "Actions" },
]

interface SubjectFormProps {
  register: UseFormRegister<CreateSubjectInput>
  errors: FieldErrors<CreateSubjectInput>
}

export const SubjectForm = ({ register, errors }: SubjectFormProps) => (
  <>
    <FieldRoot invalid={!!errors.name}>
      <FieldLabel>
        Subject Name <Text as="span" color="red.500">*</Text>
      </FieldLabel>
      <Input
        {...register("name", { required: "Subject name is required" })}
        placeholder="Enter subject name"
      />
      {errors.name && <Text color="red.500" fontSize="xs">{errors.name.message}</Text>}
    </FieldRoot>

    <FieldRoot invalid={!!errors.code}>
      <FieldLabel>
        Subject Code <Text as="span" color="red.500">*</Text>
      </FieldLabel>
      <Input
        {...register("code", { required: "Subject code is required" })}
        placeholder="Enter subject code"
      />
      {errors.code && <Text color="red.500" fontSize="xs">{errors.code.message}</Text>}
    </FieldRoot>
  </>
)

function SubjectListingPage() {
  const {
    subjects,
    isLoading,
    error,
    viewingSubjectId,
    formSubjectId,
    deletingSubject,
    fetchSubjects,
    handleView,
    handleEdit,
    handleDelete,
    handleAdd,
    closeView,
    closeForm,
    closeDelete,
    confirmDelete,

    // Pagination
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    handlePageChange,
  } = useSubjectListing()

  if (isLoading && subjects.length === 0) {
    return (
      <Center h="400px">
        <Spinner size="xl" color="blue.500" />
      </Center>
    )
  }

  if (error) {
    return (
      <Center h="400px">
        <Text color="red.500">{error}</Text>
      </Center>
    )
  }

  const renderViewDetails = (subject: ApiSubject) => (
    <VStack align="start" gap={4}>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Subject Name</Text>
        <Text fontSize="md">{subject.name}</Text>
      </Box>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Subject Code</Text>
        <Text fontSize="md">{subject.code}</Text>
      </Box>
    </VStack>
  )

  return (
    <>
      <ListingPage
        title="Subjects"
        description="Manage subject records"
        addButtonText="Add Subject"
        columns={columns}
        data={subjects}
        deletingItem={deletingSubject}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        onCloseView={closeView}
        onCloseDelete={closeDelete}
        onConfirmDelete={confirmDelete}
        renderViewDetails={renderViewDetails}
        totalCount={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />

      <SubjectViewModal
        subjectId={viewingSubjectId}
        isOpen={!!viewingSubjectId}
        onClose={closeView}
      />

      <SubjectEditModal
        subjectId={formSubjectId}
        isOpen={!!formSubjectId}
        onClose={closeForm}
        onSuccess={fetchSubjects}
      />
    </>
  )
}

export default SubjectListingPage
