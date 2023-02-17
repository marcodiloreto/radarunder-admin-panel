import React, {useRef} from "react"
import { useLoaderData, Form, Link, redirect, useSubmit, useFetcher } from "react-router-dom"
import { getDiscipline, deleteDiscipline, uploadImages, deleteImage } from "../api/api"

export async function loader({params}){
    const discipline = await getDiscipline(params.id)
    return discipline
}

export async function deleteAction({params}){
    await deleteDiscipline(params.id)
    alert("eliminado con éxito!")
    return redirect("/panel")
}

export async function uploadImage({request, params}){
    const images = await request.formData()
    images.append("id", params.id)
    await uploadImages(images)
    return null
}
export async function deleteImageAction({request, params}){
    const a = await request.formData()
    const data = Object.fromEntries(a);
    await deleteImage(data.img)
    return redirect('/panel/discipline/'+params.id)
}

function DisciplineScreen(){
    const discipline = useLoaderData()
    const inputRef =  useRef();
    const submit = useSubmit()
    const fetcher = useFetcher()
    
    return(
        <div id="discipline">
        <div className="imagesContainer" style={{display:'flex', alignItems:'center'}}>
            {discipline.images.map( (img,index ) => {
                return (
                    <div className="image-container" >
                    <fetcher.Form action="image/destroy" method="post" style={{position:'absolute',top: 15, right:15}}>
                    <input type="hidden" name="img" value={img.id}/>
                    <button style={{height:25,width:25, padding:0, borderRadius: 15, textAlign:'center'}}
                        type="submit"
                    >X</button>
                    </fetcher.Form>
                    <img key={index} className="img-reponsive image" src={img.url} alt=""/>
                   
                    </div>
                )
            })}
            
            <button style={{borderRadius:20, height:100, width:100, padding:0, marginLeft:20}}
            onClick={() => {inputRef.current.click()}}
            >
            
            <img style={{borderRadius:20, height:100, width:100}} className="img-responsive" src="/src/img/addImage.jpg" alt='addImage'/>
            </button>

            <Form method="post" encType="multipart/form-data">
            <input ref={inputRef} type="file" style={{display:'none'}} 
            accept="image/*" name="file"
            onChange={(event) => submit(event.currentTarget.form)}
            />
            </Form>

        </div>
  
        <div>
            <div className="flexRowContainer borderBottom">
          <h1>
            {discipline.name}
          </h1>
            
            <div className="flexRowContainer disciplineButtons">

            <Form action="edit">
              <button 
              className="btn btn-primary disciplineButton"
              type="submit" >Editar</button>
            </Form>
            <Form
              method="post"
              action="destroy"
              onSubmit={(event) => {
                  if (
                      // eslint-disable-next-line no-restricted-globals
                      !confirm(
                          "Please confirm you want to delete this record."
                          )
                          ) {
                              event.preventDefault();
                            }
                        }}
                        >
              <button type="submit" className="disciplineButton btn btn-danger">Eliminar</button>
            </Form>
                </div>
          
            </div>
  
          
        </div>
            <p style={{marginTop: 10}}>
             {discipline.description}
            </p>
            <div style={{display:"flex"}}>
                {discipline.parents.length > 0 ?
                <div style={{display:'flex', flex:1,flexDirection:'column'}}>
                    <h3>Madres: </h3>
                        <ul className="ul">
                            {discipline.parents.map(parent => {
                                return(
                                    <li key={parent.id}>
                                        <Link to={'/panel/discipline/'+parent.id}>
                                            {parent.name}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
               </div>
                : null}
               {discipline.childs.length > 0 ?
               <div style={{display:'flex', flex:1, flexDirection:'column'}}>
               <h3>Hijas:</h3>
               <ul className="ul">
                            {discipline.childs.map(child => {
                                return(
                                    <li key={child.id}>
                                        <Link to={'/panel/discipline/'+child.id}>
                                            {child.name}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
               </div>
                : null}
            </div>
      </div>

    )
}


export default DisciplineScreen