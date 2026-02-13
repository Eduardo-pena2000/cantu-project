export function paginationDto({ last_page, total_records, current_page, has_more_pages }) {
  return {
    lastPage: last_page,
    totalRecords: total_records,
    currentPage: current_page,
    hasMorePages: has_more_pages,
  };
}
