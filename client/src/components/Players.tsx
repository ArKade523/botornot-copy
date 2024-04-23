import { Player } from '../types/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown } from '@fortawesome/free-solid-svg-icons'

function Players({ players }: { players: Player[] | undefined }) {
    return (
        <>
            {players?.map((player) => {
                return (
                    <div key={player.id} className="person">
                        {player.host && <FontAwesomeIcon icon={faCrown} />}
                        <p className="">{player.name} </p>
                    </div>
                )
            })}
        </>
    )
}
export default Players
