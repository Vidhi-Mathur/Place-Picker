import { useEffect, useState } from "react"

export default function ProgressBar(props){
const [remainingTime, setRemainingTime] = useState(props.time)
//useEffect() to avoid infinite loop
useEffect(() => {
    const interval = setInterval(() => {
        setRemainingTime(prevTime => prevTime - 10)
    }, 10)
    return () =>  { clearInterval(interval) }
}, [])
return <progress value={remainingTime} max={props.time}/>
}