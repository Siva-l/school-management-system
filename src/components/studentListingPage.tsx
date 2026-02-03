import { Box, Text, VStack, Input, FieldRoot, FieldLabel } from "@chakra-ui/react"
import { useStudentListing } from "../hooks/useStudentListing"
import type { Student } from "../hooks/useStudentListing"
import { ListingPage } from "./common/ListingPage"
import type { Column } from "./common/ListingPage"
import { Spinner, Center } from "@chakra-ui/react"

const columns: Column<Student>[] = [
  { key: "name", label: "Name" },
  { key: "admissionNo", label: "Admission No" },
  { key: "gender", label: "Gender" },
  { key: "dob", label: "Date of Birth" },
  { key: "phone", label: "Phone" },
  { key: "actions", label: "Actions" },
]

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
    updateEditingStudent,
    saveEdit,
    confirmDelete,
    
    addingStudent,
    handleAdd,
    closeAdd,
    updateAddingStudent,
    saveAdd,
  } = useStudentListing()

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

  const renderEditFields = (student: Student) => (
    <>
      <FieldRoot>
        <FieldLabel>Name</FieldLabel>
        <Input
          value={student.name}
          onChange={(e) => updateEditingStudent({ name: e.target.value })}
        />
      </FieldRoot>
      <FieldRoot>
        <FieldLabel>Admission No</FieldLabel>
        <Input
          value={student.admissionNo}
          onChange={(e) => updateEditingStudent({ admissionNo: e.target.value })}
        />
      </FieldRoot>
      <FieldRoot>
        <FieldLabel>Gender</FieldLabel>
        <Input
          value={student.gender}
          onChange={(e) => updateEditingStudent({ gender: e.target.value as Student["gender"] })}
        />
      </FieldRoot>
      <FieldRoot>
        <FieldLabel>Date of Birth</FieldLabel>
        <Input
          type="date"
          value={student.dob}
          onChange={(e) => updateEditingStudent({ dob: e.target.value })}
        />
      </FieldRoot>
      <FieldRoot>
        <FieldLabel>Phone</FieldLabel>
        <Input
          type="text"
          value={student.phone}
          onChange={(e) => updateEditingStudent({ phone: e.target.value })}
        />
      </FieldRoot>
    </>
  )

  const renderAddFields = (student: Partial<Student>) => (
    <>
      <FieldRoot>
        <FieldLabel>Name</FieldLabel>
        <Input
          value={student.name || ""}
          onChange={(e) => updateAddingStudent({ name: e.target.value })}
          placeholder="Enter name"
        />
      </FieldRoot>
      <FieldRoot>
        <FieldLabel>Admission No</FieldLabel>
        <Input
          value={student.admissionNo || ""}
          onChange={(e) => updateAddingStudent({ admissionNo: e.target.value })}
          placeholder="Enter admission number"
        />
      </FieldRoot>
      <FieldRoot>
        <FieldLabel>Gender</FieldLabel>
        <Input
          value={student.gender || ""}
          onChange={(e) => updateAddingStudent({ gender: e.target.value as Student["gender"] })}
          placeholder="Enter gender"
        />
      </FieldRoot>
      <FieldRoot>
        <FieldLabel>Date of Birth</FieldLabel>
        <Input
          type="date"
          value={student.dob || ""}
          onChange={(e) => updateAddingStudent({ dob: e.target.value })}
          placeholder="Enter date of birth"
        />
      </FieldRoot>
      <FieldRoot>
        <FieldLabel>Phone</FieldLabel>
        <Input
          type="text"
          value={student.phone || ""}
          onChange={(e) => updateAddingStudent({ phone: e.target.value })}
          placeholder="Enter phone number"
        />
      </FieldRoot>
    </>
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
      onSaveEdit={saveEdit}
      onSaveAdd={saveAdd}
      onConfirmDelete={confirmDelete}
      renderViewDetails={renderViewDetails}
      renderEditFields={renderEditFields}
      renderAddFields={renderAddFields}
    />
  )
}

export default StudentListingPage
