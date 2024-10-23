import React, { useReducer } from 'react'
import Contexto from './Contexto'
import miReducer from './miReducer'
import types from './types'


const Provider = ({children}) => {

    const valorInicial={
        logeado:false
    }

    const logearse=(user)=>{
        const action={
            type:types.login,
            payload: user
        }
        dispatch(action )
    }

    const deslogearse=(user)=>{
        const action={
            type:types.logout,
            payload: null
        }
        dispatch(action )
    }
    
    const [autentificacion, dispatch] = useReducer(miReducer,valorInicial)

    return (
        <Contexto.Provider value={{...autentificacion,logearse,deslogearse}}>
            {children}
        </Contexto.Provider>
    )
}

export default Provider
