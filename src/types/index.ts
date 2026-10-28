export type Category =
    | 'Giáo trình'
    | 'Tiểu thuyết'
    | 'Khoa học'
    | 'Thiếu nhi';

export interface Book {
    id: string;
    title: string;
    author: string;
    category: Category;
    year: number;
    quantity: number;
    borrowed: number;
}

export type BookInput = Omit<Book, 'id' | 'borrowed'>;

export type RootStackParamList = {
    BookList: undefined;
    BookForm: { id: string } | undefined;
    BookDetail: { id: string };
};