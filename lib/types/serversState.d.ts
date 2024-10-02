import { TServersState } from './types';
export declare const serversState: TServersState;
export declare const getServersState: (id: number) => {
    id: number;
    rcon: import("./types").TRcon;
    logs: import("./types").TLogs;
    logger: import("./types").TLogger;
    execute: import("./types").TExecute;
    coreListener: import("events");
    listener: import("events");
    maps: import("./types").TMaps;
    plugins: import("./types").TPlugin[];
    votingActive?: boolean;
    skipmap?: boolean;
    admins?: import("./types").TAdmin;
    players?: import("./types").TPlayer[];
    squads?: import("./types").TSquad[];
    currentMap?: {
        level: string | null;
        layer: string | null;
    };
    nextMap?: {
        level: string | null;
        layer: string | null;
    };
    tickRate?: number;
};
