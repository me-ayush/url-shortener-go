import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../loader/loader';

const Accountactivation = () => {
    const nav = useNavigate()
    const [isloading, setLoading] = useState(false)
    const { token } = useParams();
    console.log(token)

    const activateUser = async () => {
        setLoading(true)
        const res = await fetch(`/validation/${token}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
        setLoading(false)
        const data = await res.json();
        if (res.status != 200 || !data) {
            const finalSentence = data.error.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
            if(finalSentence == "User Already Activated"){
                swal("Account Already Activated", "", "warning").then((e) => {
                    nav('/signin')
                });
            }else{

                swal({
                    title: finalSentence,
                    icon: "error",
                    buttons: {
                        catch: {
                            text: "Activate Now",
                            value: true,
                        },
                        cancel: "I will do it later",
                    },
                }).then((e) => {
                    if (e) {
                        nav('/auth/newcode')
                    } else {
                        nav('/')
                    }
                });
            }
                
        } else {
            swal("Account Activated", "", "success").then((e) => {
                nav('/signin')
            });
        }
    }

    useEffect(() => {
        activateUser()
    },[])


    return (
        <div>
            {isloading && <Loader />}
        </div>
    )
}

export default Accountactivation