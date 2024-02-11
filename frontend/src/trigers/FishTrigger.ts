import HitTrigger from "./HitTrigger";
import GameModel, {StateGrandpa, Transitions} from "../GameModel";
import {CURSOR} from "../ui/Cursor";

export default class FishTrigger extends HitTrigger{

    protected click() {
        if(GameModel.stateGrandpa==StateGrandpa.START || GameModel.stateGrandpa==StateGrandpa.FISH_HUNGRY) {
            GameModel.setTransition(Transitions.TEXT_INFO, "fishHungry")
            GameModel.stateGrandpa =StateGrandpa.FISH_HUNGRY
        }
        else if(GameModel.stateGrandpa==StateGrandpa.TAKE_FISH_FOOD) {
            let obj = GameModel.renderer.modelByLabel["fishHit"]
            let world = obj.getWorldPos()
            world.z-=1.5;
            GameModel.characterHandler.walkTo(world,0,this.onCompleteWalk)
        }else{
            GameModel.setTransition(Transitions.TEXT_INFO, "fishHappy")
        }

        return;
    }
    onCompleteWalk(){
        GameModel.setTransition(Transitions.FEED_FISH)
    }
    public over() {
        GameModel.outlinePass.setModel( GameModel.renderer.modelByLabel["fish1"]);
        GameModel.gameUI.cursor.show(CURSOR.LOOK)

    }

    public out() {
        GameModel.outlinePass.setModel( null);
        GameModel.gameUI.cursor.hide()

    }
}