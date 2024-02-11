import HitTrigger from "./HitTrigger";
import GameModel, {StateFasion, StateHunter, Transitions} from "../GameModel";
import {CURSOR} from "../ui/Cursor";

export default class GoWorkTrigger extends HitTrigger{

    protected click() {
       if(GameModel.stateFashion==StateFasion.READ_MAIL_DONE){
           GameModel.setTransition(Transitions.TEXT_INFO,"readMailDone")
           return;
       }
        if(GameModel.stateFashion==StateFasion.MAKE_TRIANGLE_DONE){
            GameModel.setTransition(Transitions.TEXT_INFO,"triangleDone")
            return;
        }
        let obj = GameModel.renderer.modelByLabel["labtop"]
        let world = obj.getWorldPos()
        world.z+=1.0;
        world.x+=0.1;
        GameModel.gameUI.cursor.hide()
        GameModel.characterHandler.walkTo(world,Math.PI+0.1,this.onCompleteWalk)
    }
    onCompleteWalk(){

        if(GameModel.stateFashion==StateFasion.READ_MAIL){
            GameModel.setTransition(Transitions.MAKE_TRIANGLE)
        }else{
            GameModel.setTransition(Transitions.READ_MAIL)
        }

       /* GameModel.setGameState(GameState.READ_MAIL)
        GameModel.textHandler.showHitTrigger("yougotmail")*/
       // GameModel.characterHandler.startTyping()

        // GameModel.setScene(Scenes.OUTSIDE)
        //let door = GameModel.renderer.modelByLabel["door"]
        //GameModel.characterPos = door.getWorldPos()
    }
    public over() {
        GameModel.outlinePass.setModel( GameModel.renderer.modelByLabel["labtop"]);
        GameModel.gameUI.cursor.show(CURSOR.LOOK)

    }

    public out() {
        GameModel.outlinePass.setModel( null);
        GameModel.gameUI.cursor.hide()

    }
}
