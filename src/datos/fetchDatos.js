
export const fetchDatos = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};
