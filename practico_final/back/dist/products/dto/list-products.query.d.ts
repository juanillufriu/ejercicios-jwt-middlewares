export declare class ListProductsQueryDto {
    name?: string;
    sortBy?: 'id' | 'name' | 'price' | 'stock';
    order?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}
