import EventEmitter from 'events';
export declare const convertObjToArrayEvents: (events: { [key in string]: string; }) => string[];
export declare const chatCommandParser: (listener: EventEmitter) => void;
