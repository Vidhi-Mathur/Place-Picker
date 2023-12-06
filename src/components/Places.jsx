export default function Places(props){
    return (
        <>
        <section className="places-category">
        <h2>{props.title}</h2>
        {props.places.length === 0 && (<p className="fallback-text">{props.fallbackText}</p>)}
        {props.places.length > 0 && (
            <ul className="places">
                {props.places.map(place => (
                    <li key={place.id} className="place-item">
                        <button onClick={() => props.onSelectPlace(place.id)}>
                        <img src={place.image.src} alt="place-image" />
                        <h3>{place.title}</h3>
                        </button>
                    </li>
                ))}
            </ul>
        )}
        </section>
        </>
    )
}