interface IPaginationResponse {
  pageable: IPaginationResponsePagable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: IPaginationResponseSort;
  numberOfElements: number;
  empty: boolean;
}

export interface IPaginationResponseSort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface IPaginationResponsePagable {
  sort: IPaginationResponseSort;
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

export interface IPaginationRequest {
  pageNumber: number;
  recordsPerPage: number;
  [key: string]: any;
}
