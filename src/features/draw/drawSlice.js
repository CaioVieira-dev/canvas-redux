const initialState = {
    canvas: {x:0,y:0},
    items:[
        {x:30,y:10,width:50,height:50,color: 'red'},
        {x:50,y:30,width:50,height:50,color: 'blue'},
    ],
    xDragging:null,
    yDragging:null,
}

export default function drawReducer(state= initialState,action){
    switch(action.type) {
        case 'draw/translate-canvas-start':return{
           canvas:state.canvas,
           items:state.items,
           xDragging:action.payload.xDragging,
           yDragging:action.payload.yDragging,
        };
        case 'draw/translate-canvas':return{
            canvas:{
                x:state.canvas.x+action.payload.xDragging - state.xDragging,
                y:state.canvas.y+action.payload.yDragging - state.yDragging,
            },
            items:state.items,
            xDragging:action.payload.xDragging,
            yDragging:action.payload.yDragging,
        };
        case 'draw/translate-canvas-end':return{
            canvas:state.canvas,
            items:state.items,
            xDragging:null,
            yDragging:null,
        }
        default:
            return state
    }
}
export const selectDraw = state => state.draw