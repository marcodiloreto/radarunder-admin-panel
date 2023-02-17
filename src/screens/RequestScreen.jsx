import React from "react";
import { useLoaderData, Form, redirect } from "react-router-dom";
import {getRequest, updateStatus} from '../api/api'
import { parseDateString, parseTimeString } from "../helpers/timeParser"

export async function RequestLoader({params}){
    const request = await getRequest(params.id)
    request.createdAt = new Date(request.createdAt)
    request.updatedAt = new Date(request.updatedAt)
    return request
}

export async function RequestAction({request, params}){
    const a = await request.formData()
    const data = Object.fromEntries(a);
    console.log(data)
    await updateStatus(data, params.id)
    return null
}


function RequestScreen(){
    const request = useLoaderData()
    return(
        <div id="request" style={{display:'flex', flexDirection:'column'}}>
            <h2>Request id:  {request.id}</h2>
           <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                <div>
                    <h4>Categoría solicitada:</h4>
                    <p style={{marginTop:30}}>
                        {request.disciplineName}
                    </p>
                </div>
                
                <div style={{marginRight:200}}>
                    <h4>Estado:</h4>
                <Form method="post">
                    <select name="status">
                        <option value="PENDING" selected={ request.status === 'PENDING' ? true : false}>PENDIENTE</option>
                        <option value="ACCEPTED"  selected={ request.status === 'ACCEPTED' ? true : false}>ACEPTADA</option>
                        <option value="REJECTED"  selected={ request.status === 'REJECTED' ? true : false}>RECHAZADA</option>
                    </select>
                    <button className="btn" type="submit" value="Submit"
                    style={{marginLeft:20}}
                    >
                        Guardar
                    </button>
                </Form>
                </div>
           </div>
           <div className="borderedContainer">
            <h4>Descripcion:</h4>
            <p>
                {request.description ? request.description : 'Sin descripción'}
            </p>
           </div>
           <div style={{display:'flex', flexDirection:'row', justifyContent:'center', paddingRight:200}}className="borderedContainer">
                <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <h5>
                        fecha creado
                    </h5>
                    <p style={{margin:0}}>
                        {parseTimeString(request.createdAt) + " - " + parseDateString(request.createdAt)}
                    </p>
                </div>
                <div style={{width:200}}/>
                <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <h5>
                        fecha ultima actualizacion
                    </h5>
                    <p style={{margin:0}}>
                        {parseTimeString(request.updatedAt) + " - " + parseDateString(request.updatedAt)}
                    </p>
                </div>
           </div>
        </div>
    )
}

export default RequestScreen