import {
  Box,
  Heading,
  IconButton,
  Text,
  Flex,
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
  TableRoot,
  TableHeader,
  TableRow,
  TableColumnHeader,
  TableBody,
  TableCell,
} from "@chakra-ui/react"
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiX } from "react-icons/fi"
import { AppButton } from "./AppButton"
import { useEffect, type ReactNode } from "react"
import PaginationRange from "../../pagination/pagination"
import { NoData } from "./NoData"

export interface Column<T> {
  key: keyof T | "actions"
  label: string
  render?: (item: T) => ReactNode
  sortable?: boolean
}

interface ListingPageProps<T> {
  title: string
  description: string
  addButtonText: string
  columns: Column<T>[]
  data: T[]
  selectedItem?: T | null
  deletingItem: T | null
  addingItem?: Partial<T> | null
  onView: (item: T) => void
  onEdit: (item: T) => void
  onDelete: (item: T) => void
  onAdd?: () => void
  onCloseView: () => void
  onCloseDelete: () => void
  onCloseAdd?: () => void
  onSubmit?: () => void
  onConfirmDelete: () => void
  renderViewDetails: (item: T) => ReactNode
  renderFields?: (item: T | Partial<T>) => ReactNode
  // Pagination props
  totalCount?: number
  currentPage?: number
  totalPages?: number
  pageSize?: number
  onPageChange?: (page?: number) => void

  // Sorting props
  sortBy?: string | null
  sortOrder?: 'asc' | 'desc'
  onSort?: (key: keyof T | "actions") => void

  // Additional Filter Actions
  filterActions?: ReactNode
}

export function ListingPage<T extends { id: number | string }>({
  title,
  description,
  addButtonText,
  columns,
  data,
  selectedItem,
  deletingItem,
  onView,
  onEdit,
  onDelete,
  onAdd,
  onCloseView,
  onCloseDelete,
  onConfirmDelete,
  renderViewDetails,
  totalCount,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  sortBy,
  sortOrder,
  onSort,
  filterActions,
}: ListingPageProps<T>) {

  useEffect(()=>{
  },[currentPage])
  return (
    <Box p={{ base: 4, md: 8 }} minH="100vh">
      <Box maxW="7xl" mx="auto">
        <Flex 
          direction={{ base: "column", sm: "row" }} 
          justify="space-between" 
          align={{ base: "stretch", sm: "center" }} 
          gap={4} 
          mb={6}
        >
          <Box>
            <Heading size={{ base: "md", md: "lg" }}>{title}</Heading>
            <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>{description}</Text>
          </Box>

          <Flex gap={3} align="center">
            {filterActions}
            <AppButton bg={"blue.500"} size={{ base: "sm", md: "md" }} color="white" onClick={onAdd}>
              <FiPlus style={{ marginRight: "8px" }} /> {addButtonText}
            </AppButton>
          </Flex>
        </Flex>

        <Box bg="white" borderRadius="lg" border="1px solid" borderColor="gray.100" overflowX="auto">
          <TableRoot size={{ base: "sm", md: "md" }} interactive whiteSpace="nowrap">
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableColumnHeader 
                    key={col.key as string} 
                    bg="gray.100" 
                    color="gray.700"
                    cursor={col.sortable ? "pointer" : "default"}
                    onClick={() => {
                      if (col.sortable && onSort) {
                        onSort(col.key);
                      }
                    }}
                  >
                    {col.label} {col.sortable && sortBy === col.key ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                  </TableColumnHeader>
                ))}
              </TableRow>
            </TableHeader>

            {data.length > 0 ? (
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id}>
                    {columns.map((col) => {
                      if (col.key === "actions") {
                        return (
                          <TableCell key="actions">
                            <Flex gap={2}>
                              <IconButton
                                aria-label="View"
                                size="sm"
                                variant="ghost"
                                _hover={{ bg: "blue.50" }}
                                color="blue.600"
                                onClick={() => onView(item)}
                              >
                                <FiEye />
                              </IconButton>

                              <IconButton
                                aria-label="Edit"
                                size="sm"
                                _hover={{ bg: "green.50" }}
                                variant="ghost"
                                color="green.600"
                                onClick={() => onEdit(item)}
                              >
                                <FiEdit2 />
                              </IconButton>

                              <IconButton
                                aria-label="Delete"
                                size="sm"
                                _hover={{ bg: "red.50" }}
                                variant="ghost"
                                color="red.600"
                                onClick={() => onDelete(item)}
                              >
                                <FiTrash2 />
                              </IconButton>
                            </Flex>
                          </TableCell>
                        )
                      }
                      if (col.render) {
                        return (
                          <TableCell key={col.key as string} fontSize="sm" color="gray.600">
                            {col.render(item)}
                          </TableCell>
                        )
                      }
                      return (
                        <TableCell key={col.key as string} fontSize="sm" color="gray.600">
                          {(item[col.key as keyof T] as any)?.toString()}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))}
              </TableBody>
            ):(
              <TableBody>
                <TableRow>
                  <TableCell colSpan={columns.length} p={0}>
                    <NoData message={`No ${title.toLowerCase()} found`} />
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </TableRoot>
        </Box>
        
        {/* Pagination */}
        {totalCount !== undefined && onPageChange && (
          <Box mt={4}>
            <PaginationRange
              totalCount={totalCount}
              currentPage={currentPage}
              totalPage={totalPages}
              dataPerPage={pageSize}
              onPageChange={onPageChange}
            />
          </Box>
        )}
      </Box>

      <DialogRoot open={!!selectedItem} onOpenChange={(e) => !e.open && onCloseView()}>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogCloseTrigger asChild position="absolute" top="2" right="2">
              <IconButton variant="ghost" size="sm" aria-label="Close">
                <FiX />
              </IconButton>
            </DialogCloseTrigger>
            <DialogHeader>
              <DialogTitle>{title} Details</DialogTitle>
            </DialogHeader>
            <DialogBody>
              {selectedItem && renderViewDetails(selectedItem)}
            </DialogBody>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>



      <DialogRoot open={!!deletingItem} onOpenChange={(e) => !e.open && onCloseDelete()}>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent maxW="sm" borderRadius="xl">
            <DialogHeader>
              <DialogTitle fontSize="xl" fontWeight="bold">Confirm Delete</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Text color="gray.600" fontSize="sm">
                Are you sure you want to delete this {title.toLowerCase().slice(0, -1)}? This action cannot be undone.
              </Text>
            </DialogBody>
            <DialogFooter gap={3}>
              <AppButton
                bg="red.600"
                color="white"
                flex="1"
                _hover={{ bg: "red.700" }}
                onClick={onConfirmDelete}
              >
                Delete
              </AppButton>
              <DialogActionTrigger asChild>
                <AppButton variant="subtle" colorPalette="gray" flex="1">
                  Cancel
                </AppButton>
              </DialogActionTrigger>
            </DialogFooter>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>

    </Box>
  )
}
