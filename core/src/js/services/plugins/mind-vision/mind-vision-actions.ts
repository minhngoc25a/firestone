export enum Action {
    STARTUP,
    INIT,
    INIT_COMPLETE,
    LISTENING_COMPLETE,
    GAME_START,
    RESET,
    RESET_COMPLETE,
    TEAR_DOWN_COMPLETE,
    GLOBAL_EVENT,
    GAME_LEFT,
}

export enum CurrentState {
    IDLE,
    INIT,
    LISTENING,
    ACTIVE,
    RESET,
    TEAR_DOWN,
    // READY,
    // TEARING_DOWN,
    // ERROR,
}
