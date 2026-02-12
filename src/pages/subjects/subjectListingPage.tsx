import { Box, Text, VStack, Input, FieldRoot, FieldLabel, Center, Spinner } from "@chakra-ui/react"
import { useSubjectListing } from "../../hooks/useSubjectListing"
import { ListingPage } from "../../components/common/ListingPage"
import type { Column } from "../../components/common/ListingPage"
import { useForm, type UseFormRegister, type FieldErrors } from "react-hook-form"
import { useEffect } from "react"
import type { Subject as ApiSubject, CreateSubjectInput } from "../../api/types"

type SubjectFormValues = CreateSubjectInput

const columns: Column<ApiSubject>[] = [
  { key: "name", label: "Subject Name" },
  { key: "code", label: "Code" },
  { key: "actions", label: "Actions" },
]

interface SubjectFormProps {
  register: UseFormRegister<SubjectFormValues>
  errors: FieldErrors<SubjectFormValues>
}

const SubjectForm = ({ register, errors }: SubjectFormProps) => (
  <>
    <FieldRoot invalid={!!errors.name}>
      <FieldLabel>
        Subject Name <Text as="span" color="red.500">*</Text>
      </FieldLabel>
      <Input
        {...register("name", { 
          required: "Subject name is required"
        })}
        placeholder="Enter subject name"
      />
      {errors.name && <Text color="red.500" fontSize="xs">{errors.name.message}</Text>}
    </FieldRoot>
    <FieldRoot invalid={!!errors.code}>
      <FieldLabel>
        Code <Text as="span" color="red.500">*</Text>
      </FieldLabel>
      <Input
        {...register("code", { 
          required: "Code is required",
          pattern: {
            value: /^\d+$/,
            message: "Code should only contain numbers"
          }
        })}
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
    selectedSubject,
    formData,
    deletingSubject,
    handleView,
    handleEdit,
    handleDelete,
    closeView,
    closeForm,
    closeDelete,
    saveEdit,
    confirmDelete,

    handleAdd,
    saveAdd,

    // Pagination
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    handlePageChange,
  } = useSubjectListing()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SubjectFormValues>()

  const isEdit = !!(formData && "id" in formData)
  const editingSubject = isEdit ? (formData as ApiSubject) : null
  const addingSubject = !isEdit && formData ? (formData as CreateSubjectInput) : null

  useEffect(() => {
    if (editingSubject) {
      const payload: CreateSubjectInput = {
        name: editingSubject.name,
        code: editingSubject.code,
      }
      reset(payload)
    } else if (addingSubject) {
      reset({ name: "", code: "" })
    }
  }, [editingSubject, addingSubject, reset])

  const onFormSubmit = (data: SubjectFormValues) => {
    if (editingSubject) {
      saveEdit(data)
    } else {
      saveAdd(data)
    }
  }

  const renderViewDetails = (subject: ApiSubject) => (
    <VStack align="start" gap={4}>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Subject Name</Text>
        <Text fontSize="md">{subject.name}</Text>
      </Box>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Code</Text>
        <Text fontSize="md">{subject.code}</Text>
      </Box>
    </VStack>
  )

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

  return (
    <ListingPage
      title="Subjects"
      description="Manage subject records"
      addButtonText="Add Subject"
      columns={columns}
      data={subjects}
      selectedItem={selectedSubject}
      editingItem={editingSubject}
      deletingItem={deletingSubject}
      addingItem={addingSubject}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAdd={handleAdd}
      onCloseView={closeView}
      onCloseEdit={closeForm}
      onCloseDelete={closeDelete}
      onCloseAdd={closeForm}
      onSubmit={() => handleSubmit(onFormSubmit)()}
      onConfirmDelete={confirmDelete}
      renderViewDetails={renderViewDetails}
      renderFields={() => (
        <SubjectForm 
          register={register} 
          errors={errors} 
        />
      )}
      totalCount={totalCount}
      currentPage={currentPage}
      totalPages={totalPages}
      pageSize={pageSize}
      onPageChange={handlePageChange}
    />
  )
}

export default SubjectListingPage
