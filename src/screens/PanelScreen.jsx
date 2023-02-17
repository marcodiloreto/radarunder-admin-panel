import React, { useEffect } from "react";
import { Outlet, useLoaderData, Form, NavLink,  useNavigation, useSubmit, Link, redirect, useNavigate} from "react-router-dom";
import { getDisciplines } from "../api/api";
import localforage from 'localforage';

export async function loader({request}){
    const user = await localforage.getItem('user')
    if(!user) return redirect("/")
    const url = new URL(request.url);
    const text = url.searchParams.get("text");
    const disciplines = await getDisciplines(text)
    return {disciplines, text, user}
}

function disciplineDrag(event, discipline){
  event.dataTransfer.setData("text/plain", JSON.stringify(discipline));
  console.log(JSON.stringify(discipline))
}

export function PanelScreen() {
    const {disciplines, text, user} = useLoaderData()
    const navigation = useNavigation()
    const navigate = useNavigate()
    const submit = useSubmit()
    

    useEffect(() => {
      document.getElementById("q").value = text;
    }, [text]);

    const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "text"
    );

    return(
        <>
        <div id="sidebar">
          <div className="column">
            <div className="row">

            <Form id="search-form" role="search"
            
            >
              <input
                id="q"
                className={searching ? "loading" : ""}
                aria-label="Search disciplines"
                placeholder="Buscar"
                type="search"
                name="text"
                defaultValue={text}
                onChange={(event) => {
                    const isFirstSearch = text == null;
                    submit(event.currentTarget.form,{
                        replace: !isFirstSearch,
                    })
                }}
              />
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
            <div style={{width:25}}/>
              <Link to="/panel/discipline/create">
              <button type="submit">crear</button>
              </Link>
            </div>
                <nav>
                <NavLink to={"request"} className="isolatedLink">Requests</NavLink>
                 </nav>
            </div>
          <nav>
          {disciplines.length ? (
            <ul>
              {disciplines.map((discipline) => (
                <li key={discipline.id}>
                   <NavLink
                   draggable="true"
                   onDragStart={(ev) => disciplineDrag(ev, discipline)}
                    to={`discipline/${discipline.id}`}
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "active"
                        : isPending
                        ? "pending"
                        : ""
                    }
                  >
                    {discipline.name ? (
                      <>
                        {discipline.name}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>Sin resultados</i>
            </p>
          )}
          </nav>
        </div>
        
        <div className="column">
        <div className="top-bar">
          <div>
            Hola {user.name}!
          </div>
          <div>
            <button style={{ height:30, display:'flex', color:'red', alignItems:'center', marginLeft:30}}
            onClick={() => {navigate("/")}}
            >
              LogOut
            </button>
          </div>
        </div>
        <div id="detail"
           className={
             navigation.state === "loading" ? "loading" : ""
            }
            >
            <Outlet/>
        </div>
        </div>
      </>
    );
    
}