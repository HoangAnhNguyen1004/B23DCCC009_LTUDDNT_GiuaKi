import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBooks } from '../context/BookContext';
import { CATEGORIES } from '../data/books';
import {
    Button,
    CategoryPicker,
    Field,
    Screen,
} from '../components/UI';
import { styles } from '../theme/theme';
import type { Category, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'BookForm'>;

interface FormValues {
    title: string;
    author: string;
    category: Category;
    year: string;
    quantity: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

export default function BookFormScreen({ navigation, route }: Props) {
    const { books, saveBook, busy } = useBooks();
    const insets = useSafeAreaInsets();
    const id = route.params?.id;
    const oldBook = books.find(book => book.id === id);

    const [form, setForm] = useState<FormValues>({
        title: oldBook?.title ?? '',
        author: oldBook?.author ?? '',
        category: oldBook?.category ?? 'Giáo trình',
        year: String(oldBook?.year ?? new Date().getFullYear()),
        quantity: String(oldBook?.quantity ?? 1),
    });

    const [errors, setErrors] = useState<FormErrors>({});

    function update<K extends keyof FormValues>(
        field: K,
        value: FormValues[K],
    ): void {
        setForm(current => ({ ...current, [field]: value }));
        setErrors(current => ({ ...current, [field]: undefined }));
    }

    function validate(): boolean {
        const next: FormErrors = {};
        const yearText = form.year.trim();
        const quantityText = form.quantity.trim();
        const year = Number(yearText);
        const quantity = Number(quantityText);
        const currentYear = new Date().getFullYear();
        const borrowed = oldBook?.borrowed ?? 0;

        if (!form.title.trim()) {
            next.title = 'Vui lòng nhập tên sách.';
        }

        if (!form.author.trim()) {
            next.author = 'Vui lòng nhập tác giả.';
        }

        if (
            !/^\d+$/.test(yearText) ||
            !Number.isInteger(year) ||
            year < 1900 ||
            year > currentYear
        ) {
            next.year = `Năm phải là số nguyên từ 1900 đến ${currentYear}.`;
        }

        if (
            !/^\d+$/.test(quantityText) ||
            !Number.isSafeInteger(quantity) ||
            quantity <= 0
        ) {
            next.quantity = 'Số lượng phải là số nguyên lớn hơn 0.';
        } else if (quantity < borrowed) {
            next.quantity =
                `Số lượng không được nhỏ hơn ${borrowed} cuốn đang mượn.`;
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function handleSave(): Promise<void> {
        if (!validate()) {
            return;
        }

        const success = await saveBook(
            {
                title: form.title,
                author: form.author,
                category: form.category,
                year: Number(form.year),
                quantity: Number(form.quantity),
            },
            id,
        );

        if (success) {
            navigation.goBack();
        }
    }

    if (id && !oldBook) {
        return (
            <Screen>
                <Text style={styles.empty}>Sách không còn tồn tại.</Text>
            </Screen>
        );
    }

    return (
        <Screen>
            <KeyboardAvoidingView
                style={styles.screen}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={
                    Platform.OS === 'ios' ? insets.top + 44 : 0
                }>
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled">
                    <Text style={styles.title}>
                        {id ? 'Cập nhật thông tin sách' : 'Thông tin sách mới'}
                    </Text>

                    <Field
                        label="Tên sách"
                        placeholder="Nhập tên sách"
                        value={form.title}
                        onChangeText={value => update('title', value)}
                        error={errors.title}
                        editable={!busy}
                    />

                    <Field
                        label="Tác giả"
                        placeholder="Nhập tên tác giả"
                        value={form.author}
                        onChangeText={value => update('author', value)}
                        error={errors.author}
                        editable={!busy}
                    />

                    <View>
                        <Text style={styles.label}>Thể loại</Text>
                        <CategoryPicker<Category>
                            items={CATEGORIES}
                            selected={form.category}
                            onSelect={value => update('category', value)}
                            disabled={busy}
                        />
                    </View>

                    <Field
                        label="Năm xuất bản"
                        placeholder="Ví dụ: 2024"
                        keyboardType="numeric"
                        value={form.year}
                        onChangeText={value => update('year', value)}
                        error={errors.year}
                        editable={!busy}
                    />

                    <Field
                        label="Tổng số cuốn"
                        placeholder="Nhập số lượng"
                        keyboardType="numeric"
                        value={form.quantity}
                        onChangeText={value => update('quantity', value)}
                        error={errors.quantity}
                        editable={!busy}
                    />

                    {oldBook && (
                        <Text style={styles.muted}>
                            Hiện đang được mượn: {oldBook.borrowed} cuốn
                        </Text>
                    )}

                    <Button
                        title={busy ? 'Đang lưu...' : 'Lưu sách'}
                        disabled={busy}
                        onPress={() => {
                            void handleSave();
                        }}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </Screen>
    );
}