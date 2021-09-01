const initialState = {
    featureOne:{
        title:'mockup',
        randomStuff:"something"
    },
    feature2:{
        title:'mockup',
        randomStuff:"something"
    },
}

export default function placeHolderReducer(state= initialState,action){

    switch(action.type){
        case 'placeholder/test':{
            return {
                ...state,
                featureOne:{
                    ...state.featureOne,
                    title: "tested",
                }
            }
        }

        default:
            //if this reducer doesn't recognize the action type
            //or doesn't care about it, return the state unchanged
            return state;
    }
}