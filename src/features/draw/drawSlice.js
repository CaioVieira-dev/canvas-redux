const initialState = {
    rectangles:[
        {
            x:10,
            y:10,
            width:50,
            height:50,
            color:'red'
        }
    ]
}

export default function drawReducer(state= initialState,action){
    switch(action.type) {
        case 'draw/translate':return{
            rectangles: state.rectangles.map(function(rect){
                return{
                    x:rect.x+action.payload.x,
                    y:rect.y+action.payload.y,
                    width: rect.width,
                    height: rect.height,
                    color:rect.color
                }
            })
        }
        default:
            return state
    }
}
export const selectDraw = state => state.draw