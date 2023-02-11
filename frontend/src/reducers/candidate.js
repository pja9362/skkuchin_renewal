import {
    LOAD_CANDIDATE_SUCCESS,
    LOAD_CANDIDATE_FAIL
} from '../actions/candidate/types';

const initialState = {
    candidate: null
};

const candidateReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch(type) {
        case LOAD_CANDIDATE_SUCCESS:
            return {
                ...state,
                candidate: payload.candidate
            }
        case LOAD_CANDIDATE_FAIL:
            return {
                ...state,
                candidate: null
            }
        default:
            return state;
    };
};

export default candidateReducer;