import React from 'react';
import type { ReactNode } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Book } from '../types';
import { colors, styles } from '../theme/theme';

export function Screen({ children }: { children: ReactNode }) {
    return (
        <SafeAreaView
            edges={['left', 'right', 'bottom']}
            style={styles.screen}>
            {children}
        </SafeAreaView>
    );
}

interface ButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
}

export function Button({
    title,
    onPress,
    disabled = false,
}: ButtonProps) {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled }}
            disabled={disabled}
            onPress={onPress}
            style={({ pressed }) => [
                styles.button,
                disabled && styles.disabled,
                pressed && styles.pressed,
            ]}>
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
    );
}

interface FieldProps extends TextInputProps {
    label: string;
    error?: string;
}

export function Field({
    label,
    error,
    style,
    ...props
}: FieldProps) {
    return (
        <View>
            <Text style={styles.label}>{label}</Text>

            <TextInput
                {...props}
                placeholderTextColor={colors.muted}
                style={[
                    styles.input,
                    style,
                    Boolean(error) && styles.invalid,
                ]}
            />

            {Boolean(error) && (
                <Text style={styles.error}>{error}</Text>
            )}
        </View>
    );
}

interface CategoryPickerProps<T extends string> {
    items: readonly T[];
    selected: T;
    onSelect: (item: T) => void;
    disabled?: boolean;
}

export function CategoryPicker<T extends string>({
    items,
    selected,
    onSelect,
    disabled = false,
}: CategoryPickerProps<T>) {
    return (
        <View style={styles.chips}>
            {items.map(item => {
                const active = item === selected;

                return (
                    <Pressable
                        key={item}
                        disabled={disabled}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active, disabled }}
                        onPress={() => onSelect(item)}
                        style={({ pressed }) => [
                            styles.chip,
                            active && styles.chipActive,
                            disabled && styles.pressed,
                            pressed && styles.pressed,
                        ]}>
                        <Text
                            style={[
                                styles.chipText,
                                active && styles.chipTextActive,
                            ]}>
                            {item}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

interface BookCardProps {
    book: Book;
    onPress: () => void;
    onLongPress: () => void;
    disabled?: boolean;
}

export function BookCard({
    book,
    onPress,
    onLongPress,
    disabled = false,
}: BookCardProps) {
    const remaining = book.quantity - book.borrowed;

    return (
        <Pressable
            disabled={disabled}
            onPress={onPress}
            onLongPress={onLongPress}
            delayLongPress={500}
            style={({ pressed }) => [
                styles.card,
                pressed && styles.pressed,
            ]}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.text}>{book.author}</Text>
            <Text style={styles.muted}>{book.category}</Text>

            <Text
                style={remaining === 0 ? styles.soldOut : styles.available}>
                {remaining === 0
                    ? 'Hết sách'
                    : `Còn lại: ${remaining}/${book.quantity} cuốn`}
            </Text>
        </Pressable>
    );
}