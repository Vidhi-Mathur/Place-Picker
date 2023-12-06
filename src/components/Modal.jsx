import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function Modal(props){
    const dialog = useRef()

    useEffect(() => {
        if(props.open) dialog.current.showModal()
        else dialog.current.close()
    }, [props.open])
    
    return (
        createPortal(
//But backdrop that makes sure that we can't interact with the rest of the page, is missing. And it's missing because this backdrop is only added by the dialog element if we open it by calling the dialog's showModal method.
            <dialog className="modal" ref={dialog} onClose={props.close} >{props.open? props.children: null}</dialog>, document.getElementById('modal')
        )
    )
}

export default Modal