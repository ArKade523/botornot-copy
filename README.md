# bot-or-not

```mermaid
sequenceDiagram
    participant Display
    participant Server
    participant Player
    
    Display ->> Server: Initialize connection
    Note over Server: Creates code
    Server ->> Display: Display code
    loop Every Player
        Player ->> Server: Initialize connection
        Player ->> Server: Join code
        Server ->> Player: Join code validation
        Server ->> Display: Display player join
    end
    Player ->> Server: (Host only) Host start game
    Server ->> Display: Display start game
    Server ->> Player: Player start game
    loop Every Round
        Note over Server : Create Prompt
        Server ->> Display: Display prompt
        Server ->> Player: Player prompt
        Note over Server: Start timer
        Server ->> Display: Display start timer
        Server ->> Player: Player start timer
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

Join code
``` json
{
    type: "join_code",
    message: {
        code: "1A2B",
        name: "Johnny"
    }
}
```

Join code validation
``` json
{
    type: "join_code_validation",
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

Display start game
``` json
{
    type: "display_start_game"
}
```

Player start game
``` json
{
    type: "player_start_game"
}
```

Display prompt
``` json
{
    type: "display_prompt",
    message: {
        prompt: "Here is a prompt"
    }
}
```

Player prompt
``` json
{
    type: "player_prompt",
    message: {
        prompt: "Here is a prompt"
    }
}
```

Display start timer
``` json
{
    type: "display_start_timer"
}
```

Player start timer
``` json
{
    type: "player_start_timer"
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
    type: "player_submit vote",
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
