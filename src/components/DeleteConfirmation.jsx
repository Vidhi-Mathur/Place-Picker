import { useEffect } from "react"
import ProgressBar from "./ProgressBar"

export default function DeleteConfirmation(props){
    /*Add a feature to this app where this modal closes automatically after three seconds, deleting the place. So, we execute onConfirm() inside setTimeOut after 3 sec.
    One problem is this deleteConfirmation component is always rendered, wrapped by the modal component. It is  always rendered, it's just not always visible in the DOM because internally the modal component controls the dialogue's visibilitythrough open prop. But technically deleteConfirmation component is always part of the DOM,
and therefore this timer will actually be set and started when the app component renders for the first time
because during that render cycle, deleteConfirmation is also rendered. One option is to output children in modal component only if modal is open
It would work, but now as timer isn't stopped, even on clicking no, place would be deleted. This problem can be solved using useEffect, with a cleanup function, which will be executed by React right before this effect function runs again or, before this component dismounts. So, before it's removed from the DOM.
Problem with dependencies is that wheneever a component is reexecuted/ rerendered, its values/ object sor functions are recreated, despite having the same code. So, it means onCancel() would be two different functions in two different render cycles, so can create infinite loop in state updaing functions. Here, won't face it as state updating functions lead to removal of deleteConfirmation from DOM. A much safer way rather than removing the element is to useCallback() hook*/
/* useCallback() returns that function which you wrapped, but now such that it's not recreated whenever this surrounding component function is executed again. So inner-function is not recreated. Instead, it stores it internally in memory and reuses that stored function whenever the component function executes again. So now this is not recreated.Better to useCallback() when passing functions as dependencies to useEffect. */

    useEffect(() => {
        const timer = setTimeout(() => {
            props.onCancel()
        }, 3000)
        return () => { 
            clearTimeout(timer)
        }
    }, [props.onCancel])
    
    return(
        <>
        <div id="delete-confirmation">
            <h2>Are you sure</h2>
            <p>Do you really want to remove this place?</p>
            <div id="confirmation-actions">
                <button className="button" onClick={props.onConfirm}>Yes</button>
                <button className="button-text" onClick={props.onCancel}>No</button>
            </div>
            <ProgressBar time={3000} />
        </div>
        </>
    )
}