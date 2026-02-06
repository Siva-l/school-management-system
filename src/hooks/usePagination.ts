import { useMemo } from "react";

const range = (start: number, end: number) => {
    const length = end - start + 1;
    const pagesNumbers = Array.from({ length }, (_, index) => index + start);
    return pagesNumbers;
};

export const DOTS = "...";

export function usePagination({
    totalPageCount, 
    constantButtons, 
    siblingCount, 
    currentPage, 
}: {
    totalPageCount: number
    constantButtons: number
    siblingCount: number
    currentPage: number
}) {
    const paginationRange = useMemo(() => {

        const totalPageNumbers = constantButtons + 2 + siblingCount; // how  many numbers should show without DOTS
        if (totalPageNumbers >= totalPageCount) {
            const _range = range(1, totalPageCount);
            return _range;
        }

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);

        const rightSiblingIndex = Math.min(
            currentPage + siblingCount,
            totalPageCount
        );

        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex <= totalPageCount - 2;
        const firstPageIndex = 1;

        const lastPageIndex = totalPageCount;

        if (!shouldShowLeftDots && shouldShowRightDots) {
            const leftItemCount = 3 + 2 * siblingCount;
            const leftRange = range(1, leftItemCount);
            const pageNumbers = [...leftRange, DOTS, totalPageCount];
            return pageNumbers;
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            const rightItemCount = 3 + 2 * siblingCount;
            const rightRange = range(
                totalPageCount - rightItemCount + 1,
                totalPageCount
            );

            return [firstPageIndex, DOTS, ...rightRange];
        }

        if (shouldShowLeftDots && shouldShowRightDots) {
            const middleRange = range(leftSiblingIndex, rightSiblingIndex);
            return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
        }
    }, [totalPageCount, siblingCount, currentPage, constantButtons]);


    return paginationRange;
}
