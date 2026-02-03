import { Box, Text, VStack, Input, FieldRoot, FieldLabel } from "@chakra-ui/react"
import { useSubjectListing } from "../hooks/useSubjectListing"
import type { Subject } from "../hooks/useSubjectListing"
import { ListingPage } from "./common/ListingPage"
import type { Column } from "./common/ListingPage"

const columns: Column<Subject>[] = [
  { key: "name", label: "Subject Name" },
  { key: "code", label: "Code" },
  { key: "description", label: "Description" },
  { key: "credits", label: "Credits" },
  { key: "department", label: "Department" },
  { key: "actions", label: "Actions" },
]

function SubjectListingPage() {
  const {
    subjects,
    selectedSubject,
    editingSubject,
    deletingSubject,
    handleView,
    handleEdit,
    handleDelete,
    closeView,
    closeEdit,
    closeDelete,
    updateEditingSubject,
    saveEdit,
    confirmDelete,

    addingSubject,
    handleAdd,
    closeAdd,
    updateAddingSubject,
    saveAdd,
  } = useSubjectListing()

  const renderViewDetails = (subject: Subject) => (
    <VStack align="start" gap={4}>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Subject Name</Text>
        <Text fontSize="md">{subject.name}</Text>
      </Box>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Code</Text>
        <Text fontSize="md">{subject.code}</Text>
      </Box>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Description</Text>
        <Text fontSize="md">{subject.description}</Text>
      </Box>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Credits</Text>
        <Text fontSize="md">{subject.credits}</Text>
      </Box>
      <Box>
        <Text fontWeight="bold" color="gray.600" fontSize="sm">Department</Text>
        <Text fontSize="md">{subject.department}</Text>
      </Box>
    </VStack>
  )

  const renderEditFields = (subject: Subject) => (
    <>
      <FieldRoot>
        <FieldLabel>Name</FieldLabel>
        <Input
          value={subject.name}
          onChange={(e) => updateEditingSubject({ name: e.target.value })}
        />
      </FieldRoot>
      <FieldRoot>
        <FieldLabel>Code</FieldLabel>
        <Input
          value={subject.code}
          onChange={(e) => updateEditingSubject({ code: e.target.value })}
        />
      </FieldRoot>
      <FieldRoot>
        <FieldLabel>Department</FieldLabel>
        <Input
          value={subject.department}
          onChange={(e) => updateEditingSubject({ department: e.target.value })}
        />
      </FieldRoot>
      <FieldRoot>
        <FieldLabel>Credits</FieldLabel>
        <Input
          type="number"
          value={subject.credits}
          onChange={(e) => updateEditingSubject({ credits: parseInt(e.target.value) || 0 })}
        />
      </FieldRoot>
    </>
  )

  const renderAddFields = (subject: Partial<Subject>) => (
    <>
      <FieldRoot>
        <FieldLabel>Subject Name</FieldLabel>
        <Input
          value={subject.name || ""}
          onChange={(e) => updateAddingSubject({ name: e.target.value })}
          placeholder="Enter subject name"
        />
      </FieldRoot>
      <FieldRoot>
        <FieldLabel>Code</FieldLabel>
        <Input
          value={subject.code || ""}
          onChange={(e) => updateAddingSubject({ code: e.target.value })}
          placeholder="Enter subject code"
        />
      </FieldRoot>
         <FieldRoot>
        <FieldLabel>Description</FieldLabel>
        <Input
          value={subject.description || ""}
          onChange={(e) => updateAddingSubject({ description: e.target.value })}
          placeholder="Enter description"
        />
      </FieldRoot>
           <FieldRoot>
        <FieldLabel>Credits</FieldLabel>
        <Input
          type="number"
          value={subject.credits || ""}
          onChange={(e) => updateAddingSubject({ credits: parseInt(e.target.value) || 0 })}
          placeholder="Enter credits"
        />
      </FieldRoot>
      <FieldRoot>
        <FieldLabel>Department</FieldLabel>
        <Input
          value={subject.department || ""}
          onChange={(e) => updateAddingSubject({ department: e.target.value })}
          placeholder="Enter department"
        />
      </FieldRoot>
    </>
  )

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

export default SubjectListingPage
