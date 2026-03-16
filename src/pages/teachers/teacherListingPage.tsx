import { Box, Text, VStack, Input, FieldRoot, FieldLabel, Center, Spinner } from "@chakra-ui/react"
import { useTeacherListing } from "../../hooks/useTeacherListing"
import { ListingPage } from "../../components/common/ListingPage"
import type { Column } from "../../components/common/ListingPage"
import { type UseFormRegister, type FieldErrors } from "react-hook-form"
import type { Teacher as ApiTeacher, CreateTeacherInput } from "../../api/types"
import { TeacherEditModal } from "./TeacherEditModal"
import { TeacherViewModal } from "./TeacherViewModal"

const columns: Column<ApiTeacher>[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "actions", label: "Actions" },
]

interface TeacherFormProps {
  register: UseFormRegister<CreateTeacherInput>
  errors: FieldErrors<CreateTeacherInput>
}

export const TeacherForm = ({ register, errors }: TeacherFormProps) => (
  <>
    <FieldRoot invalid={!!errors.name}>
      <FieldLabel>
        Name <Text as="span" color="red.500">*</Text>
      </FieldLabel>
      <Input
        {...register("name", { required: "Name is required" })}
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
        type="password"
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
    viewingTeacherId,
    formTeacherId,
    deletingTeacher,
    fetchTeachers,
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
  } = useTeacherListing()

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
    </VStack>
  )

  return (
    <>
      <ListingPage
        title="Teachers"
        description="Manage teacher records"
        addButtonText="Add Teacher"
        columns={columns}
        data={teachers}
        deletingItem={deletingTeacher}
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

      <TeacherViewModal
        teacherId={viewingTeacherId}
        isOpen={!!viewingTeacherId}
        onClose={closeView}
      />

      <TeacherEditModal
        teacherId={formTeacherId}
        isOpen={!!formTeacherId}
        onClose={closeForm}
        onSuccess={fetchTeachers}
      />
    </>
  )
}

export default TeacherListingPage
