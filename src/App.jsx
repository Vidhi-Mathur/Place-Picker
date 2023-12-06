import { useRef, useState, useEffect, useCallback } from 'react';
import { AVAILABLE_PLACES } from './data.js';
import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import Logo from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js'

/*To let places exist even after reload, we could useEffect() to store ids in loaclStorage so that retrieve them as app starts.Here useEffect() is redundant as here code runs synchronously, finishes instantly, unlike that to get user's location. It's executed line by line and once a line finished execution, it's done as no no callback function or promise or anything like that here. We have the final result, but for 'getCurrentPosition', it was only done once this callback function here was executed by the browser and that happened in the future. So, We can therefore simply get rid of useEffect() here
useEffect(() => {
    const storedID = JSON.parse(localStorage.getItem('selectedPlace')) || []
    const storedPlaces = storedID.map((id) => AVAILABLE_PLACES.find(p => p.id === id))
    setPickedPlace(storedPlaces)
    }, [])
Instead move out of app component so it only renders once*/
const storedID = JSON.parse(localStorage.getItem('selectedPlaces')) || []
const storedPlaces = storedID.map((id) => AVAILABLE_PLACES.find(p => p.id === id))

function App() {
  const selectedPlace = useRef()
  const [openModal, setOpenModal] = useState(false)
  const [pickedPlace, setPickedPlace] = useState(storedPlaces)
  const [availablePlace, setAvailablePlace] = useState([])


/* Side effects are tasks to be executed in app that don't affect the current component render cycle. Object provided by the browser to JS code in the browser. It is a side effect as fecthing user's location isn't directly related to app component, unlike other functions here. Also fecthing will take some time, so will be available only after the first render cycle is finished. 
One option is to use a new state availablePlace, set sortedPlace there and pass this state to Places component. But problem is that it will cause a infinute loop, as it will rerender the component, and getting user's location again, setting the set again.
-> The function inside useEffect is called the "effect."
-> The effect runs after every render by default.
-> If you provide a dependency[] as the second argument, the effect will only run when the values in the dependency[] change between renders. If empty, the effect runs only once after the initial render.
So, in short
If there is no dependency[], the effect runs after every render.
If there is a dependency[], the effect runs after the initial render and whenever the values in the dependency array change.
In terms of execution, it's important to note that the component is not necessarily "done executing" before useEffect runs. The useEffect code can run after the initial render, and it may run again when dependencies change, triggering a re-render.*/  
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const sortedPlace = sortPlacesByDistance(AVAILABLE_PLACES, 
        position.coords.latitude, 
        position.coords.longitude
        )
      setAvailablePlace(sortedPlace)
      }), []}
  )
 
  function removePlaceHandler(id){
  //Open modal, and take id of required one
  setOpenModal(true)
  selectedPlace.current = id
  }

  function cancelDeleteHandler(){
  setOpenModal(false)
  }

  function pickPlaceHandler(id){
    setPickedPlace(prevPickedPlace => {
    //Already exist as selected
    if(prevPickedPlace.some(p => p.id === id)) {
      return prevPickedPlace
    }
    //Other selected from available place
    const place = AVAILABLE_PLACES.find(p => p.id === id) 
    return [place, ...prevPickedPlace]
  })
  //Unrelated, but still required. Can't useEffect() here as not used in nested() /if() 
  const storedID = JSON.parse(localStorage.getItem('selectedPlaces')) || []
  //Not yet selected Place
  if(storedID.indexOf(id) === -1) localStorage.setItem('selectedPlaces', JSON.stringify([id, ...storedID]))
  }

  const confirmDeleteHandler = useCallback(function confirmDeleteHandler() {
    setPickedPlace((prevPickedPlace) =>
      prevPickedPlace.filter((p) => p.id !== selectedPlace.current)
    );
    setOpenModal(false)
    const storedID = JSON.parse(localStorage.getItem('selectedPlaces')) || []
    localStorage.setItem('selectedPlaces', JSON.stringify(storedID.filter(id => id !== selectedPlace.current)))
  }, [])

  return (
    <>
    <Modal open={openModal} close={cancelDeleteHandler}>
        <DeleteConfirmation onConfirm={confirmDeleteHandler} onCancel={cancelDeleteHandler}/>
    </Modal>
    <header>
      <img src={Logo} alt="globe" />
      <h1>PLACEPICKER</h1>
      <p>Create your personal collection of places you would like to visit or you have visited.</p>
    </header>
    <main>
      <Places 
      title="I'd like to visit..." 
      fallbackText="Select the places you want to visit below"
      places={pickedPlace}
      onSelectPlace={removePlaceHandler}
      />
      <Places 
      title="Available Places" 
      fallbackText="Sorting places by distance..."
      places={availablePlace}
      onSelectPlace={pickPlaceHandler}
      />
    </main>
    </>
  );
}

export default App;
