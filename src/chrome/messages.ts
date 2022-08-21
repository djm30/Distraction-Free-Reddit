export const enum MessageType {
    HIDE_ELEMENTS = "HIDE_ELEMENTS",
    SETTINGS_UPDATE = "SETTINGS_UPDATE"
}

export interface Message {
    type: MessageType,
    className?: string
}

