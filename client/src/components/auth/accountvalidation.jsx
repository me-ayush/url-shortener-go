import React, {useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Accountactivation = () => {
    const nav = useNavigate()
    const {token} = useParams();
    console.log(token)

    const activateUser = async() =>{

        const res = await fetch(`/validation/${token}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })

        
        const data = await res.json();

        console.log(data)

        if (res.status != 200 || !data) {
            swal("Activation Error", data.error, "error").then((e)=>{
                nav('/signin')
            });
        } else {
            swal("Account Activated", "", "success").then((e)=>{
                nav('/signin')
            });
        }
    }

    useEffect(() => {
        activateUser()
    })
    

  return (
    <div></div>
  )
}

export default Accountactivation