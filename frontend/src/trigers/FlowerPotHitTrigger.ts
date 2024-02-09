import HitTrigger from "./HitTrigger";
import GameModel, {StateGold, StateHighTech, Transitions} from "../GameModel";
import {CURSOR} from "../ui/Cursor";

export default class FlowerPotHitTrigger extends HitTrigger{


protected click() {
if(GameModel.stateHighTech==StateHighTech.START){
    GameModel.setTransition(Transitions.TEXT_INFO,"flowerPreBloom")

    return;
}

}

public over() {
    GameModel.outlinePass.setModel( GameModel.renderer.modelByLabel["pot"]);
    GameModel.gameUI.cursor.show(CURSOR.LOOK)

}

public out() {
    GameModel.outlinePass.setModel( null);
    GameModel.gameUI.cursor.hide()

}


}