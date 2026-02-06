import { Box, Text, VStack, Input, FieldRoot, FieldLabel, Spinner, Center, NativeSelect } from "@chakra-ui/react"
import { useStudentListing } from "../../hooks/useStudentListing"
import type { Student } from "../../hooks/useStudentListing"
import { ListingPage } from "../../components/common/ListingPage"
import type { Column } from "../../components/common/ListingPage"
import { useForm, type UseFormRegister, type FieldErrors } from "react-hook-form"
import { useEffect } from "react"

const columns: Column<Student>[] = [
  { key: "name", label: "Name" },
  { key: "admissionNo", label: "Admission No" },
  { key: "gender", label: "Gender" },
  { key: "dob", label: "Date of Birth" },
  { key: "phone", label: "Phone" },
  { key: "actions", label: "Actions" },
]

interface StudentFormProps {
  register: UseFormRegister<Student>
  errors: FieldErrors<Student>
}

const StudentForm = ({ register, errors }: StudentFormProps) => (
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
    <FieldRoot invalid={!!errors.admissionNo}>
      <FieldLabel>
        Admission No <Text as="span" color="red.500">*</Text>
      </FieldLabel>
      <Input
        {...register("admissionNo", { 
          required: "Admission number is required",
          pattern: {
            value: /^\d+$/,
            message: "Admission number should only contain numbers"
          }
        })}
        placeholder="Enter admission number"
      />
      {errors.admissionNo && <Text color="red.500" fontSize="xs">{errors.admissionNo.message}</Text>}
    </FieldRoot>
    <FieldRoot invalid={!!errors.gender}>
      <FieldLabel>
        Gender <Text as="span" color="red.500">*</Text>
      </FieldLabel>
      <NativeSelect.Root>
        <NativeSelect.Field
          {...register("gender", { required: "Gender is required" })}
          placeholder="Select gender"
        >
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>
      {errors.gender && <Text color="red.500" fontSize="xs">{errors.gender.message}</Text>}
    </FieldRoot>
    <FieldRoot invalid={!!errors.dob}>
      <FieldLabel>
        Date of Birth <Text as="span" color="red.500">*</Text>
      </FieldLabel>
      <Input
        type="date"
        {...register("dob", { required: "Date of Birth is required" })}
        placeholder="Enter date of birth"
      />
      {errors.dob && <Text color="red.500" fontSize="xs">{errors.dob.message}</Text>}
    </FieldRoot>
    <FieldRoot invalid={!!errors.phone}>
      <FieldLabel>
        Phone <Text as="span" color="red.500">*</Text>
      </FieldLabel>
      <Input
        type="text"
        {...register("phone", { 
          required: "Phone is required",
          pattern: {
            value: /^\d{10}$/,
            message: "Phone number must be 10 digits"
          }
        })}
        placeholder="Enter phone number"
      />
      {errors.phone && <Text color="red.500" fontSize="xs">{errors.phone.message}</Text>}
    </FieldRoot>
  </>
)

function StudentListingPage() {
  const {
    students,
    isLoading,
    error,
    selectedStudent,
    editingStudent,
    deletingStudent,
    handleView,
    handleEdit,
    handleDelete,
    closeView,
    closeEdit,
    closeDelete,
    saveEdit,
    confirmDelete,
    
    addingStudent,
    handleAdd,
    closeAdd,
    saveAdd,
    
    // Pagination
    currentPage,
    totalPages,
    totalCount,
    pageSize,
    handlePageChange,
  } = useStudentListing()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Student>()

  useEffect(() => {
    if (editingStudent) {
      reset(editingStudent)
    } else if (addingStudent) {
      reset({ name: "", admissionNo: "", gender: "MALE", dob: "", phone: "" } as Student) 
    }
  }, [editingStudent, addingStudent, reset])

  const onFormSubmit = (data: Student) => {
    if (editingStudent) {
      saveEdit(data)
    } else {
      saveAdd(data)
    }
  }

  const renderViewDetails = (student: Student) => (
    <VStack align="start" gap={4}>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Name</Text>
        <Text fontSize="md">{student.name}</Text>
      </Box>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Admission No</Text>
        <Text fontSize="md">{student.admissionNo}</Text>
      </Box>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Gender</Text>
        <Text fontSize="md">{student.gender}</Text>
      </Box>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Date of Birth</Text>
        <Text fontSize="md">{student.dob}</Text>
      </Box>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Phone</Text>
        <Text fontSize="md">{student.phone}</Text>
      </Box>
    </VStack>
  )

  if (isLoading && students.length === 0) {
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
      title="Students"
      description="Manage student records"
      addButtonText="Add Student"
      columns={columns}
      data={students}
      selectedItem={selectedStudent}
      editingItem={editingStudent}
      deletingItem={deletingStudent}
      addingItem={addingStudent}
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
        <StudentForm 
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


export default StudentListingPage
