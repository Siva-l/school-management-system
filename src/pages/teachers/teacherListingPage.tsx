import { Box, Text, VStack, Input, FieldRoot, FieldLabel, Center, Spinner } from "@chakra-ui/react"
import { useTeacherListing } from "../../hooks/useTeacherListing"
import { ListingPage } from "../../components/common/ListingPage"
import type { Column } from "../../components/common/ListingPage"
import { useForm, type UseFormRegister, type FieldErrors } from "react-hook-form"
import { useEffect } from "react"
import type { Teacher as ApiTeacher, CreateTeacherInput } from "../../api/types"

type TeacherFormValues = CreateTeacherInput

const columns: Column<ApiTeacher>[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "password", label: "Password" },
  { key: "actions", label: "Actions" },
]

interface TeacherFormProps {
  register: UseFormRegister<TeacherFormValues>
  errors: FieldErrors<TeacherFormValues>
}

const TeacherForm = ({ register, errors }: TeacherFormProps) => (
  <>
    <FieldRoot invalid={!!errors.name}>
      <FieldLabel>
        Name <Text as="span" color="red.500">*</Text>
      </FieldLabel>
      <Input
        {...register("name", { 
          required: "Name is required"
        })}
        placeholder="Enter name"
      />
      {errors.name && <Text color="red.500" fontSize="xs">{errors.name.message}</Text>}
    </FieldRoot>
    <FieldRoot invalid={!!errors.email}>
      <FieldLabel>
        Email <Text as="span" color="red.500">*</Text>
      </FieldLabel>
      <Input
        {...register("email", { 
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address"
          }
        })}
        placeholder="Enter email"
      />
      {errors.email && <Text color="red.500" fontSize="xs">{errors.email.message}</Text>}
    </FieldRoot>
    <FieldRoot invalid={!!errors.phone}>
      <FieldLabel>
        Phone <Text as="span" color="red.500">*</Text>
      </FieldLabel>
      <Input
        {...register("phone", { 
          required: "Phone is required",
          pattern: {
            value: /^\d{10}$/,
            message: "Phone number must be 10 digits"
          }
        })}
        placeholder="Enter phone"
      />
      {errors.phone && <Text color="red.500" fontSize="xs">{errors.phone.message}</Text>}
    </FieldRoot>
    <FieldRoot invalid={!!errors.password}>
      <FieldLabel>
        Password <Text as="span" color="red.500">*</Text>
      </FieldLabel>
      <Input
        {...register("password", { required: "Password is required" })}
        placeholder="Enter password"
      />
      {errors.password && <Text color="red.500" fontSize="xs">{errors.password.message}</Text>}
    </FieldRoot>
  </>
)

function TeacherListingPage() {
  const {
    teachers,
    isLoading,
    error,
    selectedTeacher,
    editingTeacher,
    deletingTeacher,
    handleView,
    handleEdit,
    handleDelete,
    closeView,
    closeEdit,
    closeDelete,
    saveEdit,
    confirmDelete,

    addingTeacher,
    handleAdd,
    closeAdd,
    saveAdd,

    // Pagination
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    handlePageChange,
  } = useTeacherListing()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TeacherFormValues>()

  useEffect(() => {
    if (editingTeacher) {
      reset({
        name: editingTeacher.name,
        email: editingTeacher.email,
        phone: editingTeacher.phone,
        password: editingTeacher.password,
      })
    } else if (addingTeacher) {
      reset({ name: "", email: "", phone: "", password: "" })
    }
  }, [editingTeacher, addingTeacher, reset])

  const onFormSubmit = (data: TeacherFormValues) => {
    if (editingTeacher) {
      saveEdit(data)
    } else {
      saveAdd(data)
    }
  }

  const renderViewDetails = (teacher: ApiTeacher) => (
    <VStack align="start" gap={4}>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Name</Text>
        <Text fontSize="md">{teacher.name}</Text>
      </Box>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Email</Text>
        <Text fontSize="md">{teacher.email}</Text>
      </Box>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Phone</Text>
        <Text fontSize="md">{teacher.phone}</Text>
      </Box>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Password</Text>
        <Text fontSize="md">{teacher.password}</Text>
      </Box>
    </VStack>
  )

  if (isLoading && teachers.length === 0) {
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
      title="Teachers"
      description="Manage teacher records"
      addButtonText="Add Teacher"
      columns={columns}
      data={teachers}
      selectedItem={selectedTeacher}
      editingItem={editingTeacher}
      deletingItem={deletingTeacher}
      addingItem={addingTeacher}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAdd={handleAdd}
      onCloseView={closeView}
      onCloseEdit={closeEdit}
      onCloseDelete={closeDelete}
      onCloseAdd={closeAdd}
      onSubmit={() => handleSubmit(onFormSubmit)()}
      onConfirmDelete={confirmDelete}
      renderViewDetails={renderViewDetails}
      renderFields={() => (
        <TeacherForm 
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

export default TeacherListingPage
