import { io } from 'socket.io-client';


class useApi {
    constructor(url){
        console.log("Constructor");
        this.socket = io(url);
    };

    socket(){
        return this.socket;
    }

    sendMessage(type, message){
        console.log("Send Message: type: ", type, " Message: ", message);
        this.socket.emit(type, message);
    }

    //PLAYER SEND METHODS
    joinRoom(name, code){
        this.sendMessage('join_room', {code: code, name: name});
    }

    hostStartGame(){
        this.sendMessage('host_start_game');
    }

    sendResponse(response){
        this.sendMessage('player_prompt_response', response);
    }

    //DISPLAY METHODS
    createRoom(){
        this.sendMessage('create_room');
    }


}

export default useApi