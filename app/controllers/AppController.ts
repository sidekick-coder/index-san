import { app } from 'electron';
export default class AppController {
    public index(){
        return {
            name: app.getName(),
            version: app.getVersion(),
        };
    }

    public bounds(){

    }
}