export const initialState = {
    gym: null,
    events: [],
    isSubscribed: false,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_GYM":
            return {
                ...state,
                gym: action.gym,
            };
        case "SET_EVENTS":
            return {
                ...state,
                events: action.events,
            };
        case "SET_SUBSCRIBED":
            return {
                ...state,
                isSubscribed: action.isSubscribed,
            };
        case "TOGGLE_SUBSCRIBED":
            return {
                ...state,
                isSubscribed: !state.isSubscribed,
            };
        default:
            return state;
    }
};

export default reducer;
