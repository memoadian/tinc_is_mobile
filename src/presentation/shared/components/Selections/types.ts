export type ItemMultipleSelectionProps = {
    title: string;
    checked: boolean;
    value: any;
    onPressed: (value: any, checked: boolean) => void;
}

export type PresentantionModalProps = {
    onOutsidePressed: () => void;
    isVisible: boolean;
    children?: JSX.Element | JSX.Element[]
}

export type MutipleSelectionModalProps = {
    data: ItemRowSelection[];
    showing: boolean;
    onContinue?: (elements: any[]) => void;
    onOutside?: () => void;
    onCancel?: () => void;
}

export type SingleSelectionModalProps = {
    data: ItemRowSelection[];
    showing: boolean;
    onOutside?: () => void;
    onItemPressed?: (value, checked) => void;
}

export interface ItemRowSelection {
    id: number | string;
    name: string;
    checked: boolean;
}

export interface ItemUnicSelectionProps {
    value: number | string | null;
    title: string;
    checked: boolean;
    onPressed?: (value: any, checked: boolean) => void;
}