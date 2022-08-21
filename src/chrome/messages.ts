export const enum MessageType {
    HIDE_ELEMENTS = "HIDE_ELEMENTS",
    SETTINGS_UPDATE = "SETTINGS_UPDATE"
}

export const MessageTypeParser = (message: number) => {

}

export interface Message {
    type: MessageType,
    className?: string
}

