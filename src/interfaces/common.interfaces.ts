export interface DetailsInterface {
  id: string;
}

export interface ListAllInterface {
  page: number;
  limit?: number;
  sortBy?: string;
  sort?: string;
  search?: string;
}