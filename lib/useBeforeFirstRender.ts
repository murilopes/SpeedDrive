import { useState, useEffect } from 'react'

export default (fun: any) => {
    const [hasRendered, setHasRendered] = useState(false)

    useEffect(() => setHasRendered(true), [hasRendered])

    if (!hasRendered) {
        fun()
    }
}