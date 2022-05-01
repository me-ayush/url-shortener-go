import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import './css/GetUrl.scss'

const Geturl = () => {

  const [loading, setLoading] = useState(true)

  // const domain = "http://localhost:3000/"
  const { short } = useParams();

  const resolveUrl = async () => {

    const res = await fetch(`/geturl/${short}`, {
      method: "GET"
    })

    const data = await res.json();
    if (res.status != 200 || !data) {
      setLoading(false)
    } else {
      window.location.replace(data)
    }


  }

  useEffect(() => {
    resolveUrl();
  })


  return (
    <>
      {loading ?
        <>
          <section id="geturl">
            <div className="loading-1">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </div>
          </section>
        </>
        :
        <>
          <section id="notFound">
            <main>
              <h1>404</h1>
              <h2>Short Not Found</h2>
            </main>
          </section>

        </>
      }
    </>
  )
}

export default Geturl