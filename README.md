# bot-or-not

```mermaid
sequenceDiagram
    participant Display
    participant Server
    participant Player
    
    Display ->> Server: Initialize connection
    Display ->> Server: Create room
    Note over Server: Creates code
    Server ->> Display: Display code
    loop Every Player
        Player ->> Server: Initialize connection
        Player ->> Server: Join room
        Server ->> Player: Join room validation
        Server ->> Display: Display player join
    end
    Player ->> Server: (Host only) Host start game
    Server ->> Display: Game started
    Server ->> Player: Game started
    loop Every Round
        Note over Server : Create Prompt
        Server ->> Display: Prompt
        Server ->> Player: Prompt
        Note over Server: Start timer
        Server ->> Display: Start timer
        Server ->> Player: Start timer
        Note over Server: Get bot response from ChatGPT
        Player ->> Server: Player prompt response
        Server ->> Display: Display prompt response
        Note over Server: All responses received<br />or timer ended
        Server ->> Display: Display reveal responses
        Server ->> Player: Player reveal responses
        Note over Server: Start timer
        loop Every Vote
            Player ->> Server: Player submit vote
        end
        Note over Server: All votes received<br />or timer ended
        Server ->> Display: Display votes
        Note over Display: Show winners
        Server ->> Player: Player points
    end
    Server ->> Display: Display final scores
    Server ->> Player: Player final score
```

# Message structures

Display code 
``` json
{
    type: "display_code",
    message: {
        code: "1A2B"
    }
}
```

Join room
``` json
{
    type: "join_room",
    message: {
        code: "1A2B",
        name: "Johnny"
    }
}
```

Join room validation
``` json
{
    type: "join_room_validation",
    message: {
        validCode: true,
        validName: true,
        host: true
    }
}
```

Display player join
``` json
{
    type: "display_player_join",
    message: {
        name: "Johnny",
        host: true
    }
}
```

Host start game
``` json
{
    type: "host_start_game"
}
```

Game started
``` json
{
    type: "game_started"
}
```

Prompt
``` json
{
    type: "prompt",
    message: {
        prompt: "Here is a prompt"
    }
}
```

Start timer
``` json
{
    type: "start_timer"
}
```

Player prompt response
``` json
{
    type: "player_prompt_response",
    message: {
        response: "Here is a response"
    }
}
```

Display prompt response
``` json
{
    type: "display_prompt_response",
    message: {
        player: "Johnny",
        response: "Here is a response"
    }
}
```

Display reveal responses
``` json
{
    type: "display_reveal_responses",
    message: {
        bot_response: "Here is a bot response"
    }
}
```

Player reveal responses
``` json
{
    type: "player_reveal_responses",
    message: {
        responses: [
            "Here is a response",
            "Here is a bot response"
        ]
    }
}
```

Player submit vote
``` json
{
    type: "player_submit_vote",
    message: {
        response: "Here is a response"
    }
}
```

Display votes
``` json
{
    type: "display_votes",
    message: {
        responses : [
            {
                response: "Here is a response",
                votes: 2
            }
        ]
    }
}
```

Player points
``` json
{
    type: "player_points",
    message: {
        points: 200
    }
}
```

Display final scores
``` json
{
    type: "display_final_scores",
    message: {
        players: [
            {
                player: "Johnny",
                points: 200
            }
        ]
    }
}
```

Player final score
``` json
{
    type: "player_final_score",
    message: {
        points: 200
    }
}
```
