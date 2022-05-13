import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const Accountactivation = () => {
    const nav = useNavigate()
    const { token } = useParams();
    console.log(token)

    const activateUser = async () => {

        const res = await fetch(`/validation/${token}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
        const data = await res.json();
        if (res.status != 200 || !data) {
            const finalSentence = data.error.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());

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

        } else {
            swal("Account Activated", "", "success").then((e) => {
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