import React, {useState, useEffect }from "react"

interface Items {
    id: number;
    category: String;
    name: String;
    price: number;
    stock: number;
    date?: String;
}

const Catalogue: React.FC = () => {
    const [items, setItems] = useState<Items[]>([]);

    useEffect(() => {
        const obtenerCatalogo = async () => {
            try {
                const response = await fetch("http://localhost:9090/catalogo/leer");
                if(!response.ok){
                    throw new Error(`No se pudo recuperar el catalogo TTATT: ${response.status}`);
                }
                console.table(response);
                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error("No se pudieron obtener los datos");
                return [];
            }
        };

        obtenerCatalogo();
    },[]);

    return(
        <>
        <div>
            <h1>Catalogo</h1>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        <strong>{item.name}</strong>
                    </li>
                ))}
            </ul>
        </div>
        </>
    );
};

export default Catalogue;