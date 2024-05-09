import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

function Loading() {
    return (
        <div className="loading">
            <div className="loading-spinner">
                <FontAwesomeIcon icon={faSpinner} spin />
            </div>
        </div>
    )
}

export default Loading
