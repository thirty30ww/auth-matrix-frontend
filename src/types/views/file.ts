export interface Props {
    modelValue: boolean;
    imageFile?: File;
}

export interface Emits {
    (e: 'update:modelValue', value: boolean): void;
    (e: 'confirm', croppedFile: File): void;
}