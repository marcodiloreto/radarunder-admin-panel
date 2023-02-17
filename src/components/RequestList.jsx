import React, {useEffect} from "react"
import { useLoaderData, Form,useNavigation , useSubmit, useNavigate, Link} from "react-router-dom"
import { getRequestList } from "../api/api"
import { parseDateString, parseTimeString } from "../helpers/timeParser"

export const RequestListLoader = async({params, request}) => {
    const url = new URL(request.url);
    const term = url.searchParams.get("term");
    const page = url.searchParams.get("page");
    const list = await getRequestList(params.status, page ? page : 1, term)
    const parsedList = list.map((el) => {
        el.updatedAt = new Date(el.updatedAt)
        return el
    })

    return {
        list: parsedList,
        term,
        urlPage : page
    }

}

function RequestList(){
    const {list, term, urlPage } = useLoaderData()
    const navigation = useNavigation()
    const navigate = useNavigate()
    const submit = useSubmit()
    const page = urlPage ? urlPage : 1
    useEffect(() => {
        document.getElementById("q").value = term;
      }, [term]);

    const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "text"
    );

    return(
        <>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>        
         <Form id="search-form" role="search"
            >
              <input
                id="q"
                className={searching ? "loading" : ""}
                aria-label="Search disciplines"
                placeholder="Buscar"
                type="search"
                name="term"
                defaultValue={term}
                onChange={(event) => {
                    const isFirstSearch = term == null;
                    submit(event.currentTarget.form,{
                        replace: !isFirstSearch,
                    })
                }}
              />
              <input type="hidden" name="page" value={'1'}/>
              <div
                id="search-spinner"
                aria-hidden
                hidden={!searching}
                />
              <div
                className="sr-only"
                aria-live="polite"
                ></div>
            </Form>

            <Form className="pagination">
                <input id="input-for-page" type="hidden" name="page" value={page}/>
                <input type="hidden" name="term" value={term ? term : ''}/>
                <button className="prev"
                disabled={ page == 1 ? true : false}
                onClick={(ev) => {
                    document.getElementById("input-for-page").setAttribute('value', Number(page)-1 )
                }}
                >&laquo; Prev</button>
                <p className="page">{page}</p>
                <button 
                disabled={list.length < 1 ? true : false}
                 onClick={(ev) => {
                    var input = document.getElementById("input-for-page");
                     input.value = Number(page)+1 
                  
                }}
                className="next">Next &raquo;</button>
            </Form>
        </div>
        <div className="table">
        <div className="header table-row">
            <div className="col1">Categoría</div>
            <div className="col2">Descripción</div>
            <div className="col3">última interacción</div>
        </div>
        {
            list.length < 1 ? (
                <div style={{textAlign:'center', padding:20}}> sin resultados</div>
                ):
                (
                    list.map((request,index )=> {
                        const time = parseTimeString(request.updatedAt) + " - " + parseDateString(request.updatedAt)
                        return(
                <div to={request.id }key={index+request.disciplineName} className="table-row hover"
                onClick={() => {
                    navigate('/panel/request/id/'+request.id)
                }}
                >
                    <div className="col1">{request.disciplineName}</div>
                    <div className="col2">{request.description}</div>
                    <div className="col3">{time}</div>
                </div>
                )
            })
            )
        }
        
      
    </div>
        </>
    )

}


export default RequestList



