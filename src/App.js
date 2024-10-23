import logo from './logo.svg';
import './App.css';
import RutaPrincipal from './rutas/RutaPrincipal';
import Provider from './contexto/Provider';

function App() {
    return (
        <>  
        <Provider>
            <RutaPrincipal/>
        </Provider>
        </>
    );
}

export default App;
