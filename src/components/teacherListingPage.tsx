import { Box, Text, VStack, Input, FieldRoot, FieldLabel } from "@chakra-ui/react"
import { useTeacherListing } from "../hooks/useTeacherListing"
import type { Teacher } from "../hooks/useTeacherListing"
import { ListingPage } from "./common/ListingPage"
import type { Column } from "./common/ListingPage"

const columns: Column<Teacher>[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "subject", label: "Subject" },
  { key: "experience", label: "Experience (Years)" },
  { key: "joinDate", label: "Join Date" },
  { key: "actions", label: "Actions" },
]

function TeacherListingPage() {
  const {
    teachers,
    selectedTeacher,
    editingTeacher,
    deletingTeacher,
    handleView,
    handleEdit,
    handleDelete,
    closeView,
    closeEdit,
    closeDelete,
    updateEditingTeacher,
    saveEdit,
    confirmDelete,
  } = useTeacherListing()

  const renderViewDetails = (teacher: Teacher) => (
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
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Subject</Text>
        <Text fontSize="md">{teacher.subject}</Text>
      </Box>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Experience</Text>
        <Text fontSize="md">{teacher.experience} Years</Text>
      </Box>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Join Date</Text>
        <Text fontSize="md">{teacher.joinDate}</Text>
      </Box>
    </VStack>
  )

  const renderEditFields = (teacher: Teacher) => (
    <>
      <FieldRoot>
        <FieldLabel>Name</FieldLabel>
        <Input
          value={teacher.name}
          onChange={(e) => updateEditingTeacher({ name: e.target.value })}
        />
      </FieldRoot>
      <FieldRoot>
        <FieldLabel>Email</FieldLabel>
        <Input
          value={teacher.email}
          onChange={(e) => updateEditingTeacher({ email: e.target.value })}
        />
      </FieldRoot>
      <FieldRoot>
        <FieldLabel>Subject</FieldLabel>
        <Input
          value={teacher.subject}
          onChange={(e) => updateEditingTeacher({ subject: e.target.value })}
        />
      </FieldRoot>
      <FieldRoot>
        <FieldLabel>Experience (Years)</FieldLabel>
        <Input
          type="number"
          value={teacher.experience}
          onChange={(e) => updateEditingTeacher({ experience: parseInt(e.target.value) || 0 })}
        />
      </FieldRoot>
      <FieldRoot>
        <FieldLabel>Join Date</FieldLabel>
        <Input
          type="date"
          value={teacher.joinDate}
          onChange={(e) => updateEditingTeacher({ joinDate: e.target.value })}
        />
      </FieldRoot>
    </>
  )

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

export default TeacherListingPage
