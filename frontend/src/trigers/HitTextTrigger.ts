import HitTrigger from "./HitTrigger";
import GameModel, {Scenes} from "../GameModel";
import UI from "../lib/UI/UI";

export default class HitTextTrigger extends HitTrigger{
    private infoTextLabel: string;

    constructor(scene:Scenes,objectLabel:string) {
        super(scene,objectLabel);


    }
    public over() {



    }

    public out() {

        GameModel.textHandler.hideHitTrigger(this.objectLabels[0])
    }
    public  click(){

        GameModel.sound.playWoosh(0.1)
        GameModel.sound.playClick()
        GameModel.textHandler.showHitTrigger(this.objectLabels[0])
    }

}