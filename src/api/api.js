import axios from 'axios';
import localforage from 'localforage';


export const BASEURL = 'http://127.0.0.1:3000';

const api = axios.create({
  baseURL: BASEURL,
});

const authApi = axios.create({
  baseURL: BASEURL,
});

authApi.interceptors.request.use(async config => {
  const token = await localforage.getItem('token');
  if (token) {
    config.headers['authorization'] = 'Bearer ' + token;
  }
  return config;
});

export async function login({email,password}){
    try{
        const resp = await api.post('/auth/login', {email,password}, {
          headers:{
            authorization: '',
          }  
        })
        if(resp.data.user.userPermission !== "ADMIN") throw new Error('Forbidden exception')
        await localforage.setItem('token', resp.data.token)
        await localforage.setItem('user', resp.data.user)
        return true
    }catch(e){
        console.log(e)
        alert(e.response.data.message || e.message)
        return false
    }
}

export async function getDisciplines(q){
  const URL = q ? "/discipline/search?text="+q : "/discipline" 
  try {
    const resp = await authApi.get(URL) 
    return resp.data
  } catch (error) {
    console.log(error)
  }
}

export async function getDiscipline(id){
  try {
    const resp = await authApi.get('discipline/'+id) 
    return resp.data
  } catch (error) {
    console.log(error)
  }

}

export async function updateDiscipline(data, id){
  try {
    const resp = await authApi.put('discipline/'+id, data) 
    return resp.data
  } catch (error) {
    console.log(error)
  }

}

export async function createDiscipline(data){
    try {
      const resp = await authApi.post('discipline', data) 
      return resp.data
    } catch (error) {
      console.log(error)
    }

} 

export async function deleteDiscipline(id){
try{
  const resp = await authApi.delete('discipline/'+id)
  return resp.data
}catch(e){
  console.log(e)
}
}

export async function uploadImages(formData){
  try{
    await authApi.put("image/discipline", formData, {
      headers:{
        "Content-Type":'multipart/form-data'
      }
    })
    alert("imagen cargada!")
    
  }catch(e){
    console.log(e)
    alert("error al subir imagen!")
  }
}

export async function deleteImage(id){
  try{
    await authApi.delete("image/"+id)
    alert("imagen eliminada")
  }catch(e){
    console.log(e)
    alert("no se pude eliminar imagen")
  }
}

export async function getRequest(id){
  try{
    const resp = await authApi.get('request/id/'+id)
    return resp.data
  }catch(e){
    console.log(e)
  }
}

export async function getRequestList(status, page,term){

  const url = term ? "request/"+status.toUpperCase()+'?page='+page+'&term='+term :
                    "request/"+status.toUpperCase()+'?page='+page

  try{
    const resp = await authApi.get(url)
    return resp.data
  }catch(e){
    console.log(e)
  }
}

export async function updateStatus(status, id){
  try{
    await authApi.put('request/'+id, status)
    alert("estado actualizado")
  }catch{
    alert("no se pudo actualizar el estado")
  }
}
export default api;
