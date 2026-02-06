import React from 'react';
import { Box, Button, Flex, IconButton } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { DOTS, usePagination } from '../hooks/usePagination';

interface IProps {
  totalCount: number;
  dataPerPage?: number;
  totalPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const PaginationRange: React.FC<IProps> = ({
  totalCount,
  dataPerPage = 10,
  totalPage,
  currentPage = 1,
  onPageChange,
}) => {
  const totalPageCount = totalPage || Math.ceil(totalCount / dataPerPage);
  
  const constantButtons = 3; 
  const siblingCount = 1;

  const paginationRange = usePagination({
    totalPageCount,
    constantButtons,
    siblingCount,
    currentPage,
  });

  if (!onPageChange || currentPage === 0 || !paginationRange || paginationRange.length < 2) {
    return null;
  }

  return (
    <Flex w="full" justifyContent="center" alignItems="center" gap={2} py={4}>
      <IconButton
        aria-label="Previous Page"
        variant="ghost"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        color="gray.600"
        _hover={{ bg: "gray.50" }}
      >
        <FiChevronLeft size={20} />
      </IconButton>

      <Flex alignItems="center" gap={1}>
        {paginationRange?.map((pageNumber, index) => {
          if (String(pageNumber) === DOTS) {
            return (
              <Box key={`dots-${index}`} px={2} color="gray.600">
                ...
              </Box>
            );
          }

          const isActive = pageNumber === currentPage;

          return (
            <Button
              key={`page-${pageNumber}`}
              variant={isActive ? "outline" : "ghost"}
              onClick={() => onPageChange(Number(pageNumber))}
              borderColor={isActive ? "gray.200" : "transparent"}
              color={isActive ? "black" : "gray.600"}
              fontWeight={isActive ? "medium" : "normal"}
              minW="40px"
              h="40px"
              borderRadius="md"
              _hover={{ bg: isActive ? "transparent" : "gray.50" }}
            >
              {pageNumber}
            </Button>
          );
        })}
      </Flex>

      <IconButton
        aria-label="Next Page"
        variant="ghost"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPageCount}
        color="gray.600"
        _hover={{ bg: "gray.50" }}
      >
        <FiChevronRight size={20} />
      </IconButton>
    </Flex>
  );
};

export default PaginationRange;
