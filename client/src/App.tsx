import { useState } from "react";

enum AppState {
    Home,
    Display,
    Player
}

export default function App() {
    const [state, setState] = useState(AppState.Home)

    return (
        <>
            {state === AppState.Home && <h1>Home</h1>}
            {state === AppState.Display && <h1>Display</h1>}
            {state === AppState.Player && <h1>Player</h1>}
        </>
    )

}