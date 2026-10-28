import type { Book, Category } from '../types';

export const CATEGORIES: Category[] = [
    'Giáo trình',
    'Tiểu thuyết',
    'Khoa học',
    'Thiếu nhi',
];

export const INITIAL_BOOKS: Book[] = [
    {
        id: '1',
        title: 'Giáo trình Lập trình C',
        author: 'Nguyễn Văn An',
        category: 'Giáo trình',
        year: 2020,
        quantity: 5,
        borrowed: 0,
    },
    {
        id: '2',
        title: 'Dế Mèn phiêu lưu ký',
        author: 'Tô Hoài',
        category: 'Thiếu nhi',
        year: 2021,
        quantity: 4,
        borrowed: 0,
    },
    {
        id: '3',
        title: 'Nhà giả kim',
        author: 'Paulo Coelho',
        category: 'Tiểu thuyết',
        year: 2022,
        quantity: 3,
        borrowed: 0,
    },
    {
        id: '4',
        title: 'Lược sử thời gian',
        author: 'Stephen Hawking',
        category: 'Khoa học',
        year: 2020,
        quantity: 2,
        borrowed: 0,
    },
    {
        id: '5',
        title: 'Giáo trình Cơ sở dữ liệu',
        author: 'Trần Minh',
        category: 'Giáo trình',
        year: 2023,
        quantity: 6,
        borrowed: 0,
    },
];