import { useLoaderData, Form, useNavigate, redirect } from "react-router-dom"
import { useState, useEffect } from "react";
import { arrayAddOne, arrayDeleteOne } from "../helpers/arrayStateManager";
import { updateDiscipline, createDiscipline } from "../api/api";

export function newDisciplineLoader(data){
    return {
        isNew: true,
        name:'',
        description:'',
        parents:[],
        childs:[]
    }
}

export async function createAction({request}){
    const a = await request.formData()
    const data = Object.fromEntries(a);
    data.parents = JSON.parse(data.parents)
    data.childs = JSON.parse(data.childs)
    const id = await createDiscipline(data)
    return redirect(`/panel/discipline/${id}`);
}

export async function editAction({params, request}){
   
    const a = await request.formData()
    const updates = Object.fromEntries(a);
    updates.parents = JSON.parse(updates.parents)
    updates.childs = JSON.parse(updates.childs)
    await updateDiscipline(updates,params.id )
    return redirect(`/panel/discipline/${params.id}`);
}

function DisciplineEditScreen(){
    const discipline = useLoaderData()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({ name: discipline.name, description: discipline.description });
    const [parents, setParents] = useState(discipline.parents)
    const [childs, setChilds] = useState(discipline.childs)

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
      };

    const add = (field, item) => {
        if(item.parents) delete item.parents
        if(field === 'parents'){
            if(parents.find(d => d.id === item.id) !== undefined ) return
            setParents([...arrayAddOne(parents, item)])
        }
        if(field === 'childs'){
            if(childs.find(d => d.id === item.id) !== undefined ) return
            setChilds([...arrayAddOne(childs, item)])
        }
    }

    const erase = (field, index) => {
        if(field === 'parents'){
            console.log('true el primero')
            setParents([...arrayDeleteOne(parents, index)])
        }
        if(field === 'childs'){
            console.log('true el segundo')
            setChilds([...arrayDeleteOne(childs, index)])
        }
    }

    function allowDrop(ev) {
        ev.preventDefault();
      }
    
    function dropData(ev, field){
        ev.preventDefault();
        var discipline = JSON.parse(ev.dataTransfer.getData("text"))
        add(field, discipline)
    }

return(
    <>
    {discipline.isNew ? <h2>Nueva categoría</h2> : null}
    <Form method="post" id="discipline-edit" style={{display:'flex', flexDirection:'column', marginRight:150, marginLeft:10}}
    onSubmit={(event) => {
       
    }}
    >
      <span style={{marginTop:15, marginBottom:5}}>Nombre</span>
      <input
        placeholder="Nombre"
        aria-label="name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        />

      <span style={{marginTop:15, marginBottom:5}}>Descripción</span>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={6}
        />
    <span style={{alignSelf:'center'}}> Arrastra desde la lista de categorías para rellenar </span>
    <div style={{display:"flex", flexDirection:'row'}}>
    <div style={{width:300, backgroundColor:'#e8e8e8', borderRadius:10, margin:12, padding:12}}
    onDragOver={(ev) => allowDrop(ev)} onDrop={(ev) => dropData(ev,'parents')}
    > Madres:
        <ul id="parentList">
        {parents.map((parent, index) => {
            return(
                <FamilyItem key={parent.id} discipline={parent} onClick={() => {
                    console.log('estoy haciendo algo!')
                    erase('parents', index)
                }}/>
            )
        })}
        </ul>
    </div>
    <div style={{width:300, backgroundColor:'#e8e8e8', borderRadius:10,margin:12,padding:12}}
    onDragOver={(ev) => allowDrop(ev)} onDrop={(ev) => dropData(ev,'childs')}
    >
     Hijas:
     <ul id="childList">
     {childs.map((child, index) => {
            return(
                <FamilyItem key={child.id} discipline={child} onClick={() => {
                    erase('childs', index)
                }}/>
            )
        })}
        </ul>
    </div>
    <input 
    type="hidden"
    name="parents"
    value={JSON.stringify(parents)}
    />
     <input 
    type="hidden"
    name="childs"
    value={JSON.stringify(childs)}
    />
    </div>
    <p>
      <button type="button" className="btn btn-danger"
      style={{marginLeft:10,marginRight:20}}
      onClick={() => navigate(-1)}
      >Cancel</button>

      <button type="submit" className="btn btn-primary">Save</button>
    </p>
  </Form>
  </>
)
}


function FamilyItem(props){
    const discipline = props.discipline
    return(
        <li style={{width:'100%', height:30, display:'flex', alignItems:'center'}}>
            {discipline.name}
            <div style={{flex:1}}/>
            <button type="button"
            onClick={props.onClick}
            style={{height:20, width:20, marginRight:20}}
            >
                <i 
                
                className="fa-xmark"/>
            </button>
        </li>
    )
}


export default DisciplineEditScreen