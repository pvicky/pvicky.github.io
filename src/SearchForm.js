import {useState} from 'react'
import { useNavigate } from 'react-router-dom';


function SearchForm(props){

    const [formText, setFormText] = useState('');
    const navigate = useNavigate();

    function handleSearch(ev){
        ev.preventDefault();
        console.log(formText);

        navigate(`/search/${ formText }`);
    };


    return (<>
            <div className="searchForm">
                <form id="movieSearch" onSubmit={handleSearch}>
                    <input type="text" placeholder="Search for player or club" onChange={(ev) => setFormText(ev.target.value)} />
                    <button>Submit</button>
                </form>
            </div>
            </>
    );
}

export default SearchForm;
