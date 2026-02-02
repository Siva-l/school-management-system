import { Box, Text, VStack, Input, FieldRoot, FieldLabel } from "@chakra-ui/react"
import { useStudentListing } from "../hooks/useStudentListing"
import type { Student } from "../hooks/useStudentListing"
import { ListingPage } from "./common/ListingPage"
import type { Column } from "./common/ListingPage"

const columns: Column<Student>[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "grade", label: "Grade" },
  { key: "age", label: "Age" },
  { key: "enrollmentDate", label: "Enrollment Date" },
  { key: "actions", label: "Actions" },
]

function StudentListingPage() {
  const {
    students,
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
  } = useStudentListing()

  const renderViewDetails = (student: Student) => (
    <VStack align="start" gap={4}>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Name</Text>
        <Text fontSize="md">{student.name}</Text>
      </Box>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Email</Text>
        <Text fontSize="md">{student.email}</Text>
      </Box>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Grade</Text>
        <Text fontSize="md">{student.grade}</Text>
      </Box>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Age</Text>
        <Text fontSize="md">{student.age}</Text>
      </Box>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Enrollment Date</Text>
        <Text fontSize="md">{student.enrollmentDate}</Text>
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
        <FieldLabel>Email</FieldLabel>
        <Input
          value={student.email}
          onChange={(e) => updateEditingStudent({ email: e.target.value })}
        />
      </FieldRoot>
      <FieldRoot>
        <FieldLabel>Grade</FieldLabel>
        <Input
          value={student.grade}
          onChange={(e) => updateEditingStudent({ grade: e.target.value })}
        />
      </FieldRoot>
      <FieldRoot>
        <FieldLabel>Age</FieldLabel>
        <Input
          type="number"
          value={student.age}
          onChange={(e) => updateEditingStudent({ age: parseInt(e.target.value) || 0 })}
        />
      </FieldRoot>
      <FieldRoot>
        <FieldLabel>Enrollment Date</FieldLabel>
        <Input
          type="date"
          value={student.enrollmentDate}
          onChange={(e) => updateEditingStudent({ enrollmentDate: e.target.value })}
        />
      </FieldRoot>
    </>
  )

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
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onCloseView={closeView}
      onCloseEdit={closeEdit}
      onCloseDelete={closeDelete}
      onSaveEdit={saveEdit}
      onConfirmDelete={confirmDelete}
      renderViewDetails={renderViewDetails}
      renderEditFields={renderEditFields}
    />
  )
}

export default StudentListingPage
